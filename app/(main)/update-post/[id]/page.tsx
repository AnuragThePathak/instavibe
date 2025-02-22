"use client"

import PostForm from "@/components/forms/postform"
import Loader from "@/components/loaders/spinner"
import { useGetPostByIDQuery } from "@/react-query/queries"
import Image from "next/image"
import { useParams } from "next/navigation"

export default function Page() {
	const { id } = useParams<{ id: string }>()
	const { data: post, isLoading } = useGetPostByIDQuery(id || "")

	if (isLoading) {
		return (
			<div className="flex-center w-full h-full">
        <Loader />
      </div>
		)
	}

	return (
		<div className="flex flex-1 min-h-screen">
			<div className="common-container">
				<div className="max-w-5xl flex-start gap-3 justify-start w-full">
					<Image
						src="/icons/add-post.svg"
						width="36"
						height="36"
						alt="Add post"
					/>
					<h1 className="h3-bold md:h2-bold text-left w-full">Edit Post</h1>
				</div>

				<PostForm action="update" post={post} />
			</div>
		</div>
	)
}