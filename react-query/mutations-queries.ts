import QUERY_KEYS from "@/constants/queries"
import { createPost, deletePost, likePost, savePost, unsavePost, updatePost } from "@/server/post-requests"
import { createUser, loginUser, logoutUser } from "@/server/user-requests"
import { INewPost, INewUser, IUpdatePost } from "@/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useCreateUserMutation = () => {
	return useMutation({
		mutationFn: (user: INewUser) => createUser(user)
	})
}

export const useLoginUserMutation = () => {
	return useMutation({
		mutationFn: (user: { email: string, password: string }) => loginUser(user)
	})
}

export const useLogoutUserMutation = () => {
	return useMutation({
		mutationFn: () => logoutUser()
	})
}

export const useCreatePostMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (post: INewPost) => createPost(post),
		onSuccess: () => {
			// Invalidate the query to get the new post
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.GET_RECENT_POSTS
			})
		}
	})
}

export const useUpdatePostMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (post: IUpdatePost) => updatePost(post),
		onSuccess: (data) => {
			// Invalidate the query to get the updated post
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
			})
		}
	})
}

export const useDeletePostMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn:
			({ postId, imageId }: { postId: string, imageId: string }) =>
				deletePost(postId, imageId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
			})
		}
	})
}

export const useLikePostMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({ postId, likesArray }: { postId: string, likesArray: string[] }) => likePost(postId, likesArray),
		onSuccess: (data) => {
			// Invalidate the query to get the updated post
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_POST_BY_ID, data.$id]
			})

			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.GET_RECENT_POSTS
			})

			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.GET_POSTS
			})

			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.GET_CURRENT_USER
			})
		}
	})
}

export const useSavePostMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({ postId, userId }: { postId: string, userId: string }) => savePost(postId, userId),
		onSuccess: () => {

			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.GET_RECENT_POSTS
			})

			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.GET_POSTS
			})

			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.GET_CURRENT_USER
			})
		}
	})
}

export const useUnsavePostMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (saveId: string) => unsavePost(saveId),
		onSuccess: () => {

			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.GET_RECENT_POSTS
			})

			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.GET_POSTS
			})

			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.GET_CURRENT_USER
			})
		}
	})
}