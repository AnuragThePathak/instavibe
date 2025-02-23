"use client"

import { useGetAvatarQuery } from "@/react-query/queries"
import { useEffect, useState } from "react"
import Image from "next/image"

export default function AvatarWrapper({ email, className }: { email: string, className: string }) {
	const { data: avatarBuffer } = useGetAvatarQuery(email)
	const [avatarSrc, setAvatarSrc] = useState<string>("")

	useEffect(() => {
		if (avatarBuffer) {
			const blob = new Blob([avatarBuffer], { type: "image/png" })
			const blobUrl = URL.createObjectURL(blob)
			setAvatarSrc(blobUrl)

			return () => URL.revokeObjectURL(blobUrl)
		}
	}, [avatarBuffer])

	return (
		<Image
			src={avatarSrc || "/icons/profile-placeholder.svg"}
			alt="creator"
			className={`rounded-full ${className}`}
			width="10"
			height="10"
		/>
	)
}