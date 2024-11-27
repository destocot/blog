'use server'

import { getSession } from '@/lib/session'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { env } from '@/config/server'
import crypto from 'node:crypto'

const s3 = new S3Client({
  region: env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
})

const generateFileName = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString('hex')
}

const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const maxFileSize = 1024 * 1024 * 10

export async function getSignedURL({
  type,
  size,
  checksum,
}: {
  type: string
  size: number
  checksum: string
}) {
  const session = await getSession()
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  if (!acceptedTypes.includes(type)) {
    return { data: null, error: 'Invalid file type' }
  }

  if (size > maxFileSize) {
    return { data: null, error: 'File is too large' }
  }

  const putObjectCommand = new PutObjectCommand({
    Bucket: env.AWS_BUCKET_NAME,
    Key: generateFileName(),
    ContentType: type,
    ContentLength: size,
    ChecksumSHA256: checksum,
    Metadata: {
      userId: session.user.id,
    },
  })

  const signedUrl = await getSignedUrl(s3, putObjectCommand, {
    expiresIn: 3600,
  })

  return { data: signedUrl, error: null }
}
