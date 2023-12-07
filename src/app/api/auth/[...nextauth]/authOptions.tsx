import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', text: 'text' },
        password: { label: 'Password', text: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null

        const { username, password } = credentials
        if (!username || !password) return null

        if (
          username === process.env.BLOG_USER &&
          password === process.env.BLOG_PASS
        ) {
          return { id: '1', name: username }
        }

        return null
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
}
