import { useUserContext } from "@/context/authcontext"

import Link from "next/link"
import { Models } from "node-appwrite"
import PostStats from "../others/poststats"
import PostWrapper from "../wrappers/postwrapper"
import AvatarWrapper from "../wrappers/avatarwrapper"

interface GridPostListProps {
	posts: Models.Document[]
	showUsers?: boolean
	showStats?: boolean
}

export default function GridPostList({ posts, showUsers = true, showStats = true }: GridPostListProps) {
	const { user } = useUserContext()

	return (
		<ul className="grid-container">
			{posts.map((post) => (
				<li key={post.$id} className="relative min-w-80 h-80">
					<Link href={`/posts/${post.$id}`} className="grid-post_link">
						<PostWrapper imageId={post.imageId} className="h-full w-full object-cover" />
					</Link>

					<div className="grid-post_user">
						{showUsers && (
							<div className="flex items-center justify-start gap-2 flex-1">
								<AvatarWrapper email={post.creator?.email} className="w-8 h-8" />

								<p className="line-clamp-1">{post.creator.name}</p>
							</div>
						)}

						{showStats && (
							<PostStats post={post} userId={user.id} />
						)}
					</div>
				</li>
			))}
		</ul>
	)
}