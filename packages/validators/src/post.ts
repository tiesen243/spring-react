import * as z from 'zod/v4'

export const createPostSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  content: z.string().min(1, { message: 'Content is required' }),
})

export const updatePostSchema = z.object({
  id: z.string().min(1, { message: 'ID is required' }),
  title: z.string().min(1, { message: 'Title is required' }),
  content: z.string().min(1, { message: 'Content is required' }),
})
