import { Body, Controller, Get, Post } from '@nestjs/common';
import { CheckBookUseCase } from '../../application/use-cases/check-book.use-case';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '../../shared/middleware/zod-validation.middleware';
import { CreateBookUseCase } from '../../application/use-cases/create-book.use-case';
import {
  CreateBookDto,
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
  async addBook(
    @Body(new ZodValidationPipe(CreateBookSchema)) dto: CreateBookDto,
  ) {
    return this.createBookUseCase.execute(dto);
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
          name: { type: 'string', example: 'John Doe' },
          borrowedBooks: { type: 'number', example: 1 },
        },
      },
    },
  })
  async getAvailableBooks() {
    return this.checkBookUseCase.execute();
  }
}
