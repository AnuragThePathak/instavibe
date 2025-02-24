"use client"

import GridPostList from "@/components/lists/gridpostlist"
import LikedPosts from "@/components/lists/liked"
import Loader from "@/components/loaders/spinner"
import { Button } from "@/components/ui/button"
import AvatarWrapper from "@/components/wrappers/avatarwrapper"
import { useUserContext } from "@/context/authcontext"
import { useGetUserById } from "@/react-query/queries"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"

interface StabBlockProps {
	value: string | number
	label: string
}

const StatBlock = ({ value, label }: StabBlockProps) => (
	<div className="flex-center gap-2">
		<p className="small-semibold lg:body-bold text-primary-500">{value}</p>
		<p className="small-medium lg:base-medium text-light-2">{label}</p>
	</div>
)

export default function Page() {
	const { id } = useParams<{ id: string }>()
	const { user } = useUserContext()
	const [showLiked, setShowLiked] = useState(false)

	const { data: currentUser } = useGetUserById(id)

	if (!currentUser)
		return (
			<div className="flex-center w-full h-full">
				<Loader />
			</div>
		)

	return (
		<div className="profile-container">
			<div className="profile-inner_container">
				<div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
					<AvatarWrapper email={currentUser.email} className="w-28 h-28 lg:h-36 lg:w-36 rounded-full" />
					<div className="flex flex-col flex-1 justify-between md:mt-2">
						<div className="flex flex-col w-full">
							<h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
								{currentUser.name}
							</h1>
							<p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
								@{currentUser.username}
							</p>
						</div>

						<div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
							<StatBlock value={currentUser.posts.length} label="Posts" />
							<StatBlock value={20} label="Followers" />
							<StatBlock value={20} label="Following" />
						</div>

						<p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
							{currentUser.bio}
						</p>
					</div>

					<div className="flex justify-center gap-4">
						<div className={`${user.id !== currentUser.$id && "hidden"}`}>
							<Link
								href={`/update-profile/${currentUser.$id}`}
								className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${user.id !== currentUser.$id && "hidden"
									}`}>
								<Image
									src="/icons/edit.svg"
									alt="edit"
									width={20}
									height={20}
								/>
								<p className="flex whitespace-nowrap small-medium">
									Edit Profile
								</p>
							</Link>
						</div>
						<div className={`${user.id === id && "hidden"}`}>
							<Button type="button" className="shad-button_primary px-8">
								Follow
							</Button>
						</div>
					</div>
				</div>
			</div>

			{currentUser.$id === user.id && (
				<div className="flex max-w-5xl w-full">
					<Button
						onClick={() => setShowLiked(false)}
						className={`profile-tab rounded-l-lg ${!showLiked && "!bg-dark-3"
							}`}>
						<Image
							src="/icons/posts.svg"
							alt="posts"
							width={20}
							height={20}
						/>
						Posts
					</Button>
					<Button
						onClick={() => setShowLiked(true)}
						className={`profile-tab rounded-r-lg ${showLiked && "!bg-dark-3"
							}`}>
						<Image
							src="/icons/like.svg"
							alt="like"
							width={20}
							height={20}
						/>
						Liked Posts
					</Button>
				</div>
			)}

			{!showLiked &&
				<GridPostList posts={currentUser.posts} showUsers={false} showStats={false} />}
			{currentUser.$id === user.id && showLiked &&
				<LikedPosts />}
		</div>
	)
}