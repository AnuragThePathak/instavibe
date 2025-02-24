import GridPostList from "@/components/lists/gridpostlist"
import Loader from "@/components/loaders/spinner"
import { useGetCurrentUserQuery } from "@/react-query/queries"

export default function LikedPosts() {
	const { data: currentUser } = useGetCurrentUserQuery()

	if (!currentUser)
		return (
			<div className="flex-center w-full h-full">
				<Loader />
			</div>
		)

	return (
		<>
			{currentUser.liked.length === 0 && (
				<p className="text-light-4">No liked posts</p>
			)}

			<GridPostList posts={currentUser.liked} showStats={false} />
		</>
	)
}