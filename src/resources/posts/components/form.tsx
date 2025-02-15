'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from '@/components/ui/use-toast'
import { type Post, createPostSchema } from '../schema'

interface PostFormProps {
  initialData?: Post
  onSubmit: (data: FormData) => Promise<void>
}

type FormData = Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'author'>

export function PostForm({ initialData, onSubmit }: PostFormProps) {
  const router = useRouter()
  const form = useForm<FormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: initialData || {
      title: '',
      content: '',
      published: false,
      authorId: '', // This will be set on the server
    },
  })

  const handleSubmit = async (data: FormData) => {
    try {
      await onSubmit(data)
      toast({
        title: 'Success',
        description: initialData ? 'Post updated successfully' : 'Post created successfully',
      })
      router.push('/dashboard/posts')
      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter post title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter post content"
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Published</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit">
            {initialData ? 'Update Post' : 'Create Post'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
} 