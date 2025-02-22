import { useUserContext } from "@/context/authcontext"
import Image from "next/image"
import Link from "next/link"
import { Models } from "node-appwrite"
import PostStats from "../others/poststats"

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
						<Image
							src={post.imageUrl || "/icons/profile-placeholder.svg"}
							alt="post"
							className="h-full w-full object-cover"
							width={80}
							height={80}
						/>
					</Link>

					<div className="grid-post_user">
						{showUsers && (
							<div className="flex items-center justify-start gap-2 flex-1">
								<Image
									src={post.creator?.imageUrl || "/icons/profile-placeholder.svg"}
									alt="creator"
									className="rounded-full w-8 h-8"
									width={8}
									height={8}
								/>

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