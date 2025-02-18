import BottomBar from "@/components/bars/bottombar"
import LeftBar from "@/components/bars/leftbar"
import Topbar from "@/components/bars/topbar"
import { ReactNode } from "react"

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<div className="w-full md:flex">
			<Topbar />
			<LeftBar />

			<section className="flex flex-1 h-full">
				{children}
			</section>
			
			<BottomBar />
		</div>
	)
}