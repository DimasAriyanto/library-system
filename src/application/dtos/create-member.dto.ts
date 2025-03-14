import { z } from 'zod';

export const CreateMemberSchema = z.object({
  code: z.string().min(1, 'Member code is required.'),
  name: z.string().min(1, 'Member name is required.'),
});

export type CreateMemberDto = z.infer<typeof CreateMemberSchema>;
