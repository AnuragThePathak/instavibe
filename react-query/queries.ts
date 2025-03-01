import QUERY_KEYS from "@/constants/queries"
import { getFile, getFilePreview, getInfinitePosts, getPostById, searchPosts } from "@/server/post-requests"
import { getAllUsers, getAvatar, getCurrentUser, getUserById } from "@/server/user-requests"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"

export const useGetCurrentUserQuery = () => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_CURRENT_USER],
		queryFn: () => getCurrentUser()
	})
}

export const useGetPostByIDQuery = (postId: string) => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
		queryFn: () => getPostById(postId),
		enabled: !!postId
	})
}

export const useGetPreviewQuery = (fileId: string) => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_PREVIEW, fileId],
		queryFn: () => getFilePreview(fileId),
		enabled: !!fileId
	})
}

export const useGetImageQuery = (fileId: string) => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_IMAGE, fileId],
		queryFn: () => getFile(fileId),
		enabled: !!fileId
	})
}

export const useGetAvatarQuery = (email: string) => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_AVATAR, email],
		queryFn: () => getAvatar(email),
		enabled: !!email
	})
}

export const useGetPostsQuery = () => {
	return useInfiniteQuery({
		queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
		queryFn: getInfinitePosts,
		initialPageParam: null, // ✅ Ensure this matches the new type (string | null)
		getNextPageParam: (lastPage) => {
			if (lastPage && lastPage.documents.length > 0) {
				// ✅ Return last document ID as string, since Appwrite uses cursor-based pagination
				return lastPage.documents[lastPage.documents.length - 1].$id
			}
			return null
		}
	})
}

export const useSearchPostsQuery = (searchValue: string) => {
	return useQuery({
		queryKey:[QUERY_KEYS.SEARCH_POSTS, searchValue],
		queryFn: () => searchPosts(searchValue),
		enabled: !!searchValue
	})
}

export const useGetUserById = (userId: string) => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
		queryFn: () => getUserById(userId),
		enabled: !!userId
	})
}

export const useGetUsersQuery = () => {
	return useInfiniteQuery({
		queryKey: [QUERY_KEYS.GET_USERS],
		queryFn: getAllUsers,
		initialPageParam: null,
		getNextPageParam: (lastPage) => {
			let lastId = null
			if (lastPage && lastPage.documents.length > 0) {
				lastId = lastPage.documents[lastPage.documents.length - 1].$id
			}
			return lastId
		}
	})
}