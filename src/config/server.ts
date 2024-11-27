import * as v from 'valibot'

const ServerEnvSchema = v.object({
  AUTH_SECRET: v.pipe(v.string(), v.nonEmpty()),
  AWS_BUCKET_NAME: v.pipe(v.string(), v.nonEmpty()),
  AWS_BUCKET_REGION: v.pipe(v.string(), v.nonEmpty()),
  AWS_ACCESS_KEY_ID: v.pipe(v.string(), v.nonEmpty()),
  AWS_SECRET_ACCESS_KEY: v.pipe(v.string(), v.nonEmpty()),
})

export const env = v.parse(ServerEnvSchema, {
  AUTH_SECRET: process.env.AUTH_SECRET,
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
  AWS_BUCKET_REGION: process.env.AWS_BUCKET_REGION,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
})
