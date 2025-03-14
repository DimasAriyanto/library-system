import { CheckBookUseCase } from '../use-cases/check-book.use-case';
import { IBookRepository } from '../interfaces/i-book.repository';
import { BookEntity } from '../../domain/entities/book.entity';
import { v4 as uuidv4 } from 'uuid';

describe('CheckBookUseCase', () => {
  let checkBookUseCase: CheckBookUseCase;
  let mockBookRepository: jest.Mocked<IBookRepository>;

  beforeEach(() => {
    mockBookRepository = {
      createBook: jest.fn(),
      findByCode: jest.fn(),
      updateStock: jest.fn(),
      findAll: jest.fn(),
    };

    checkBookUseCase = new CheckBookUseCase(mockBookRepository);
  });

  it('should return list of books with correct available stock', async () => {
    const mockBooks = [
      new BookEntity({
        id: uuidv4(),
        code: 'JK-45',
        title: 'Harry Potter',
        author: 'J.K Rowling',
        stock: 2,
      }),
      new BookEntity({
        id: uuidv4(),
        code: 'SHR-1',
        title: 'A Study in Scarlet',
        author: 'Arthur Conan Doyle',
        stock: 0,
      }),
    ];

    mockBookRepository.findAll.mockResolvedValue(mockBooks);

    const result = await checkBookUseCase.execute();

    expect(result).toEqual([
      {
        code: 'JK-45',
        title: 'Harry Potter',
        author: 'J.K Rowling',
        availableStock: 2,
      },
      {
        code: 'SHR-1',
        title: 'A Study in Scarlet',
        author: 'Arthur Conan Doyle',
        availableStock: 0,
      },
    ]);
  });

  it('should return an empty list if no books are available', async () => {
    mockBookRepository.findAll.mockResolvedValue([]);

    const result = await checkBookUseCase.execute();

    expect(result).toEqual([]);
  });
});
