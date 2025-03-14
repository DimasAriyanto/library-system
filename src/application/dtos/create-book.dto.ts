import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const CreateBookSchema = z.object({
  code: z.string().min(1, 'Book code is required.'),
  title: z.string().min(1, 'Book title is required.'),
  author: z.string().min(1, 'Author name is required.'),
  stock: z.number().int().positive('Stock must be a positive integer.'),
});

export type CreateBookDto = z.infer<typeof CreateBookSchema>;

export class CreateBookDtoClass {
  @ApiProperty({
    description: 'Kode unik buku',
    example: 'JK-45',
    required: true,
  })
  code: string;

  @ApiProperty({
    description: 'Judul buku',
    example: 'Harry Potter',
    required: true,
  })
  title: string;

  @ApiProperty({
    description: 'Nama penulis buku',
    example: 'J.K Rowling',
    required: true,
  })
  author: string;

  @ApiProperty({ description: 'Jumlah stok buku', example: 5, required: true })
  stock: number;
}
