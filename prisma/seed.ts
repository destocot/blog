import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'
import { faker } from '@faker-js/faker'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const libsql = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

const adapter = new PrismaLibSQL(libsql)
const prisma = new PrismaClient({ adapter })

function generatePostContent() {
  const paragraphs = Array.from(
    { length: 2 },
    () => `<p>${faker.lorem.paragraph()}</p>`,
  ).join('\n')

  const listItems = Array.from(
    { length: 5 },
    () => `<li>${faker.lorem.sentence()}</li>`,
  ).join('\n')
  const list = `<ul>\n${listItems}\n</ul>`

  const codeBlock = `<pre><code>
function example() {
  const greeting = "Hello World!";
  console.log(greeting);
}
</code></pre>`

  return `
    <div>
      ${paragraphs}
      ${list}
      ${codeBlock}
      ${paragraphs}
    </div>
  `
}

async function main() {
  const user = JSON.parse(process.env.SEED_ADMIN_JSON!)
  user.passwordHash = await hash(user.password, 10)
  delete user.password

  await prisma.user.create({
    data: {
      ...user,
      posts: {
        createMany: {
          data: Array.from({ length: 48 }).map(() => ({
            title: faker.lorem.words(3),
            content: generatePostContent(),
            image: faker.image.urlLoremFlickr({ width: 1280, height: 720 }),
          })),
        },
      },
    },
  })

  const passwordHash = await hash('password', 10)

  const users = await prisma.user.createManyAndReturn({
    data: Array.from({ length: 10 }).map(() => ({
      email: faker.internet.email(),
      name: faker.internet.username(),
      passwordHash,
    })),
    select: { userId: true },
  })

  const posts = await prisma.post.findMany({
    where: { authorId: user.id },
  })

  for (const post of posts) {
    await prisma.comment.createMany({
      data: Array.from({ length: 5 }).map(() => ({
        content: faker.lorem.sentence({ max: 24, min: 12 }),
        postId: post.postId,
        authorId: users[Math.floor(Math.random() * users.length)].userId,
      })),
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
