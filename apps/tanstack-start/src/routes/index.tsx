import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@yuki/ui/card'

import { postOptions } from '@/api/post'

export const Route = createFileRoute('/')({
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(postOptions.all())
  },
  component: HomePage,
})

function HomePage() {
  const { data } = useSuspenseQuery(postOptions.all())

  return (
    <main className='container'>
      {data.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <CardTitle>{post.title}</CardTitle>
            <CardDescription>
              {new Date(post.createdAt).toLocaleDateString('en-GB')}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p>{post.content}</p>
          </CardContent>
        </Card>
      ))}
    </main>
  )
}
