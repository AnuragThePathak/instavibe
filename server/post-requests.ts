"use server"

import { INewPost, IUpdatePost } from "@/types"
import { ID, ImageGravity, Query } from "node-appwrite"
import { createAdminClient } from "./appwrite"

// Post requests
export async function createPost(post: INewPost) {
	const { databases } = await createAdminClient()

	const uploaded = await uploadFile(post.file[0])

	const tags = post.tags?.replace(/ /g, "").split(",") || []

	let newPost = null
	try {
		newPost = await databases.createDocument(
			process.env.APPWRITE_DATABASE_ID!,
			process.env.APPWRITE_POST_COLLECTION_ID!,
			ID.unique(),
			{
				creator: post.userId,
				caption: post.caption,
				location: post.location,
				tags,
				imageId: uploaded.$id,
			}
		)
	} catch (e) {
		console.error(e)
		deleteFile(uploaded.$id)
	}

	return newPost
}

export async function updatePost(post: IUpdatePost) {
	const { databases } = await createAdminClient()

	const hasFileToUpdate = post.file.length > 0

	let image = {
		imageId: post.imageId,
	}

	if (hasFileToUpdate) {
		const uploaded = await uploadFile(post.file[0])

		image = {
			...image, imageId: uploaded.$id
		}
	}

	const tags = post.tags?.replace(/ /g, "").split(",") || []

	let updatedPost = null
	try {
		updatedPost = await databases.updateDocument(
			process.env.APPWRITE_DATABASE_ID!,
			process.env.APPWRITE_POST_COLLECTION_ID!,
			post.postId,
			{
				caption: post.caption,
				location: post.location,
				tags,
				imageId: image.imageId,
			}
		)
	} catch (e) {
		console.error(e)
		if (hasFileToUpdate) {
			await deleteFile(image.imageId)
		}
	}

	if (hasFileToUpdate) {
		await deleteFile(post.imageId)
	}

	return updatedPost
}

export async function deletePost(postId: string, imageId: string) {
	const { databases } = await createAdminClient()
	const status = await databases.deleteDocument(
		process.env.APPWRITE_DATABASE_ID!,
		process.env.APPWRITE_POST_COLLECTION_ID!,
		postId
	)

	deleteFile(imageId)
	return status
}

export async function uploadFile(file: File) {
	const { storage } = await createAdminClient()

	const uploaded = await storage.createFile(
		process.env.APPWRITE_STORAGE_ID!,
		ID.unique(),
		file)

	let preview = null
	try {
		preview = await getFilePreview(uploaded.$id)
	} catch (e) {
		console.error(e)
		deleteFile(uploaded.$id)
	}

	if (!preview) {
		throw new Error("Failed to upload file.")
	}

	return uploaded
}

export async function deleteFile(fileId: string) {
	const { storage } = await createAdminClient()
	storage.deleteFile(process.env.APPWRITE_STORAGE_ID!, fileId)
	return { status: "ok" }
}

export async function getFilePreview(fileId: string) {
	const { storage } = await createAdminClient()
	const file = await storage.getFilePreview(
		process.env.APPWRITE_STORAGE_ID!,
		fileId,
		2000,
		2000,
		ImageGravity.Top,
		100)
	return file
}

export async function getFile(fileId: string) {
	const { storage } = await createAdminClient()
	const file = await storage.getFileDownload(
		process.env.APPWRITE_STORAGE_ID!,
		fileId
	)
	return file
}

export async function getRecentPosts() {
	const { databases } = await createAdminClient()
	const posts = await databases.listDocuments(
		process.env.APPWRITE_DATABASE_ID!,
		process.env.APPWRITE_POST_COLLECTION_ID!,
		[Query.orderDesc("$createdAt"), Query.limit(20)]
	)
	return posts
}

export async function likePost(postId: string, likesArray: string[]) {
	const { databases } = await createAdminClient()
	const updatedPost = await databases.updateDocument(
		process.env.APPWRITE_DATABASE_ID!,
		process.env.APPWRITE_POST_COLLECTION_ID!,
		postId,
		{ likes: likesArray }
	)
	return updatedPost
}

export async function savePost(postId: string, userId: string) {
	const { databases } = await createAdminClient()
	const saved = await databases.createDocument(
		process.env.APPWRITE_DATABASE_ID!,
		process.env.APPWRITE_SAVE_COLLECTION_ID!,
		ID.unique(),
		{
			post: postId,
			user: userId,
		}
	)
	return saved
}

export async function unsavePost(saveId: string) {
	const { databases } = await createAdminClient()
	const status = await databases.deleteDocument(
		process.env.APPWRITE_DATABASE_ID!,
		process.env.APPWRITE_SAVE_COLLECTION_ID!,
		saveId
	)
	return status
}

export async function getPostById(postId: string) {
	const { databases } = await createAdminClient()
	const post = await databases.getDocument(
		process.env.APPWRITE_DATABASE_ID!,
		process.env.APPWRITE_POST_COLLECTION_ID!,
		postId
	)
	return post
}

export async function getInfinitePosts({ pageParam }: { pageParam: string | null }) {
	const { databases } = await createAdminClient()

	const queries = [Query.orderDesc("$updatedAt"), Query.limit(9)]
	
	// Only add cursorAfter if a valid pageParam exists
	if (pageParam) {
		queries.push(Query.cursorAfter(pageParam))
	}

	return await databases.listDocuments(
		process.env.APPWRITE_DATABASE_ID!,
		process.env.APPWRITE_POST_COLLECTION_ID!,
		queries
	)
}


export async function searchPosts(searchTerm: string) {
	const { databases } = await createAdminClient()
	const posts = await databases.listDocuments(
		process.env.APPWRITE_DATABASE_ID!,
		process.env.APPWRITE_POST_COLLECTION_ID!,
		[Query.search("caption", searchTerm)]
	)
	return posts
}