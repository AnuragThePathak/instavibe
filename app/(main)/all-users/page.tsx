"use client"

import UserCard from "@/components/cards/usercard"
import Loader from "@/components/loaders/spinner"
import toast from "react-hot-toast"
import { useGetUsersQuery } from "@/react-query/queries"
import { useEffect } from "react"
import { useInView } from "react-intersection-observer"

export default function Page() {
	const { ref: inViewRef, inView } = useInView()

	const { data: creators, fetchNextPage, hasNextPage, isError: isErrorCreators } = useGetUsersQuery()

	useEffect(() => {
			if (inView) {
				fetchNextPage()
			}
		}, [fetchNextPage, inView])

	if (isErrorCreators) {
		toast.error("Something went wrong.")

		return
	}

	return (
		<div className="common-container">
			<div className="user-container">
				<h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
				{!creators ? (
					<Loader />
				) : (
					<ul className="user-grid">
						{creators.pages.map((items) => (
							items.documents.map((creator) => (
								<li key={creator?.$id} className="flex-1 min-w-[200px] w-full  ">
									<UserCard user={creator} />
								</li>
							))
						))}

						{hasNextPage && (
							<div ref={inViewRef} className="mt-10">
								<Loader />
							</div>
						)}
					</ul>
				)}
			</div>
		</div>
	)
}