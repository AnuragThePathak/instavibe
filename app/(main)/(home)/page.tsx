"use client"
import PostCard from "@/components/cards/postcard"
import Loader from "@/components/loaders/spinner"
import { useGetPostsQuery } from "@/react-query/queries"
import { useEffect } from "react"
import { useInView } from "react-intersection-observer"


export default function Home() {
  const { ref: inViewRef, inView } = useInView()
  const { data: posts, fetchNextPage, hasNextPage } = useGetPostsQuery()

  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [fetchNextPage, inView])

  return (
    <div className="flex flex-1 min-h-screen">
      <main className="home-container">
        <div className="home-posts">
          <h1 className="h3-bold md:h2-bold text-left w-full">Home Feed</h1>
          {!posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {
                posts.pages.map((item) => (
                  item.documents.map((post) => (
                    <PostCard key={post.$id} post={post} />
                  ))
                ))
              }
              {hasNextPage && (
                <div ref={inViewRef} className="mt-10">
                  <Loader />
                </div>
              )}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}
