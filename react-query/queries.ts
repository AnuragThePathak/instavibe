import QUERY_KEYS from "@/constants/queries"
import { getFile, getFilePreview, getInfinitePosts, getPostById, getRecentPosts, searchPosts } from "@/server/post-requests"
import { getAvatar, getCurrentUser, getUserById } from "@/server/user-requests"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"

export const useRecentPostsQuery = () => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
		queryFn: () => getRecentPosts()
	})
}

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
		getNextPageParam: (lastPage) => {
			let lastId = null
			if (lastPage && lastPage.documents.length > 0) {
				lastId = lastPage.documents[lastPage.documents.length - 1].$id
			}
			return lastId
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