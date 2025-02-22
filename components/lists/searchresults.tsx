import { Models } from "node-appwrite"
import Loader from "../loaders/spinner"
import GridPostList from "./gridpostlist"

interface SearchResultsProps {
	isSeachFetching: boolean
	searchedPosts: Models.Document[] | undefined
}

export default function SearchResults({ isSeachFetching, searchedPosts } : SearchResultsProps) {
	if (isSeachFetching) {
		return (<Loader />)
	}

	if (searchedPosts && searchedPosts.length > 0) {
		return (
			<GridPostList posts={searchedPosts} />
		)
	}

	return (
		<p className="text-light-4 mt-10 text-center w-full">No Results Found</p>
	)
}