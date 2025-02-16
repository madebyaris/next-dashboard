import { posts } from '@/resources/posts'
import { PostForm } from '@/resources/posts/components'
import { DashboardShell } from '@/components/dashboard/shell'

interface EditPostPageProps {
  params: {
    postId: string
  }
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const post = await posts.actions.getById(params.postId)

  async function handleSubmit(formData: FormData) {
    'use server'
    
    const data = {
      title: formData.get('title'),
      content: formData.get('content'),
      published: formData.get('published') === 'true',
    }

    await posts.actions.update(params.postId, data)
  }

  return (
    <DashboardShell
      title="Edit Post"
      description="Edit your blog post"
    >
      <PostForm 
        defaultValues={post} 
        onSubmit={handleSubmit}
      />
    </DashboardShell>
  )
}
