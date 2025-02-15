import { DashboardShell } from '@/components/dashboard/shell'
import { posts } from '@/resources/posts'
import { PostForm } from '@/resources/posts/components'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import type { Post } from '@/resources/posts'

interface EditPostPageProps {
  params: {
    postId: string
  }
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/login')
  }

  const post = await posts.actions.getById(params.postId)

  async function onSubmit(data: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'author'>) {
    'use server'
    
    if (!session?.user?.id) {
      throw new Error('Not authenticated')
    }

    await posts.actions.update(params.postId, {
      ...data,
      authorId: session.user.id,
    })
  }

  return (
    <DashboardShell
      title="Edit Post"
      description="Edit your blog post"
    >
      <div className="grid gap-8">
        <PostForm initialData={post} onSubmit={onSubmit} />
      </div>
    </DashboardShell>
  )
}
