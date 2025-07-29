import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { postOptions } from '@/api/post'

export const Route = createFileRoute('/')({
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(postOptions.all())
  },
  component: HomePage,
})

function HomePage() {
  const { data } = useSuspenseQuery(postOptions.all())

  return <main className='container'>{JSON.stringify(data, null, 2)}</main>
}
