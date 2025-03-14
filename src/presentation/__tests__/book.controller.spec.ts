import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from '../controllers/book.controller';
import { CheckBookUseCase } from '../../application/use-cases/check-book.use-case';
import { CreateBookUseCase } from '../../application/use-cases/create-book.use-case';
import { CreateBookDto } from '../../application/dtos/create-book.dto';

describe('BookController', () => {
  let controller: BookController;
  let mockCheckBookUseCase: jest.Mocked<CheckBookUseCase>;
  let mockCreateBookUseCase: jest.Mocked<CreateBookUseCase>;

  beforeEach(async () => {
    mockCheckBookUseCase = {
      execute: jest.fn(),
    } as any;

    mockCreateBookUseCase = {
      execute: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        { provide: CheckBookUseCase, useValue: mockCheckBookUseCase },
        { provide: CreateBookUseCase, useValue: mockCreateBookUseCase },
      ],
    }).compile();

    controller = module.get<BookController>(BookController);
  });

  it('should return list of available books successfully', async () => {
    const mockBooks = [
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
    ];

    mockCheckBookUseCase.execute.mockResolvedValue(mockBooks);

    const result = await controller.getAvailableBooks();

    expect(result).toEqual({
      status: 'success',
      message: 'Daftar buku berhasil dimuat.',
      data: mockBooks,
    });

    expect(mockCheckBookUseCase.execute).toHaveBeenCalled();
  });

  it('should create a new book successfully', async () => {
    const mockDto: CreateBookDto = {
      code: 'JK-45',
      title: 'Harry Potter',
      author: 'J.K Rowling',
      stock: 3,
    };

    mockCreateBookUseCase.execute.mockResolvedValue(
      `Book "${mockDto.title}" has been successfully added.`,
    );

    const result = await controller.addBook(mockDto);

    expect(result).toEqual({
      status: 'success',
      message: `Book "${mockDto.title}" has been successfully added.`,
    });

    expect(mockCreateBookUseCase.execute).toHaveBeenCalledWith(mockDto);
  });

  it('should handle error if createBook fails', async () => {
    const mockDto: CreateBookDto = {
      code: 'JK-45',
      title: 'Harry Potter',
      author: 'J.K Rowling',
      stock: 3,
    };

    mockCreateBookUseCase.execute.mockRejectedValue(
      new Error('Failed to create book'),
    );

    await expect(controller.addBook(mockDto)).rejects.toThrowError(
      'Failed to create book',
    );

    expect(mockCreateBookUseCase.execute).toHaveBeenCalledWith(mockDto);
  });
});
