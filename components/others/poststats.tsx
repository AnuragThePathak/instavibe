import { useLikePostMutation, useSavePostMutation, useUnsavePostMutation } from "@/react-query/mutations-queries"
import { useGetCurrentUserQuery } from "@/react-query/queries"
import { checkIsLiked } from "@/utils"
import Image from "next/image"
import { Models } from "node-appwrite"
import { useEffect, useState } from "react"
import { MouseEvent } from "react"
import Loader from "../loaders/spinner"

type PostStatsProps = {
	post: Models.Document
	userId: string
}

export default function PostStats({ post, userId }: PostStatsProps) {
	const likedList = post.likes.map((user: Models.Document) => user.$id)

	const [likes, setLikes] = useState<string[]>(likedList)
	const [isSaved, setIsSaved] = useState<boolean>(false)

	const { mutate: likePost } = useLikePostMutation()
	const { mutate: savePost, isPending: isSaving } = useSavePostMutation()
	const { mutate: unsavePost, isPending: isUnsaving } = useUnsavePostMutation()

	const { data: currentUser } = useGetCurrentUserQuery()

	const savedPosts = currentUser?.save
		.find((record: Models.Document) => record.post?.$id === post.$id)

	useEffect(() => {
		setIsSaved(!!savedPosts)
	}, [currentUser, savedPosts])

	const handleLike = (
		event: MouseEvent<HTMLImageElement>
	) => {
		event.preventDefault()

		let newLikes = [...likes]
		if (newLikes.includes(userId)) {
			newLikes = newLikes.filter(id => id !== userId)
		} else {
			newLikes.push(userId)
		}

		setLikes(newLikes)
		likePost({ postId: post.$id, likesArray: newLikes })
	}

	const handleSave = (
		e: MouseEvent<HTMLImageElement>
	) => {
		e.preventDefault()

		if (savedPosts) {
			setIsSaved(false)
			unsavePost(savedPosts.$id)
		} else {
			savePost({ postId: post.$id, userId })
			setIsSaved(true)
		}
	}

	return (
		<div className="flex justify-between items-center z-20">
			<div className="flex gap-5 mr-5">
				<Image
					src={checkIsLiked(likes, userId) ? "/icons/liked.svg" : "/icons/like.svg"}
					alt="Like"
					width={20}
					height={20}
					onClick={handleLike}
					className="cursor-pointer"
				/>
				<p>{likes.length}</p>
			</div>

			<div className="flex gap-2">
				{isSaving || isUnsaving ?
					<Loader /> :
					<Image
						src={isSaved ? "/icons/saved.svg" : "/icons/save.svg"}
						alt="save"
						width={20}
						height={20}
						onClick={(e) => handleSave(e)}
						className="cursor-pointer"
					/>}
			</div>
		</div>
	)
}