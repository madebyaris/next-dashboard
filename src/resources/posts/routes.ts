export const routes = {
  list: '/dashboard/posts',
  new: '/dashboard/posts/new',
  edit: (id: string) => `/dashboard/posts/${id}`,
  api: {
    list: '/api/posts',
    create: '/api/posts',
    update: '/api/posts',
    delete: '/api/posts',
  },
} as const 