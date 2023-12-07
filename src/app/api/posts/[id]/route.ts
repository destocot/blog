import { connectToMongoDB } from '@/lib/mongodb'
import Post from '@/models/Post'
import { NextResponse } from 'next/server'

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json()

  await connectToMongoDB

  try {
    await Post.findByIdAndUpdate(params.id, body)
  } catch (error) {
    console.log(error)
  }

  return NextResponse.json({ data: 'ok' }, { status: 201 })
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectToMongoDB

  try {
    await Post.findByIdAndDelete(params.id)
  } catch (error) {
    console.log(error)
  }

  return NextResponse.json({ data: 'ok' }, { status: 201 })
}
