import { useForm, type FormOptions } from '@tanstack/react-form';
import { type z } from 'zod';

export function useAppForm<TData, TSchema extends z.ZodType<TData>>(
  options: FormOptions<TData> & {
    schema?: TSchema;
  },
) {
  return useForm({
    ...options,
    validators: {
      ...options.validators,
      onChange: ({ value }) => {
        if (options.schema) {
          const result = options.schema.safeParse(value);
          if (!result.success) {
            return result.error.errors[0]?.message;
          }
        }
        return undefined;
      },
    },
  });
}
