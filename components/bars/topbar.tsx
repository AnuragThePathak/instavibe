"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "../ui/button"
import { useLogoutUserMutation } from "@/react-query/mutations-queries"
import { useEffect } from "react"
import { redirect } from "next/navigation"
import { useUserContext } from "@/context/authcontext"

export default function Topbar() {
	const { mutate: logout, isSuccess: loggedOut } = useLogoutUserMutation()
	const { user } = useUserContext()

	useEffect(() => {
		if (loggedOut) {
			redirect("/accounts/login")
		}
	}, [loggedOut])

	return (
		<section className="topbar">
			<div className="flex-between py-4 px-5">
				<Link href="/" className="flex gap-3 items-center">
					<Image
						src="images/logo.svg"
						alt="logo"
						width="130"
						height="325"
					/>
				</Link>

				<div className="flex gap-4">
					<Button variant="ghost" className="shad-button_ghost" onClick={() => logout()}>
						<Image
							src="/icons/logout.svg"
							alt="logout"
							height="20"
							width="20"
						/>
					</Button>

					<Link href={`/profile/${user.id}`} className="flex-center gap-3">
						<Image
							src={user.imageUrl || "/icons/profile-placeholder.svg"}
							alt="profile"
							height="8"
							width="8"
							className="rounded-full"
						/>
					</Link>
				</div>
			</div>
		</section>
	)
}