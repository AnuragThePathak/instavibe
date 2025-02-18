"use client"

import { useUserContext } from "@/context/authcontext"
import moment from "moment"
import Image from "next/image"
import Link from "next/link"
import { Models } from "node-appwrite"
import PostStats from "../others/poststats"

export default function PostCard({ post }: { post: Models.Document }) {
	const { user } = useUserContext()

	return (
		<div className="post-card">
			<div className="flex-between">
				<div className="flex items-center gap-3">
					<Link href={`/profile/${post.creator.$id}`}>
						<Image
							src={post?.creator?.imageUrl || "/icons/profile-placeholder.svg"}
							alt="creator"
							className="rounded-full w-10 lg:h-12"
							width="10"
							height="10"
						/>
					</Link>

					<div className="flex flex-col">
						<p className="base-medium lg:body-bold text-light-1">{post.creator.name}</p>
						<div className="flex-center gap-2 text-light-3">
							<p className="subtle-semibold lg:small-regular">
								{moment(post.$createdAt).fromNow()}
							</p>
							<p className="subtle-semibold lg:small-regular">
								{post.location}
							</p>
						</div>
					</div>
				</div>

				<Link href={`/update-post/${post.$id}`}
					className={`${post.creator.$id !== user.id && "hidden"}`}>
					<Image src="icons/edit.svg" alt="edit" width="20" height="20" />
				</Link>
			</div>

			<Link href={`/post/${post.$id}`}>
				<div className="small-medium lg:base-medium py-5">
					<p>{post.caption}</p>
					<ul className="flex gap-1 mt-2">
						{post.tags.map((tag: string) => (
							<li key={tag} className="tag text-light-3">
								#{tag}
							</li>
						))}
					</ul>
				</div>

				<Image
					src={post.imageUrl || "/icons/profile-placeholder.svg"}
					className="post-card_img"
					alt="post image"
					width={500}
					height={500}
				/>
			</Link>

			<PostStats post={post} userId={user.id} />
		</div>
	)
}