import * as v from 'valibot'
import { IMAGE_URL_PREFIX } from './constants'

const TitleSchema = v.pipe(
  v.string('Your title must be a string.'),
  v.nonEmpty('Please enter your title.'),
  v.minLength(6, 'Your title must have 3 characters or more.'),
)

const ContentSchema = v.pipe(
  v.string('Your content must be a string.'),
  v.nonEmpty('Please enter your content.'),
  v.minLength(6, 'Your content must have 6 characters or more.'),
)

const ImageSchema = v.union([
  v.pipe(
    v.literal(''),
    v.transform(() => undefined),
  ),
  v.pipe(
    v.string('Your image must be a string.'),
    v.nonEmpty('Please enter your image.'),
    v.startsWith(IMAGE_URL_PREFIX, 'Your image must be a valid URL.'),
  ),
])

export const CreatePostSchema = v.object({
  title: TitleSchema,
  content: ContentSchema,
  image: v.optional(ImageSchema),
})

export type CreatePostInput = v.InferInput<typeof CreatePostSchema>
export type CreatePostOutput = v.InferOutput<typeof CreatePostSchema>

export const UpdatePostSchema = v.object({
  title: TitleSchema,
  content: ContentSchema,
  image: v.optional(ImageSchema),
  postId: v.pipe(
    v.string('Your postId must be a string.'),
    v.nonEmpty('Please enter your postId.'),
    v.cuid2('Your postId is badly formatted.'),
  ),
})

export type UpdatePostInput = v.InferInput<typeof UpdatePostSchema>
export type UpdatePostOutput = v.InferOutput<typeof UpdatePostSchema>
