import { DashboardHeader } from '@/components/dashboard/header'
import { PostForm } from '@/components/posts/post-form'

export const metadata = {
  title: 'Create Post',
  description: 'Create a new blog post',
}

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="Create Post"
        text="Create a new blog post."
      />
      <div className="grid gap-6">
        <PostForm />
      </div>
    </div>
  )
}
