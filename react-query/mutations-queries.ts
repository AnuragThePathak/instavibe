import QUERY_KEYS from "@/constants/queries"
import { createPost, deletePost, likePost, savePost, unsavePost, updatePost } from "@/server/post-requests"
import { createUser, loginUser, logoutUser, sendVerificationEmail, updateUser, verifyEmail } from "@/server/user-requests"
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types"
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
				queryKey: QUERY_KEYS.GET_INFINITE_POSTS
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
				queryKey: [QUERY_KEYS.GET_INFINITE_POSTS]
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
				queryKey: QUERY_KEYS.GET_INFINITE_POSTS
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
				queryKey: QUERY_KEYS.GET_INFINITE_POSTS
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
				queryKey: QUERY_KEYS.GET_INFINITE_POSTS
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

export const useVerifyEmailMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({ userId, secret }: { userId: string, secret: string }) => verifyEmail(userId, secret),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.GET_CURRENT_USER
			})
		}
	})
}

export const useSendVerificationEmail = () => {
	return useMutation({
		mutationFn: () => sendVerificationEmail()
	})
}

export const useUpdateUserMutation = () => {
	const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: IUpdateUser) => updateUser(user),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
      });
    },
  });
}