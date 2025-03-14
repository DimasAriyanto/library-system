import { ReturnBookUseCase } from '../use-cases/return-book.use-case';
import { IBookRepository } from '../interfaces/i-book.repository';
import { IMemberRepository } from '../interfaces/i-member.repository';
import { ITransactionRepository } from '../interfaces/i-transaction.repository';
import { ReturnBookDto } from '../dtos/return-book.dto';
import { BookEntity } from '../../domain/entities/book.entity';
import { MemberEntity } from '../../domain/entities/member.entity';
import { TransactionEntity } from '../../domain/entities/transaction.entity';
import { v4 as uuidv4 } from 'uuid';

describe('ReturnBookUseCase', () => {
  let returnBookUseCase: ReturnBookUseCase;
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

    returnBookUseCase = new ReturnBookUseCase(
      mockBookRepository,
      mockMemberRepository,
      mockTransactionRepository,
    );
  });

  it('should successfully return a book', async () => {
    const dto: ReturnBookDto = { memberCode: 'M001', bookCode: 'JK-45' };

    const mockMember = new MemberEntity({
      id: uuidv4(),
      code: 'M001',
      name: 'Angga',
      borrowedBooks: ['JK-45'],
      penaltyExpiry: null,
    });

    const mockBook = new BookEntity({
      id: uuidv4(),
      code: 'JK-45',
      title: 'Harry Potter',
      author: 'J.K Rowling',
      stock: 0,
    });

    const mockTransaction = new TransactionEntity({
      id: uuidv4(),
      memberId: mockMember.data.id,
      bookId: mockBook.data.id,
      borrowedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      returnedAt: null,
    });

    mockMemberRepository.findByCode.mockResolvedValue(mockMember);
    mockBookRepository.findByCode.mockResolvedValue(mockBook);
    mockTransactionRepository.findTransaction.mockResolvedValue(
      mockTransaction,
    );

    const result = await returnBookUseCase.execute(dto);

    expect(result).toEqual(`Book "Harry Potter" successfully returned.`);
    expect(mockBookRepository.updateStock).toHaveBeenCalledWith('JK-45', 1);
  });

  it('should penalize member if book is returned late', async () => {
    const dto: ReturnBookDto = { memberCode: 'M001', bookCode: 'JK-45' };

    const mockMember = new MemberEntity({
      id: uuidv4(),
      code: 'M001',
      name: 'Angga',
      borrowedBooks: ['JK-45'],
      penaltyExpiry: null,
    });

    const mockBook = new BookEntity({
      id: uuidv4(),
      code: 'JK-45',
      title: 'Harry Potter',
      author: 'J.K Rowling',
      stock: 0,
    });

    const mockTransaction = new TransactionEntity({
      id: uuidv4(),
      memberId: mockMember.data.id,
      bookId: mockBook.data.id,
      borrowedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      returnedAt: null,
    });

    mockMemberRepository.findByCode.mockResolvedValue(mockMember);
    mockBookRepository.findByCode.mockResolvedValue(mockBook);
    mockTransactionRepository.findTransaction.mockResolvedValue(
      mockTransaction,
    );

    const result = await returnBookUseCase.execute(dto);

    expect(result).toEqual(
      `Book "Harry Potter" returned late. Member has been penalized for 3 days.`,
    );
    expect(mockMemberRepository.updatePenalty).toHaveBeenCalled();
  });

  it('should throw error if member not found', async () => {
    const dto: ReturnBookDto = { memberCode: 'M001', bookCode: 'JK-45' };

    mockMemberRepository.findByCode.mockResolvedValue(null);

    await expect(returnBookUseCase.execute(dto)).rejects.toThrowError(
      'Member not found.',
    );
  });

  it('should throw error if book not found', async () => {
    const dto: ReturnBookDto = { memberCode: 'M001', bookCode: 'JK-45' };

    const mockMember = new MemberEntity({
      id: uuidv4(),
      code: 'M001',
      name: 'Angga',
      borrowedBooks: ['JK-45'],
      penaltyExpiry: null,
    });

    mockMemberRepository.findByCode.mockResolvedValue(mockMember);
    mockBookRepository.findByCode.mockResolvedValue(null);

    await expect(returnBookUseCase.execute(dto)).rejects.toThrowError(
      'Book not found.',
    );
  });

  it('should throw error if transaction not found', async () => {
    const dto: ReturnBookDto = { memberCode: 'M001', bookCode: 'JK-45' };

    const mockMember = new MemberEntity({
      id: uuidv4(),
      code: 'M001',
      name: 'Angga',
      borrowedBooks: ['JK-45'],
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
    mockTransactionRepository.findTransaction.mockResolvedValue(null);

    await expect(returnBookUseCase.execute(dto)).rejects.toThrowError(
      'This member did not borrow this book.',
    );
  });
});
