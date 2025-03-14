import { z } from 'zod';

export const BookSchema = z.object({
  id: z.string().uuid(),
  code: z.string().min(1, 'Book code is required.'),
  title: z.string().min(1, 'Book title is required.'),
  author: z.string().min(1, 'Author name is required.'),
  stock: z.number().int().nonnegative('Stock cannot be negative.'),
});

export type Book = z.infer<typeof BookSchema>;

export class BookEntity {
  private book: Book;

  constructor(book: Book) {
    this.book = BookSchema.parse(book);
  }

  get data() {
    return this.book;
  }

  decreaseStock(): void {
    if (this.book.stock <= 0) {
      throw new Error('Book is out of stock.');
    }
    this.book.stock -= 1;
  }

  increaseStock(): void {
    this.book.stock += 1;
  }
}
