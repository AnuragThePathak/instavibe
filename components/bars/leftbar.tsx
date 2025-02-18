"use client"

import { sidebarLinks } from "@/constants"
import { useUserContext } from "@/context/authcontext"
import { useLogoutUserMutation } from "@/react-query/mutations-queries"
import { INavLink } from "@/types"
import Image from "next/image"
import Link from "next/link"
import { redirect, usePathname } from "next/navigation"
import { useEffect } from "react"
import { Button } from "../ui/button"

export default function LeftBar() {
	const { mutate: logout, isSuccess: loggedOut } = useLogoutUserMutation()
	const { user } = useUserContext()
	const pathname = usePathname()

	useEffect(() => {
		if (loggedOut) {
			redirect("/accounts/login")
		}
	}, [loggedOut])

	return (
		<nav className="leftsidebar max-h-screen">
			<div className="flex flex-col gap-11">
				<Link href="/" className="flex items-center gap-3">
					<Image src="/images/logo.svg" alt="logo" width="170" height="36" />
				</Link>

				<Link href={`/profile/${user.id}`} className="flex items-center gap-3">
					<Image
						src={user.imageUrl || "/icons/profile-placeholder.svg"}
						alt="profile" width="36" height="36"
						className="rounded-full" />

					<div className="flex flex-col">
						<p className="body-bold">
							{user.name}
						</p>
						<p className="small-regular text-light-3">
							@{user.username}
						</p>
					</div>
				</Link>

				<ul className="flex flex-col gap-6">
					{sidebarLinks.map((link: INavLink) => {
						const isActive = link.route === pathname

						return (
							<li key={link.label}
								className={`leftsidebar-link group ${isActive && "bg-primary-500"}`}>
								<Link href={link.route}
									className="flex gap-4 items-center p-4">
									<Image src={link.imgURL} alt={link.label} width="24" height="24"
										className={`group-hover:invert-white ${isActive && "invert-white"}`} />
									{link.label}
								</Link>
							</li>
						)
					})}
				</ul>

			</div>
			<Button variant="ghost" className="shad-button_ghost" onClick={() => logout()}>
				<Image
					src="/icons/logout.svg"
					alt="logout"
					height="24"
					width="24"
				/>
				<p className="small-medium lg:base-medium">Logout</p>
			</Button>
		</nav>
	)
}