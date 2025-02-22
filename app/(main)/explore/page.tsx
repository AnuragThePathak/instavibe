"use client"

import SearchResults from "@/components/lists/searchresults"
import Loader from "@/components/loaders/spinner"
import { Input } from "@/components/ui/input"
import { useGetPostsQuery, useSearchPostsQuery } from "@/react-query/queries"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useDebounce } from "use-debounce"
import { useInView } from "react-intersection-observer"
import GridPostList from "@/components/lists/gridpostlist"

export default function Page() {
	const { ref: inViewRef, inView } = useInView()
	const { data: posts, fetchNextPage, hasNextPage } = useGetPostsQuery()
	const [searchValue, setSearchValue] = useState("")

	const [debouncedValue] = useDebounce(searchValue, 2000)
	const { data: searchedPosts, isFetching: isSearching } =
		useSearchPostsQuery(debouncedValue)

	useEffect(() => {
		if (inView && !searchValue) {
			fetchNextPage()
		}
	}, [fetchNextPage, inView, searchValue])

	if (!posts) {
		return (
			<div className="flex-center w-full h-full">
				<Loader />
			</div>
		)
	}

	const shouldShowResults = searchValue !== ""
	const shouldShowPosts = !shouldShowResults && posts.pages.every((item) =>
		item.documents.length === 0)

	return (
		<div className="explore-container">
			<div className="explore-inner_container">
				<h1 className="h3-bold md:h2-bold w-full">
					Search Posts
				</h1>

				<div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
					<Image
						src="/icons/search.svg"
						alt="search"
						width={24}
						height={24}
					/>

					<Input
						type="text"
						placeholder="Search"
						className="explore-search"
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)}
					/>
				</div>
			</div>

			<div className="flex-between w-full max-w-full mt-16 mb-7">
				<h1 className="body-bold md:h3-bold">Popular Today</h1>

				<div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
					<p className="small-medium md:base-medium text-light-2">All</p>

					<Image
						src="/icons/filter.svg"
						alt="filter"
						width={20}
						height={20}
					/>
				</div>
			</div>

			<div className="flex flex-wrap gap-9 w-full max-w-5xl">
				{shouldShowResults ? (
					<SearchResults isSeachFetching={isSearching} searchedPosts={searchedPosts?.documents} />
				) : shouldShowPosts ? (
					<p className="text-light-4 mt-10 text-center w-full">End of posts</p>
				) : posts.pages.map((item, index) => (
					<GridPostList key={`page-${index}`} posts={item.documents} />
				))}
			</div>

			{hasNextPage && !searchValue && (
				<div ref={inViewRef} className="mt-10">
					<Loader />
				</div>
			)}
		</div>
	)
}