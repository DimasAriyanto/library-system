import { Body, Controller, Post } from '@nestjs/common';
import {
  BorrowBookSchema,
  BorrowBookDtoClass,
} from '../../application/dtos/borrow-book.dto';
import {
  ReturnBookSchema,
  ReturnBookDtoClass,
} from '../../application/dtos/return-book.dto';
import { BorrowBookUseCase } from '../../application/use-cases/borrow-book.use-case';
import { ReturnBookUseCase } from '../../application/use-cases/return-book.use-case';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '../../shared/middleware/zod-validation.middleware';

@ApiTags('Transactions')
@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly borrowBookUseCase: BorrowBookUseCase,
    private readonly returnBookUseCase: ReturnBookUseCase,
  ) {}

  @Post('/borrow')
  @ApiOperation({ summary: 'Meminjam buku' })
  @ApiBody({
    type: BorrowBookDtoClass,
    description: 'Data peminjaman buku',
  })
  @ApiResponse({
    status: 201,
    description: 'Berhasil meminjam buku.',
    schema: {
      type: 'string',
      example: 'Book "Laskar Pelangi" successfully borrowed by John Doe',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Data tidak valid atau syarat peminjaman tidak terpenuhi.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              field: { type: 'string', example: 'memberId' },
              message: { type: 'string', example: 'Member ID is required' },
            },
          },
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Member atau buku tidak ditemukan.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Member not found.' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  async borrowBook(@Body(new ZodValidationPipe(BorrowBookSchema)) dto: any) {
    return await this.borrowBookUseCase.execute(dto);
  }

  @Post('/return')
  @ApiOperation({ summary: 'Mengembalikan buku' })
  @ApiBody({
    type: ReturnBookDtoClass,
    description: 'Data pengembalian buku',
  })
  @ApiResponse({
    status: 201,
    description: 'Berhasil mengembalikan buku.',
    schema: {
      type: 'string',
      example: 'Book "Laskar Pelangi" successfully returned.',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Data tidak valid atau buku belum dipinjam.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              field: { type: 'string', example: 'bookId' },
              message: { type: 'string', example: 'Book ID is required' },
            },
          },
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Member atau buku tidak ditemukan.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Book not found.' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  async returnBook(@Body(new ZodValidationPipe(ReturnBookSchema)) dto: any) {
    return await this.returnBookUseCase.execute(dto);
  }
}
