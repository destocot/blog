import { findOneUser } from '@/features/users/queries'

export async function GET(
  request: Request,
  ctx: { params: Promise<{ userId: string }> },
) {
  const params = await ctx.params
  const user = await findOneUser(params.userId)
  return Response.json({ data: user })
}
