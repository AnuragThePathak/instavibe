import Image from "next/image"
import { redirect } from "next/navigation"
import { ReactNode } from "react"

export default function Layout({ children }: { children: ReactNode }) {
	const isAuthenticated = false
	if (isAuthenticated) {
		redirect("/")
	}

	return (
		<div className="flex h-screen">
			{/* Main Content Section */}
			<section className="flex-1 flex flex-col justify-center items-center py-10">
				{children}
			</section>

			{/* Side Image Section */}
			<div className="relative hidden xl:block w-1/2 h-full">
				<Image
					src="/images/side-img.svg"
					alt="background"
					fill
					className="object-cover"
				/>
			</div>
		</div>
	)
}
