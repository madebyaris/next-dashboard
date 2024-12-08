import { notFound } from 'next/navigation'
import { DashboardHeader } from '@/components/dashboard/header'
import { PostForm } from '@/components/posts/post-form'
import { getPostById } from '@/lib/api'

interface EditPostPageProps {
  params: {
    postId: string
  }
}

export const metadata = {
  title: 'Edit Post',
  description: 'Edit your blog post',
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const post = await getPostById(params.postId)

  if (!post) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="Edit Post"
        text="Make changes to your post."
      />
      <div className="grid gap-6">
        <PostForm initialData={post} />
      </div>
    </div>
  )
}
