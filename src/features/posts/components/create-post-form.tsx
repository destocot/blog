'use client'

import { useEffect, useState } from 'react'
import { XIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import type { User } from '@prisma/client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createPost } from '@/features/posts/actions/create-post'
import type { Session } from '@/lib/jose'
import {
  type CreatePostOutput,
  CreatePostSchema,
  type CreatePostInput,
} from '@/features/posts/validators'
import { getSignedURL } from '@/features/posts/actions/get-signed-url'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { computeSHA256 } from '@/lib/utils'
import { TiptapEditor } from '@/features/posts/components/tiptap-editor'

export const CreatePostForm = () => {
  const form = useForm<CreatePostInput>({
    resolver: valibotResolver(CreatePostSchema),
    defaultValues: { title: 'testing title', content: '', image: '' },
  })

  const [authorName, setAuthorName] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageView, setImageView] = useState<string | null>(null)

  useEffect(() => {
    ;(async function run() {
      const sessionRes = await fetch('/api/session')
      const { data: session } = (await sessionRes.json()) as { data: Session }

      const userRes = await fetch(`/api/users/${session.user.id}`)
      const { data: user } = (await userRes.json()) as { data: User }
      setAuthorName(user.name)
    })()
  }, [])

  const handleChangeImage = async (
    evt: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = evt.target.files?.[0]

    if (imageView) URL.revokeObjectURL(imageView)

    console.table(file)
    if (file) {
      setImageFile(file)
      const objectURL = URL.createObjectURL(file)
      setImageView(objectURL)

      const checksum = await computeSHA256(file)
      const signedURL = await getSignedURL({
        type: file.type,
        size: file.size,
        checksum: checksum,
      })

      if (signedURL.data) form.setValue('image', signedURL.data)
    }
  }

  const handleRemoveImage = () => {
    form.setValue('image', '')
    setImageFile(null)
    setImageView(null)
  }

  const submit = async (values: CreatePostOutput) => {
    const formData = new FormData()
    formData.append('title', values.title)
    formData.append('content', values.content)

    const image = values.image

    if (image) {
      if (imageFile) {
        try {
          await fetch(image, {
            method: 'PUT',
            body: imageFile,
            headers: {
              'Content-Type': imageFile.type,
            },
          })
        } catch {
          form.setError('title', { message: 'Oops! Something went wrong' })
          return
        }
      }
      formData.append('image', image.split('?')[0])
    } else {
      formData.append('image', '')
    }

    const res = await createPost({}, formData)

    if (res.error) {
      form.setError('image', { message: res.error })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='content'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <TiptapEditor content={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Label htmlFor='author'>Author</Label>
          {authorName ? (
            <Input
              id='author'
              name='author'
              defaultValue={authorName}
              disabled
            />
          ) : (
            <Input
              id='author'
              name='author'
              className='animate-pulse bg-muted/80'
            />
          )}
        </div>

        <div>
          <Label>Image</Label>
          {imageView ? (
            <ImageView
              imageView={imageView}
              handleRemoveImage={handleRemoveImage}
            />
          ) : (
            <Input
              type='file'
              accept='image/jpeg,image/jpg,image/png,image/webp'
              onChange={handleChangeImage}
            />
          )}
        </div>

        <Button
          type='submit'
          className='w-full'
          disabled={form.formState.isSubmitting}
        >
          Create Post
        </Button>
      </form>
    </Form>
  )
}

type ImageViewProps = {
  imageView: string
  handleRemoveImage: () => void
}

const ImageView = ({ imageView, handleRemoveImage }: ImageViewProps) => {
  return (
    <div className='relative'>
      <div className='relative aspect-video overflow-hidden rounded-md border border-input'>
        <img
          src={imageView}
          alt='Post Image'
          className='object-cover'
          sizes='100vw'
        />
        <Button
          type='button'
          variant='outline'
          size='icon'
          onClick={handleRemoveImage}
          className='absolute right-0 top-0 h-6 w-6 rounded-none border-r-0 border-t-0 transition-transform hover:scale-110'
        >
          <XIcon />
        </Button>
      </div>
    </div>
  )
}
