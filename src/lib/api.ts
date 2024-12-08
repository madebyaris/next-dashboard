type FetchOptions = {
  method?: string
  body?: any
  headers?: Record<string, string>
}

async function fetchAPI(endpoint: string, options: FetchOptions = {}) {
  const { method = 'GET', body, headers = {} } = options

  const res = await fetch(`/api${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong')
  }

  return data
}

export const api = {
  // User endpoints
  users: {
    list: () => fetchAPI('/dashboard/users'),
    get: (id: string) => fetchAPI(`/dashboard/users/${id}`),
    update: (id: string, data: any) =>
      fetchAPI(`/dashboard/users/${id}`, {
        method: 'PATCH',
        body: data,
      }),
    delete: (id: string) =>
      fetchAPI(`/dashboard/users/${id}`, {
        method: 'DELETE',
      }),
  },
  // Post endpoints
  posts: {
    list: () => fetchAPI('/dashboard/posts'),
    get: (id: string) => fetchAPI(`/dashboard/posts/${id}`),
    create: (data: any) =>
      fetchAPI('/dashboard/posts', {
        method: 'POST',
        body: data,
      }),
    update: (id: string, data: any) =>
      fetchAPI(`/dashboard/posts/${id}`, {
        method: 'PATCH',
        body: data,
      }),
    delete: (id: string) =>
      fetchAPI(`/dashboard/posts/${id}`, {
        method: 'DELETE',
      }),
  },
  // Settings endpoints
  settings: {
    list: () => fetchAPI('/dashboard/settings'),
    get: (key: string) => fetchAPI(`/dashboard/settings/${key}`),
    create: (data: any) =>
      fetchAPI('/dashboard/settings', {
        method: 'POST',
        body: data,
      }),
    update: (key: string, data: any) =>
      fetchAPI(`/dashboard/settings/${key}`, {
        method: 'PATCH',
        body: data,
      }),
    delete: (key: string) =>
      fetchAPI(`/dashboard/settings/${key}`, {
        method: 'DELETE',
      }),
  },
}