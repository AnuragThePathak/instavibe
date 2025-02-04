"use client"

import { bottombarLinks } from "@/constants"
import { INavLink } from "@/types"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function BottomBar() {
	const pathname = usePathname()
	return (
		<section className="bottom-bar">
			{bottombarLinks.map((link: INavLink) => {
				const isActive = link.route === pathname

				return (
					<Link href={link.route}
						key={link.label}
						className={`flex-center flex-col gap-1 p-2 transition
									 ${isActive && "bg-primary-500 rounded-[10px]"}`}>

						<Image src={link.imgURL} alt={link.label} width="24" height="24"
							className={`group-hover:invert-white ${isActive && "invert-white"}`} />
						<p className="tiny-medium text-light-2">
							{link.label}
						</p>
					</Link>
				)
			})}
		</section>
	)
}