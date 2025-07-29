import { Suspense } from 'react'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { Button } from '@yuki/ui/button'
import { ChevronLeftIcon, PencilIcon, Trash2Icon } from '@yuki/ui/icons'
import { Typography } from '@yuki/ui/typography'

import { postKeys, postOptions } from '@/api/post'
import { createMetadata } from '@/lib/metadata'

export const Route = createFileRoute('/$id/')({
  loader: async ({ context, params }) => {
    try {
      const post = await context.queryClient.ensureQueryData(
        postOptions.byId(params.id),
      )
      return { post }
    } catch {
      redirect({ to: '/', throw: true })
    }
  },
  head: ({ loaderData }) => {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    if (!loaderData) throw redirect({ to: '/', throw: true })
    return { meta: createMetadata({ title: loaderData.post.title }) }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className='container py-4'>
      <Suspense fallback={<PostDetailsSkeleton />}>
        <PostDetails />
      </Suspense>

      <Outlet />
    </main>
  )
}

const PostDetails: React.FC = () => {
  const navigate = Route.useNavigate()
  const { id } = Route.useParams()

  const queryClient = useQueryClient()
  const { data } = useSuspenseQuery(postOptions.byId(id))
  const { mutate, isPending } = useMutation({
    ...postOptions.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: postKeys.all() })
      void navigate({ to: '/' })
    },
  })

  return (
    <article className='relative'>
      <div className='mb-4 flex items-center justify-between'>
        <Button
          variant='outline'
          size='icon'
          onClick={() => {
            void navigate({ to: '/' })
          }}
        >
          <ChevronLeftIcon />
          <span className='sr-only'>Go back</span>
        </Button>

        <div className='flex items-center gap-4'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => {
              void navigate({ to: '/$id/edit', params: { id } })
            }}
          >
            <PencilIcon />
            <span className='sr-only'>Edit post {data.title}</span>
          </Button>
          <Button
            variant='outline'
            size='icon'
            onClick={() => {
              mutate()
            }}
            disabled={isPending}
          >
            <Trash2Icon />
            <span className='sr-only'>Delete post {data.title}</span>
          </Button>
        </div>
      </div>

      <Typography variant='h1'>{data.title}</Typography>
      <Typography className='text-muted-foreground'>
        Created at: {new Date(data.createdAt).toLocaleDateString('en-GB')}
      </Typography>

      <hr className='my-4' />

      <Typography>{data.content}</Typography>
    </article>
  )
}

const PostDetailsSkeleton: React.FC = () => {
  return (
    <article className='relative'>
      <div className='mb-4 flex items-center justify-between'>
        <Button variant='outline' size='icon'>
          <ChevronLeftIcon />
          <span className='sr-only'>Go back</span>
        </Button>

        <div className='flex items-center gap-4'>
          <Button variant='outline' size='icon'>
            <PencilIcon />
            <span className='sr-only'>Edit post </span>
          </Button>
          <Button variant='outline' size='icon'>
            <Trash2Icon />
            <span className='sr-only'>Delete post </span>
          </Button>
        </div>
      </div>

      <Typography
        variant='h1'
        className='w-1/2 animate-pulse rounded-md bg-current'
      >
        &nbsp;
      </Typography>
      <Typography className='w-1/3 animate-pulse rounded-md bg-current'>
        &nbsp;
      </Typography>

      <hr className='my-4' />

      <Typography className='h-48 w-full animate-pulse rounded-md bg-current' />
    </article>
  )
}
