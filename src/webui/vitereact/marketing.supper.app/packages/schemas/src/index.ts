import { z } from 'zod';

export const userStatusSchema = z.enum(['active', 'inactive', 'locked', 'pending']);
export const sortDirectionSchema = z.enum(['asc', 'desc']);
export const userSortBySchema = z.enum(['username', 'displayName', 'email', 'status', 'createdAt', 'updatedAt']);

export const userListSearchSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().refine((val) => [10, 25, 50, 100].includes(val), {
    message: 'Page size must be 10, 25, 50, or 100',
  }).default(25),
  q: z.string().max(200).default(''),
  status: z.enum(['all', 'active', 'inactive', 'locked', 'pending']).default('all'),
  sortBy: userSortBySchema.default('createdAt'),
  sortDir: sortDirectionSchema.default('desc'),
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  displayName: z.string().min(1, 'Display name is required').max(200),
  email: z.string().email('Valid email is required').max(320),
});

export const updateUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  displayName: z.string().min(1, 'Display name is required').max(200),
  email: z.string().email('Valid email is required').max(320),
  status: userStatusSchema,
  roles: z.array(z.string()).min(1, 'At least one role must be assigned'),
});

export type UserListSearch = z.infer<typeof userListSearchSchema>;
export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
