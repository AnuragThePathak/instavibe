import QUERY_KEYS from "@/constants/queries"
import { getRecentPosts } from "@/server/post-requests"
import { getCurrentUser } from "@/server/user-requests"
import { useQuery } from "@tanstack/react-query"

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