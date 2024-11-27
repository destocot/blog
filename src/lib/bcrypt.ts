import { hash, compare } from 'bcryptjs'

const SALT_ROUNDS = 10

export async function hashPassword(password: string) {
  return hash(password, SALT_ROUNDS)
}

export async function comparePasswords(password: string, hash: string) {
  return compare(password, hash)
}
