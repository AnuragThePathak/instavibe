"use server"

import { INewPost } from "@/types"
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
	const file = storage.getFilePreview(
		process.env.APPWRITE_STORAGE_ID!,
		fileId,
		2000,
		2000,
		ImageGravity.Top,
		100)
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