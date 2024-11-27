'use server'

import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'

import { getSession } from '@/lib/session'
import { env } from '@/config/server'
import { IMAGE_URL_PREFIX } from '@/features/posts/constants'

const s3 = new S3Client({
  region: env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
})

export async function deletePostImage(imageUrl: string) {
  const session = await getSession()
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  if (!imageUrl.startsWith(IMAGE_URL_PREFIX)) return

  const deleteObjectCommand = new DeleteObjectCommand({
    Bucket: env.AWS_BUCKET_NAME,
    Key: imageUrl.split('/').pop(),
  })

  await s3.send(deleteObjectCommand)
}
