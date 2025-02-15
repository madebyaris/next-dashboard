import { DashboardShell } from '@/components/dashboard/shell'
import { posts } from '@/resources/posts'
import { PostForm } from '@/resources/posts/components'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import type { Post } from '@/resources/posts'

export default async function NewPostPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/login')
  }

  async function onSubmit(data: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'author'>) {
    'use server'
    
    if (!session?.user?.id) {
      throw new Error('Not authenticated')
    }

    await posts.actions.create({
      ...data,
      authorId: session.user.id,
    })
  }

  return (
    <DashboardShell
      title="New Post"
      description="Create a new blog post"
    >
      <div className="grid gap-8">
        <PostForm onSubmit={onSubmit} />
      </div>
    </DashboardShell>
  )
}
