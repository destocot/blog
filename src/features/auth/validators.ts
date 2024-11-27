import * as v from 'valibot'

export const LoginSchema = v.object({
  email: v.pipe(
    v.string('Your email must be a string.'),
    v.nonEmpty('Please enter your email.'),
    v.email('The email address is badly formatted.'),
  ),
  password: v.pipe(
    v.string('Your password must be a string.'),
    v.nonEmpty('Please enter your password.'),
    v.minLength(6, 'Your password must have 6 characters or more.'),
  ),
})

export type LoginInput = v.InferInput<typeof LoginSchema>
export type LoginOutput = v.InferOutput<typeof LoginSchema>

export const RegisterSchema = v.pipe(
  v.object({
    email: v.pipe(
      v.string('Your email must be a string.'),
      v.nonEmpty('Please enter your email.'),
      v.email('The email address is badly formatted'),
    ),
    password: v.pipe(
      v.string('Your password must be a string.'),
      v.nonEmpty('Please enter your password.'),
      v.minLength(6, 'Your password must have 6 characters or more.'),
    ),
    confirmPassword: v.pipe(
      v.string('Your password must be a string.'),
      v.nonEmpty('Please confirm your password.'),
    ),
  }),
  v.forward(
    v.partialCheck(
      [['password'], ['confirmPassword']],
      (input) => input.password === input.confirmPassword,
      'The two passwords do not match.',
    ),
    ['confirmPassword'],
  ),
)

export type RegisterInput = v.InferInput<typeof RegisterSchema>
export type RegisterOutput = v.InferOutput<typeof RegisterSchema>
