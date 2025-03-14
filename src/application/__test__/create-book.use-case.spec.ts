import { CreateBookUseCase } from '../use-cases/create-book.use-case';
import { IBookRepository } from '../interfaces/i-book.repository';
import { CreateBookDto } from '../dtos/create-book.dto';
import { BadRequestException } from '@nestjs/common';

describe('CreateBookUseCase', () => {
  let createBookUseCase: CreateBookUseCase;
  let mockBookRepository: jest.Mocked<IBookRepository>;

  beforeEach(() => {
    mockBookRepository = {
      findAll: jest.fn(),
      findByCode: jest.fn(),
      createBook: jest.fn(),
      updateStock: jest.fn(),
    };

    createBookUseCase = new CreateBookUseCase(mockBookRepository);
  });

  it('should create a new book successfully', async () => {
    const mockDto: CreateBookDto = {
      code: 'JK-45',
      title: 'Harry Potter',
      author: 'J.K Rowling',
      stock: 5,
    };

    mockBookRepository.findByCode.mockResolvedValue(null);
    mockBookRepository.createBook.mockResolvedValue();

    const result = await createBookUseCase.execute(mockDto);

    expect(result).toBe('Book "Harry Potter" has been successfully added.');
    expect(mockBookRepository.findByCode).toHaveBeenCalledWith('JK-45');
    expect(mockBookRepository.createBook).toHaveBeenCalledWith(mockDto);
  });

  it('should throw error if book with the same code already exists', async () => {
    const mockDto: CreateBookDto = {
      code: 'JK-45',
      title: 'Harry Potter',
      author: 'J.K Rowling',
      stock: 5,
    };

    mockBookRepository.findByCode.mockResolvedValue({
      data: mockDto,
    } as any);

    await expect(createBookUseCase.execute(mockDto)).rejects.toThrow(
      new BadRequestException(`Book with code "JK-45" already exists.`),
    );

    expect(mockBookRepository.findByCode).toHaveBeenCalledWith('JK-45');
    expect(mockBookRepository.createBook).not.toHaveBeenCalled();
  });
});
