import mongoose from 'mongoose'

export interface Posts extends mongoose.Document {
  title: string
  content: string
  author: string
}

const PostSchema = new mongoose.Schema<Posts>(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
)

export default mongoose.models.Post || mongoose.model<Posts>('Post', PostSchema)
