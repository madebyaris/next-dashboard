import { posts } from '@/resources/posts'
import { PostList } from '@/resources/posts/components'

export default async function PostsPage() {
  const data = await posts.actions.list()
  
  return <PostList data={data.items} />
}
