import { BookEntity } from '../entities/book.entity';
import { v4 as uuidv4 } from 'uuid';

describe('BookEntity', () => {
  let book: BookEntity;

  beforeEach(() => {
    book = new BookEntity({
      id: uuidv4(),
      code: 'JK-45',
      title: 'Harry Potter',
      author: 'J.K Rowling',
      stock: 3,
    });
  });

  it('should decrease stock if stock is available', () => {
    book.decreaseStock();

    expect(book.data.stock).toBe(2);
  });

  it('should throw error if stock is 0 when trying to decrease', () => {
    book = new BookEntity({
      id: uuidv4(),
      code: 'JK-45',
      title: 'Harry Potter',
      author: 'J.K Rowling',
      stock: 0,
    });

    expect(() => book.decreaseStock()).toThrowError('Book is out of stock.');
  });

  it('should increase stock when book is returned', () => {
    book.increaseStock();

    expect(book.data.stock).toBe(4);
  });

  it('should correctly increase stock multiple times', () => {
    book.increaseStock();
    book.increaseStock();

    expect(book.data.stock).toBe(5);
  });
});
