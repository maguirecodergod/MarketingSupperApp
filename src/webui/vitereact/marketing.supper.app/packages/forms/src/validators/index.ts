import { z } from 'zod';

export const commonValidators = {
  email: z.string().email('Please enter a valid email address'),
  nonEmptyString: (field: string) => z.string().min(1, `${field} is required`),
  username: z.string().min(3, 'Username must be at least 3 characters').max(150),
  name: z.string().min(1, 'Name is required').max(100),
  uuid: z.string().uuid('Invalid UUID format'),
};
