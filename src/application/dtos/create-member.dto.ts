import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const CreateMemberSchema = z.object({
  code: z.string().min(1, 'Member code is required.'),
  name: z.string().min(1, 'Member name is required.'),
});

export type CreateMemberDto = z.infer<typeof CreateMemberSchema>;

export class CreateMemberDtoClass {
  @ApiProperty({
    description: 'Kode unik anggota',
    example: 'M001',
    required: true,
  })
  code: string;

  @ApiProperty({
    description: 'Nama anggota',
    example: 'Angga',
    required: true,
  })
  name: string;
}
