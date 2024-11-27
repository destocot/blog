import * as v from 'valibot'

export type ActionState = {
  error?: string
  success?: string
  [key: string]: unknown
}

type ValidatedActionFunction<
  S extends v.ObjectSchema<v.ObjectEntries, undefined>,
  T,
> = (data: v.InferInput<S>, formData: FormData) => Promise<T>

export function validatedAction<
  S extends v.ObjectSchema<v.ObjectEntries, undefined>,
  T,
>(schema: S, action: ValidatedActionFunction<S, T>) {
  return async (prevState: ActionState, formData: FormData): Promise<T> => {
    const result = v.safeParse(schema, Object.fromEntries(formData))

    if (!result.success) {
      return { error: result.issues[0].message } as T
    }

    return action(result.output, formData)
  }
}
