import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const ReturnBookSchema = z.object({
  memberCode: z.string().min(1, 'Member code is required.'),
  bookCode: z.string().min(1, 'Book code is required.'),
});

export type ReturnBookDto = z.infer<typeof ReturnBookSchema>;

export class ReturnBookDtoClass {
  @ApiProperty({
    description: 'Kode anggota yang mengembalikan buku',
    example: 'M001',
    required: true,
  })
  memberCode: string;

  @ApiProperty({
    description: 'Kode buku yang dikembalikan',
    example: 'B001',
    required: true,
  })
  bookCode: string;
}
