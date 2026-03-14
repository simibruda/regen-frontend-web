import { createFileRoute } from '@tanstack/react-router'
import { useGetPosts } from '../api/generated/posts/posts'

export const Route = createFileRoute('/posts')({
  component: PostsPage,
})

function PostsPage() {
  const postsQuery = useGetPosts()

  if (postsQuery.isPending) {
    return <p className="text-slate-300">Loading posts...</p>
  }

  if (postsQuery.isError) {
    return <p className="text-red-400">Failed to load posts.</p>
  }

  return (
    <section className="space-y-4">
      <h2 className="text-left text-2xl font-semibold">
        Posts (from Orval-generated React Query hook)
      </h2>
      <ul className="space-y-3">
        {postsQuery.data?.data.slice(0, 10).map((post) => (
          <li key={post.id} className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 text-left">
            <strong className="block text-base text-white">{post.title}</strong>
            <p className="mt-2 text-slate-300">{post.body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
