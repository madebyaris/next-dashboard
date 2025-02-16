import { posts } from '@/resources/posts'
import { PostForm } from '@/resources/posts/components'
import { DashboardShell } from '@/components/dashboard/shell'

export default function NewPostPage() {
  return (
    <DashboardShell
      title="New Post"
      description="Create a new blog post"
    >
      <PostForm onSubmit={posts.actions.create} />
    </DashboardShell>
  )
}
