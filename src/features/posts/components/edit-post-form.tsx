'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { Prisma } from '@prisma/client'
import { updatePost } from '@/features/posts/actions/update-post'
import {
  UpdatePostInput,
  UpdatePostOutput,
  UpdatePostSchema,
} from '../validators'
import { useEffect, useState } from 'react'
import { getSignedURL } from '@/features/posts/actions/get-signed-url'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { XIcon } from 'lucide-react'
import { computeSHA256 } from '@/lib/utils'
import { TiptapEditor } from '@/features/posts/components/tiptap-editor'

type EditPostFormProps = {
  post: Prisma.PostGetPayload<{
    select: {
      postId: true
      createdAt: true
      updatedAt: true
      title: true
      content: true
      image: true
      author: {
        select: {
          userId: true
          name: true
        }
      }
    }
  }>
}

export const EditPostForm = ({ post }: EditPostFormProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageView, setImageView] = useState<string | null>(null)

  useEffect(() => {
    ;(async function run() {
      if (post.image) {
        const res = await fetch(post.image)
        if (res.ok) {
          const blob = await res.blob()
          setImageView(URL.createObjectURL(blob))
        }
      }
    })()
  }, [post.image])

  const form = useForm<UpdatePostInput>({
    resolver: valibotResolver(UpdatePostSchema),
    defaultValues: {
      postId: post.postId,
      title: post.title,
      content: post.content,
      image: post.image ?? '',
    },
  })

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

  const submit = async (values: UpdatePostOutput) => {
    const formData = new FormData()
    formData.append('postId', values.postId)
    formData.append('title', values.title)
    formData.append('content', values.content)

    const image = values.image

    if (image) {
      if (imageFile && image !== post.image) {
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

    const res = await updatePost({}, formData)

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
          <Input
            id='author'
            name='author'
            defaultValue={post.author.name}
            disabled
          />
        </div>

        <div>
          <Label>Image</Label>
          {imageView ? (
            <ImageView
              imageView={imageView}
              handleRemoveImage={handleRemoveImage}
            />
          ) : (
            <>
              <Input
                type='file'
                accept='image/jpeg,image/jpg,image/png,image/webp'
                onChange={handleChangeImage}
              />
              <p className='text-sm font-medium text-destructive'>
                {form.formState.errors.image?.message}
              </p>
            </>
          )}
        </div>

        <Button
          type='submit'
          className='w-full'
          disabled={form.formState.isSubmitting}
        >
          Save Post
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
