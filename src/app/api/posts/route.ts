import { connectToMongoDB } from '@/lib/mongodb'
import Post from '@/models/Post'
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  await connectToMongoDB()
  try {
    await Post.create(body)
    revalidatePath('/')
    return NextResponse.json({ data: 'ok' }, { status: 201 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ data: 'not ok' }, { status: 500 })
  }
}
