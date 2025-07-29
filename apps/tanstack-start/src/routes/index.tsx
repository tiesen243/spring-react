import { Suspense } from 'react'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'

import { Button } from '@yuki/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@yuki/ui/card'
import { useForm } from '@yuki/ui/form'
import { Input } from '@yuki/ui/input'
import { Textarea } from '@yuki/ui/textarea'
import { createPostSchema } from '@yuki/validators/post'

import { postKeys, postOptions } from '@/api/post'

export const Route = createFileRoute('/')({
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(postOptions.all())
  },
  component: HomePage,
})

function HomePage() {
  return (
    <main className='container py-4'>
      <CreatePost />
      <div className='flex max-h-[50dvh] flex-col gap-4 overflow-y-auto'>
        <Suspense fallback={<PostListSkeleton />}>
          <PostList />
        </Suspense>
      </div>
    </main>
  )
}

const PostList: React.FC = () => {
  const { data } = useSuspenseQuery(postOptions.all())
  return data.map((post) => (
    <Card key={post.id} className='hover:bg-accent' asChild>
      <Link to='/$id' params={{ id: post.id }}>
        <CardHeader>
          <CardTitle>{post.title}</CardTitle>
          <CardDescription>
            {new Date(post.createdAt).toLocaleDateString('en-GB')}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p>{post.content}</p>
        </CardContent>
      </Link>
    </Card>
  ))
}

const PostListSkeleton: React.FC = () =>
  Array.from({ length: 3 }, (_, i) => (
    <Card key={i}>
      <CardHeader>
        <CardTitle className='w-1/2 animate-pulse rounded-md bg-current'>
          &nbsp;
        </CardTitle>
        <CardDescription className='w-1/3 animate-pulse rounded-md bg-current'>
          &nbsp;
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className='h-16 w-full animate-pulse rounded-md bg-current'>
          &nbsp;
        </p>
      </CardContent>
    </Card>
  ))

const CreatePost: React.FC = () => {
  const queryClient = useQueryClient()
  const { mutateAsync } = useMutation({
    ...postOptions.create(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: postKeys.all() })
      form.reset()
    },
  })

  const form = useForm({
    defaultValues: { title: '', content: '' },
    validator: createPostSchema,
    onSubmit: mutateAsync,
  })

  return (
    <form
      className='mb-4 grid gap-4'
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <form.Field
        name='title'
        render={({ field, meta }) => (
          <div id={meta.id} className='grid gap-2'>
            <form.Label>Title</form.Label>
            <form.Control {...field}>
              <Input placeholder='Enter your post title here...' />
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
              <Textarea placeholder='Write your post content here...' />
            </form.Control>
            <form.Message />
          </div>
        )}
      />

      <Button disabled={form.state.isPending}>Create Post</Button>
    </form>
  )
}
