"use client"

import { sidebarLinks } from "@/constants"
import { AUTH_STATUS, INITIAL_USER, useUserContext } from "@/context/authcontext"
import { useLogoutUserMutation } from "@/react-query/mutations-queries"
import { INavLink } from "@/types"
import Image from "next/image"
import Link from "next/link"
import { redirect, usePathname } from "next/navigation"
import { Button } from "../ui/button"
import AvatarWrapper from "../wrappers/avatarwrapper"

export default function LeftBar() {
	const { mutateAsync: logout, isPending: isLoggingOut } = useLogoutUserMutation()
	const { user, setIsAuthenticated, setUser } = useUserContext()
	const pathname = usePathname()

	const handleLogout = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    await logout();
    setIsAuthenticated(AUTH_STATUS.UNAUTHORIZED)
    setUser(INITIAL_USER);
    redirect("/accounts/login");
  };

	return (
		<nav className="leftsidebar max-h-screen">
			<div className="flex flex-col gap-11">
				<Link href="/" className="flex items-center gap-3">
					<Image src="/images/logo.svg" alt="logo" width="170" height="36" />
				</Link>

				<Link href={`/profile/${user.id}`} className="flex items-center gap-3">
				<AvatarWrapper email={user.email} className="w-10 h-10" />

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
			<Button variant="ghost" 
			className="shad-button_ghost group" 
			disabled={isLoggingOut} 
			onClick={(e) => handleLogout(e)}>
				<Image
					src="/icons/logout.svg"
					alt="logout"
					height="24"
					width="24"
					className="group-hover:invert-white"
				/>
				<p className="small-medium lg:base-medium ">Logout</p>
			</Button>
		</nav>
	)
}