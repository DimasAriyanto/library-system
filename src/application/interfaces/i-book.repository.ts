import { BookEntity } from 'src/domain/entities/book.entity';
import { CreateBookDto } from '../dtos/create-book.dto';

export interface IBookRepository {
  createBook(dto: CreateBookDto): Promise<void>;
  findAll(): Promise<BookEntity[]>;
  findByCode(code: string): Promise<BookEntity | null>;
  updateStock(code: string, stock: number): Promise<void>;
}
