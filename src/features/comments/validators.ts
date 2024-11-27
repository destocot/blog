import * as v from 'valibot'

const ContentSchema = v.pipe(
  v.string('Your content must be a string.'),
  v.nonEmpty('Please enter your content.'),
  v.trim(),
  v.minLength(6, 'Your content must have 6 characters or more.'),
  v.maxLength(160, 'Your content must have 160 characters or less.'),
)

export const CreateCommentSchema = v.object({
  content: ContentSchema,
  postId: v.pipe(
    v.string('Your postId must be a string.'),
    v.nonEmpty('Please enter your postId.'),
    v.cuid2('Your postId is badly formatted.'),
  ),
})

export type CreateCommentInput = v.InferInput<typeof CreateCommentSchema>
export type CreateCommentOutput = v.InferOutput<typeof CreateCommentSchema>
