"use client"

import PostStats from "@/components/others/poststats"
import { useGetPostByIDQuery } from "@/react-query/queries"
import Link from "next/link"
import moment from "moment"
import { redirect, useParams } from "next/navigation"
import Image from "next/image"
import Loader from "@/components/loaders/spinner"
import { useUserContext } from "@/context/authcontext"
import { Button } from "@/components/ui/button"
import { useDeletePostMutation } from "@/react-query/mutations-queries"
import PostWrapper from "@/components/wrappers/postwrapper"
import AvatarWrapper from "@/components/wrappers/avatarwrapper"

export default function Page() {
	const { id } = useParams<{ id: string }>()
	const { data: post, isLoading } = useGetPostByIDQuery(id)
	const { mutate: deletePost } = useDeletePostMutation()
	const { user } = useUserContext()
	const handleDelete = () => { 
		deletePost({ postId: id, imageId: post?.imageId })
		redirect("/")
	}

	return (
		<div className="post_details-container">
			{isLoading || !post ? <Loader /> : (
				<div className="post_details-card">
					<PostWrapper imageId={post.imageId} className="post_details-img" />

					<div className="post_details-info">
						<div className="flex-between w-full">
							<Link href={`/profile/${post.creator.$id}`}
								className="flex items-center gap-3">
									<AvatarWrapper email={post.creator?.email} className="w-8 h-8 lg:w-12 lg:h-12" />

								<div className="flex gap-1 flex-col">
										<p className="base-medium lg:body-bold text-light-1">
											{post.creator?.name}
										</p>
									<div className="flex-center gap-2 text-light-3">
										<p className="subtle-semibold lg:small-regular">
											{moment(post.$createdAt).fromNow()}
										</p>
										<p className="subtle-semibold lg:small-regular">
											{post.location}
										</p>
									</div>
								</div>
							</Link>

							<div className="flex-center gap-4">
								<Link href={`/update-post/${post.$id}`}
									className={`${post.creator.$id !== user.id && "hidden"}`}>
									<Image
										src="/icons/edit.svg"
										alt="edit"
										height={24}
										width={24} />
								</Link>

								<Button
									variant="ghost"
									onClick={handleDelete}
									className={`post_details-delete_btn
									 ${post.creator.$id !== user.id && "hidden"}`}>
									<Image
										src="/icons/delete.svg"
										alt="delete"
										height={24}
										width={24}
									/>
								</Button>
							</div>
						</div>

						<hr className="border w-full border-dark-4/80" />

						<div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
							<p>{post.caption}</p>
							<ul className="flex gap-1 mt-2">
								{post.tags.map((tag: string, index: string) => (
									<li key={`${tag}${index}`} className="tag text-light-3">
										#{tag}
									</li>
								))}
							</ul>
						</div>

						<div className="w-full">
							<PostStats post={post} userId={user.id} />
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
