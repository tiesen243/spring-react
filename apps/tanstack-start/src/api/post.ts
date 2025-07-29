import { queryOptions } from '@tanstack/react-query'

import { env } from '@yuki/validators/env'

export const postKeys = {
  all: () => ['posts'],
  byId: (id: string) => [...postKeys.all(), id],
  create: () => [...postKeys.all(), 'create'],
  update: (id: string) => [...postKeys.byId(id), 'update'],
  delete: (id: string) => [...postKeys.byId(id), 'delete'],
}

export const postOptions = {
  all: () =>
    queryOptions({
      queryKey: postKeys.all(),
      queryFn: async ({ signal }) => {
        const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/post`, {
          signal,
        })
        if (!response.ok) throw new Error('Failed to fetch posts')
        return (await response.json()) as Post[]
      },
    }),
}

interface Post {
  id: number
  title: string
  content: string
  createdAt: Date
}
