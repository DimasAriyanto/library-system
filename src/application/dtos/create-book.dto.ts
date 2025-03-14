import { z } from 'zod';

export const CreateBookSchema = z.object({
  code: z.string().min(1, 'Book code is required.'),
  title: z.string().min(1, 'Book title is required.'),
  author: z.string().min(1, 'Author name is required.'),
  stock: z.number().int().positive('Stock must be a positive integer.'),
});

export type CreateBookDto = z.infer<typeof CreateBookSchema>;
