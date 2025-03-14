import { v4 as uuidv4 } from 'uuid';
import { BorrowBookUseCase } from '../use-cases/borrow-book.use-case';
import { IBookRepository } from '../interfaces/i-book.repository';
import { IMemberRepository } from '../interfaces/i-member.repository';
import { ITransactionRepository } from '../interfaces/i-transaction.repository';
import { BorrowBookDto } from '../dtos/borrow-book.dto';
import { BookEntity } from '../../domain/entities/book.entity';
import { MemberEntity } from '../../domain/entities/member.entity';

describe('BorrowBookUseCase', () => {
  let borrowBookUseCase: BorrowBookUseCase;
  let mockBookRepository: jest.Mocked<IBookRepository>;
  let mockMemberRepository: jest.Mocked<IMemberRepository>;
  let mockTransactionRepository: jest.Mocked<ITransactionRepository>;

  beforeEach(() => {
    mockBookRepository = {
      createBook: jest.fn(),
      findByCode: jest.fn(),
      updateStock: jest.fn(),
      findAll: jest.fn(),
    };

    mockMemberRepository = {
      createMember: jest.fn(),
      findByCode: jest.fn(),
      updatePenalty: jest.fn(),
      findAll: jest.fn(),
    };

    mockTransactionRepository = {
      createTransaction: jest.fn(),
      countActiveTransactions: jest.fn(),
      findTransaction: jest.fn(),
      updateTransaction: jest.fn(),
      countActiveTransactionsByBook: jest.fn(),
    };

    borrowBookUseCase = new BorrowBookUseCase(
      mockBookRepository,
      mockMemberRepository,
      mockTransactionRepository,
    );
  });

  it('should borrow book successfully', async () => {
    const dto: BorrowBookDto = { memberCode: 'M001', bookCode: 'JK-45' };

    const mockMember = new MemberEntity({
      id: uuidv4(),
      code: 'M001',
      name: 'Angga',
      borrowedBooks: [],
      penaltyExpiry: null,
    });

    const mockBook = new BookEntity({
      id: uuidv4(),
      code: 'JK-45',
      title: 'Harry Potter',
      author: 'J.K Rowling',
      stock: 1,
    });

    mockMemberRepository.findByCode.mockResolvedValue(mockMember);
    mockBookRepository.findByCode.mockResolvedValue(mockBook);
    mockTransactionRepository.countActiveTransactions.mockResolvedValue(0);

    const result = await borrowBookUseCase.execute(dto);

    expect(result).toEqual(
      'Book "Harry Potter" successfully borrowed by Angga',
    );
    expect(mockTransactionRepository.createTransaction).toHaveBeenCalledWith(
      'M001',
      'JK-45',
    );
    expect(mockBookRepository.updateStock).toHaveBeenCalledWith('JK-45', 0);
  });

  it('should throw error if member not found', async () => {
    const dto: BorrowBookDto = { memberCode: 'M001', bookCode: 'JK-45' };

    mockMemberRepository.findByCode.mockResolvedValue(null);

    await expect(borrowBookUseCase.execute(dto)).rejects.toThrowError(
      'Member not found.',
    );
  });

  it('should throw error if book is not available', async () => {
    const dto: BorrowBookDto = { memberCode: 'M001', bookCode: 'JK-45' };

    const mockMember = new MemberEntity({
      id: uuidv4(),
      code: 'M001',
      name: 'Angga',
      borrowedBooks: [],
      penaltyExpiry: null,
    });

    const mockBook = new BookEntity({
      id: uuidv4(),
      code: 'JK-45',
      title: 'Harry Potter',
      author: 'J.K Rowling',
      stock: 0,
    });

    mockMemberRepository.findByCode.mockResolvedValue(mockMember);
    mockBookRepository.findByCode.mockResolvedValue(mockBook);

    await expect(borrowBookUseCase.execute(dto)).rejects.toThrowError(
      'Book is out of stock.',
    );
  });

  it('should throw error if member is currently penalized', async () => {
    const dto: BorrowBookDto = { memberCode: 'M001', bookCode: 'JK-45' };

    const mockMember = new MemberEntity({
      id: uuidv4(),
      code: 'M001',
      name: 'Angga',
      borrowedBooks: [],
      penaltyExpiry: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    });

    mockMemberRepository.findByCode.mockResolvedValue(mockMember);

    await expect(borrowBookUseCase.execute(dto)).rejects.toThrowError(
      'Member is currently penalized.',
    );
  });
});
