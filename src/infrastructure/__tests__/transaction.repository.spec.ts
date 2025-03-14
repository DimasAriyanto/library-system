import { Test, TestingModule } from '@nestjs/testing';
import { TransactionRepository } from '../repositories/transaction.repository';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionEntity } from '../../domain/entities/transaction.entity';
import { v4 as uuidv4 } from 'uuid';

describe('TransactionRepository (Integration Test)', () => {
  let transactionRepository: TransactionRepository;
  let prismaService: PrismaService;

  const memberId = '550e8400-e29b-41d4-a716-446655440000';
  const bookId = '550e8400-e29b-41d4-a716-446655440001';

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, TransactionRepository],
    }).compile();

    transactionRepository = module.get<TransactionRepository>(
      TransactionRepository,
    );
    prismaService = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await prismaService.cleanDatabase();

    await prismaService.$transaction(async (tx) => {
      await tx.member.create({
        data: {
          id: memberId,
          code: 'M001',
          name: 'Angga',
          penaltyExpiry: null,
        },
      });

      await tx.book.create({
        data: {
          id: bookId,
          code: 'JK-45',
          title: 'Harry Potter',
          author: 'J.K Rowling',
          stock: 3,
        },
      });

      const createdTransaction = await tx.transaction.create({
        data: {
          id: uuidv4(),
          memberId,
          bookId,
          borrowedAt: new Date(),
          returnedAt: null,
        },
      });

      if (!createdTransaction) {
        throw new Error('Transaction creation failed in beforeEach');
      }
    });
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('should create a transaction successfully', async () => {
    await transactionRepository.createTransaction('M001', 'JK-45');

    const createdTransaction = await prismaService.transaction.findFirst({
      where: { memberId, bookId },
      orderBy: { borrowedAt: 'desc' },
      take: 1,
    });

    expect(createdTransaction).not.toBeNull();
    expect(createdTransaction?.memberId).toBe(memberId);
    expect(createdTransaction?.bookId).toBe(bookId);
  });

  it('should find transaction by memberCode and bookCode', async () => {
    const result = await transactionRepository.findTransaction('M001', 'JK-45');

    expect(result).toBeInstanceOf(TransactionEntity);
    expect(result?.data.memberId).toBe(memberId);
    expect(result?.data.bookId).toBe(bookId);
  });

  it('should return null if transaction not found', async () => {
    const result = await transactionRepository.findTransaction(
      'M001',
      'INVALID-CODE',
    );

    expect(result).toBeNull();
  });

  it('should update transaction successfully', async () => {
    const mockTransaction = await prismaService.transaction.findFirst({
      where: { memberId, bookId },
    });

    if (!mockTransaction) {
      throw new Error('Transaction not found during test setup.');
    }

    const transactionEntity = new TransactionEntity({
      id: mockTransaction.id,
      memberId: mockTransaction.memberId,
      bookId: mockTransaction.bookId,
      borrowedAt: mockTransaction.borrowedAt,
      returnedAt: null,
    });

    transactionEntity.setReturnedAt(new Date());

    await transactionRepository.updateTransaction(
      mockTransaction.id,
      transactionEntity,
    );

    const updatedTransaction = await prismaService.transaction.findUnique({
      where: { id: mockTransaction.id },
    });

    expect(updatedTransaction?.returnedAt).toBeInstanceOf(Date);
  });

  it('should throw error if transaction does not exist during update', async () => {
    const nonExistentTransactionId = uuidv4();

    const mockTransaction = new TransactionEntity({
      id: nonExistentTransactionId,
      memberId: uuidv4(),
      bookId: uuidv4(),
      borrowedAt: new Date(),
      returnedAt: null,
    });

    await expect(
      transactionRepository.updateTransaction(
        mockTransaction.data.id,
        mockTransaction,
      ),
    ).rejects.toThrowError();
  });

  it('should count active transactions for a member', async () => {
    const result = await transactionRepository.countActiveTransactions('M001');

    expect(result).toBe(1);
  });

  it('should count active transactions for a book', async () => {
    const result =
      await transactionRepository.countActiveTransactionsByBook('JK-45');

    expect(result).toBe(1);
  });
});
