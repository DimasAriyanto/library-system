import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const BorrowBookSchema = z.object({
  memberCode: z.string().min(1, 'Member code is required.'),
  bookCode: z.string().min(1, 'Book code is required.'),
});

export type BorrowBookDto = z.infer<typeof BorrowBookSchema>;

export class BorrowBookDtoClass {
  @ApiProperty({
    description: 'Kode anggota yang akan meminjam buku',
    example: 'M001',
    required: true,
  })
  memberCode: string;

  @ApiProperty({
    description: 'Kode buku yang akan dipinjam',
    example: 'B001',
    required: true,
  })
  bookCode: string;
}
