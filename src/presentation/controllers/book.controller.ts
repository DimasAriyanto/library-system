import { Body, Controller, Get, Post } from '@nestjs/common';
import { CheckBookUseCase } from '../../application/use-cases/check-book.use-case';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '../../shared/middleware/zod-validation.middleware';
import { CreateBookUseCase } from '../../application/use-cases/create-book.use-case';
import {
  CreateBookDto,
  CreateBookDtoClass,
  CreateBookSchema,
} from '../../application/dtos/create-book.dto';

@ApiTags('Books')
@Controller('books')
export class BookController {
  constructor(
    private readonly checkBookUseCase: CheckBookUseCase,
    private readonly createBookUseCase: CreateBookUseCase,
  ) {}

  @Post('/add')
  @ApiOperation({ summary: 'Tambah buku baru ke sistem perpustakaan' })
  @ApiBody({
    type: CreateBookDtoClass,
    description: 'Data buku yang akan ditambahkan',
  })
  @ApiResponse({
    status: 201,
    description: 'Buku berhasil ditambahkan.',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        message: {
          type: 'string',
          example: 'Book "Harry Potter" successfully added.',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Data tidak valid.',
  })
  async addBook(
    @Body(new ZodValidationPipe(CreateBookSchema)) dto: CreateBookDto,
  ) {
    const result = await this.createBookUseCase.execute(dto);
    return { status: 'success', message: result };
  }

  @Get('/check')
  @ApiOperation({ summary: 'Cek daftar buku yang tersedia' })
  @ApiResponse({
    status: 200,
    description: 'Daftar anggota berhasil dimuat.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          code: { type: 'string', example: 'M001' },
          name: { type: 'string', example: 'Angga' },
          borrowedBooks: { type: 'number', example: 1 },
        },
      },
    },
  })
  async getAvailableBooks() {
    const result = await this.checkBookUseCase.execute();
    return {
      status: 'success',
      message: 'Daftar buku berhasil dimuat.',
      data: result,
    };
  }
}
