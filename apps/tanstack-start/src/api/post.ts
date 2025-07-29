import { mutationOptions, queryOptions } from '@tanstack/react-query'

import { env } from '@yuki/validators/env'

export interface Post {
  id: string
  title: string
  content: string
  createdAt: Date
}

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
        const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/post`, {
          signal,
        })
        if (!response.ok) throw new Error('Failed to fetch posts')
        return (await response.json()) as Post[]
      },
    }),

  byId: (id: string) =>
    queryOptions({
      queryKey: postKeys.byId(id),
      queryFn: async ({ signal }) => {
        const response = await fetch(
          `${env.NEXT_PUBLIC_API_URL}/api/post/${id}`,
          { signal },
        )
        if (!response.ok) throw new Error(`Failed to fetch post with id ${id}`)
        return (await response.json()) as Post
      },
    }),

  create: () =>
    mutationOptions({
      mutationKey: postKeys.create(),
      mutationFn: async (newPost: Omit<Post, 'id' | 'createdAt'>) => {
        const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/post`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPost),
        })
        if (!response.ok) throw new Error('Failed to create post')
        return (await response.json()) as Post
      },
    }),

  update: (id: string) =>
    mutationOptions({
      mutationKey: postKeys.update(id),
      mutationFn: async (updatedPost: Omit<Post, 'id' | 'createdAt'>) => {
        const response = await fetch(
          `${env.NEXT_PUBLIC_API_URL}/api/post/${id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedPost),
          },
        )
        console.log(response)
        if (!response.ok) throw new Error(`Failed to update post with id ${id}`)

        return (await response.json()) as Post
      },
    }),

  delete: (id: string) =>
    mutationOptions({
      mutationKey: postKeys.delete(id),
      mutationFn: async () => {
        const response = await fetch(
          `${env.NEXT_PUBLIC_API_URL}/api/post/${id}`,
          { method: 'DELETE' },
        )
        if (!response.ok) throw new Error(`Failed to delete post with id ${id}`)
      },
    }),
}
