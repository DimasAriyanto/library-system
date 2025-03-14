import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { IBookRepository } from '../interfaces/i-book.repository';
import { CreateBookDto } from '../dtos/create-book.dto';

@Injectable()
export class CreateBookUseCase {
  constructor(
    @Inject('IBookRepository') private readonly bookRepo: IBookRepository,
  ) {}

  async execute(dto: CreateBookDto): Promise<string> {
    const existingBook = await this.bookRepo.findByCode(dto.code);
    if (existingBook) {
      throw new BadRequestException(
        `Book with code "${dto.code}" already exists.`,
      );
    }

    await this.bookRepo.createBook(dto);

    return `Book "${dto.title}" has been successfully added.`;
  }
}
