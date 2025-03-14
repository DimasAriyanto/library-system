import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from '../controllers/book.controller';
import { CheckBookUseCase } from '../../application/use-cases/check-book.use-case';
import { CreateBookUseCase } from '../../application/use-cases/create-book.use-case';

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

    expect(result).toEqual(mockBooks);
    expect(mockCheckBookUseCase.execute).toHaveBeenCalled();
  });
});
