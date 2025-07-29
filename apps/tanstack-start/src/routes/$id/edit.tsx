import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'

import { Button } from '@yuki/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@yuki/ui/card'
import { useForm } from '@yuki/ui/form'
import { Input } from '@yuki/ui/input'
import { Textarea } from '@yuki/ui/textarea'
import { createPostSchema } from '@yuki/validators/post'

import { postKeys, postOptions } from '@/api/post'
import { createMetadata } from '@/lib/metadata'

export const Route = createFileRoute('/$id/edit')({
  loader: async ({ context, params }) => {
    const { id } = params

    try {
      const post = await context.queryClient.ensureQueryData(
        postOptions.byId(id),
      )
      return { post }
    } catch {
      redirect({ to: '/', throw: true })
      return { post: { id: '', title: '', content: '' } }
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return { meta: createMetadata({ title: 'Post not found' }) }
    return { meta: createMetadata({ title: `Edit: ${loaderData.post.title}` }) }
  },

  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { post } = Route.useLoaderData()

  const queryClient = useQueryClient()
  const { mutateAsync } = useMutation({
    ...postOptions.update(post.id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: postKeys.byId(post.id) })
      void queryClient.invalidateQueries({ queryKey: postKeys.all() })
      void navigate({ to: '/$id', params: { id: post.id } })
    },
  })

  const form = useForm({
    defaultValues: {
      title: post.title,
      content: post.content,
    },
    validator: createPostSchema,
    onSubmit: mutateAsync,
  })

  return (
    <main className='container grid min-h-dvh place-items-center'>
      <Card asChild>
        <form
          className='w-full max-w-2xl'
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <CardHeader>
            <CardTitle>
              Edit Post:
              <span className='font-bold'>{post.title}</span>
            </CardTitle>
            <CardDescription>
              Update the title and content of your post below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form.Field
              name='title'
              render={({ field, meta }) => (
                <div id={meta.id} className='grid gap-2'>
                  <form.Label>Title</form.Label>
                  <form.Control {...field}>
                    <Input />
                  </form.Control>
                  <form.Message />
                </div>
              )}
            />

            <form.Field
              name='content'
              render={({ field, meta }) => (
                <div id={meta.id} className='grid gap-2'>
                  <form.Label>Content</form.Label>
                  <form.Control {...field}>
                    <Textarea />
                  </form.Control>
                  <form.Message />
                </div>
              )}
            />
          </CardContent>

          <CardFooter className='items-center justify-end gap-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => {
                void navigate({ to: '/$id', params: { id: post.id } })
              }}
            >
              Cancel
            </Button>
            <Button disabled={form.state.isPending}>Save Changes</Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}
