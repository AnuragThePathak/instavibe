"use client"

import GridPostList from "@/components/lists/gridpostlist"
import Loader from "@/components/loaders/spinner"
import { useGetCurrentUserQuery } from "@/react-query/queries"
import { Models } from "node-appwrite"
import Image from "next/image"

export default function Page() {
	const { data: currentUser } = useGetCurrentUserQuery()

	const savedPosts = currentUser?.save
		.map((savedPost: Models.Document) => ({
			...savedPost.post
		}))
		.reverse()

	return (
		<div className="saved-container">
			<div className="flex gap-2 w-full max-w-5xl">
				<Image
					src="/icons/save.svg"
					width={36}
					height={36}
					alt="edit"
					className="invert-white"
				/>
				<h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
			</div>

			{!currentUser ? (
				<Loader />
			) : (
				<ul className="w-full flex justify-center max-w-5xl gap-9">
					{savedPosts.length === 0 ? (
						<p className="text-light-4">No available posts</p>
					) : (
						<GridPostList posts={savedPosts} showStats={false} showUsers={false} />
					)}
				</ul>
			)}
		</div>
	)
}