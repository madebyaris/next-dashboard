import { posts } from '@/resources/posts'
import { PostForm } from '@/resources/posts/components'
import { DashboardShell } from '@/components/dashboard/shell'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function NewPostPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  async function handleSubmit(formData: FormData) {
    'use server'
    
    if (!session?.user) {
      throw new Error('Not authenticated')
    }
    
    const data = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      published: formData.get('published') === 'true',
      authorId: session.user.id,
    }

    await posts.actions.create(data)
  }

  return (
    <DashboardShell
      title="New Post"
      description="Create a new blog post"
    >
      <PostForm onSubmit={handleSubmit} />
    </DashboardShell>
  )
}
