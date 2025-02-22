import PostForm from "@/components/forms/postform"
import Image from "next/image"

export default function Page() {
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
					<h1 className="h3-bold md:h2-bold text-left w-full">Create Post</h1>
				</div>
				
				<PostForm action="create" />
			</div>
		</div>
	)
}