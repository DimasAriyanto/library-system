import { Injectable, NotFoundException } from '@nestjs/common';
import { IBookRepository } from '../../application/interfaces/i-book.repository';
import { BookEntity } from '../../domain/entities/book.entity';
import { CreateBookDto } from 'src/application/dtos/create-book.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookRepository implements IBookRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createBook(dto: CreateBookDto): Promise<void> {
    await this.prisma.book.create({
      data: {
        code: dto.code,
        title: dto.title,
        author: dto.author,
        stock: dto.stock,
      },
    });
  }

  async findAll(): Promise<BookEntity[]> {
    const books = await this.prisma.book.findMany();

    return books.map(
      (book) =>
        new BookEntity({
          id: book.id,
          code: book.code,
          title: book.title,
          author: book.author,
          stock: book.stock,
        }),
    );
  }

  async findByCode(code: string): Promise<BookEntity | null> {
    const book = await this.prisma.book.findUnique({
      where: { code },
    });

    if (!book) return null;

    return new BookEntity({
      id: book.id,
      code: book.code,
      title: book.title,
      author: book.author,
      stock: book.stock,
    });
  }

  async updateStock(code: string, stock: number): Promise<void> {
    const book = await this.prisma.book.findUnique({ where: { code } });

    if (!book) {
      throw new NotFoundException(`Book with code ${code} not found.`);
    }

    await this.prisma.book.update({
      where: { code },
      data: { stock },
    });
  }
}
