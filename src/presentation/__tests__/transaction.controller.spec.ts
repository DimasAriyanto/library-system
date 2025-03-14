import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from '../controllers/transaction.controller';
import { BorrowBookUseCase } from '../../application/use-cases/borrow-book.use-case';
import { ReturnBookUseCase } from '../../application/use-cases/return-book.use-case';
import {
  BorrowBookDto,
  BorrowBookSchema,
} from '../../application/dtos/borrow-book.dto';
import {
  ReturnBookDto,
  ReturnBookSchema,
} from '../../application/dtos/return-book.dto';
import { ZodError } from 'zod';

describe('TransactionController', () => {
  let controller: TransactionController;
  let mockBorrowBookUseCase: jest.Mocked<BorrowBookUseCase>;
  let mockReturnBookUseCase: jest.Mocked<ReturnBookUseCase>;

  beforeEach(async () => {
    mockBorrowBookUseCase = { execute: jest.fn() } as any;
    mockReturnBookUseCase = { execute: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        { provide: BorrowBookUseCase, useValue: mockBorrowBookUseCase },
        { provide: ReturnBookUseCase, useValue: mockReturnBookUseCase },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
  });

  describe('borrowBook', () => {
    const mockBorrowDto: BorrowBookDto = {
      memberCode: 'M001',
      bookCode: 'JK-45',
    };

    it('should successfully borrow a book', async () => {
      mockBorrowBookUseCase.execute.mockResolvedValue(
        'Book borrowed successfully.',
      );

      const result = await controller.borrowBook(mockBorrowDto);
      expect(result).toEqual({
        status: 'success',
        message: 'Book borrowed successfully.',
      });
      expect(mockBorrowBookUseCase.execute).toHaveBeenCalledWith(mockBorrowDto);
    });

    it('should fail when member not found', async () => {
      mockBorrowBookUseCase.execute.mockRejectedValue(
        new Error('Member not found.'),
      );

      await expect(controller.borrowBook(mockBorrowDto)).rejects.toThrowError(
        'Member not found.',
      );
      expect(mockBorrowBookUseCase.execute).toHaveBeenCalledWith(mockBorrowDto);
    });

    it('should fail when DTO validation fails', async () => {
      const invalidBorrowDto: any = { memberCode: '', bookCode: '' };

      expect(() => BorrowBookSchema.parse(invalidBorrowDto)).toThrow(ZodError);
      expect(mockBorrowBookUseCase.execute).not.toHaveBeenCalled();
    });
  });

  describe('returnBook', () => {
    const mockReturnDto: ReturnBookDto = {
      memberCode: 'M001',
      bookCode: 'JK-45',
    };

    it('should successfully return a book', async () => {
      mockReturnBookUseCase.execute.mockResolvedValue(
        'Book returned successfully.',
      );

      const result = await controller.returnBook(mockReturnDto);
      expect(result).toEqual({
        status: 'success',
        message: 'Book returned successfully.',
      });
      expect(mockReturnBookUseCase.execute).toHaveBeenCalledWith(mockReturnDto);
    });

    it('should fail when book is already returned', async () => {
      mockReturnBookUseCase.execute.mockRejectedValue(
        new Error('This book has already been returned.'),
      );

      await expect(controller.returnBook(mockReturnDto)).rejects.toThrowError(
        'This book has already been returned.',
      );
      expect(mockReturnBookUseCase.execute).toHaveBeenCalledWith(mockReturnDto);
    });

    it('should fail when DTO validation fails', async () => {
      const invalidReturnDto: any = { memberCode: '', bookCode: '' };

      expect(() => ReturnBookSchema.parse(invalidReturnDto)).toThrow(ZodError);
      expect(mockReturnBookUseCase.execute).not.toHaveBeenCalled();
    });
  });
});
