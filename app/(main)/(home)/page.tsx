"use client"
import PostCard from "@/components/cards/postcard"
import Loader from "@/components/loaders/spinner"
import { useRecentPostsQuery } from "@/react-query/queries"


export default function Home() {
  const { data: posts, isPending: isLoading, isError } = useRecentPostsQuery()

  return (
    <div className="flex flex-1 min-h-screen">
      <main className="home-container">
        <div className="home-posts">
          <h1 className="h3-bold md:h2-bold text-left w-full">Home Feed</h1>
          {isLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {
                posts?.documents.map((post) => (
                  <PostCard key={post.$id} post={post} />
                ))
              }
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}
