"use client"

import { useGetImageQuery } from "@/react-query/queries"
import { useEffect, useState } from "react"
import Image from "next/image"
import Loader from "../loaders/spinner"

export default function PostWrapper({ imageId }: { imageId: string }) {
	const { data: imageBuffer, isPending: isLoadingImage } = useGetImageQuery(imageId)
	const [imageSrc, setImageSrc] = useState<string>("")

	useEffect(() => {
		if (imageBuffer) {
			const blob = new Blob([imageBuffer], { type: "image/png" }) // Adjust MIME type if needed
			const blobUrl = URL.createObjectURL(blob)
			setImageSrc(blobUrl)

			return () => URL.revokeObjectURL(blobUrl) // Cleanup
		}
	}, [imageBuffer])

	return (
		<>
			{isLoadingImage ? (<div className="h-80 w-full">
				<Loader />
			</div>
			) :
				<Image
					src={imageSrc || "/icons/profile-placeholder.svg"}
					className="post-card_img"
					alt="post image"
					width={500}
					height={500}
				/>}
		</>
	)
}