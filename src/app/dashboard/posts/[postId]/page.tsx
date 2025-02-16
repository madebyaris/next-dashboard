import { posts } from '@/resources/posts'
import { PostForm } from '@/resources/posts/components'
import { DashboardShell } from '@/components/dashboard/shell'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

type PageParams = Promise<{ postId: string }>

export default async function EditPostPage({ params }: { params: PageParams }) {
  const { postId } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  const post = await posts.actions.getById(postId)

  async function handleSubmit(formData: FormData) {
    'use server'
    
    if (!session?.user) {
      throw new Error('Not authenticated')
    }
    
    const data = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      published: formData.get('published') === 'true',
    }

    await posts.actions.update(postId, data)
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