import { Injectable, Inject } from '@nestjs/common';
import { IBookRepository } from '../interfaces/i-book.repository';

@Injectable()
export class CheckBookUseCase {
  constructor(
    @Inject('IBookRepository') private readonly bookRepo: IBookRepository,
  ) {}

  async execute(): Promise<any[]> {
    const books = await this.bookRepo.findAll();

    const bookStatus = books.map((book) => ({
      code: book.data.code,
      title: book.data.title,
      author: book.data.author,
      availableStock: book.data.stock,
    }));

    return bookStatus;
  }
}
