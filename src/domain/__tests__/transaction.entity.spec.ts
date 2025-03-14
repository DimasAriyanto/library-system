import { TransactionEntity } from '../entities/transaction.entity';
import { v4 as uuidv4 } from 'uuid';

describe('TransactionEntity', () => {
  let transaction: TransactionEntity;

  beforeEach(() => {
    transaction = new TransactionEntity({
      id: uuidv4(),
      memberId: uuidv4(),
      bookId: uuidv4(),
      borrowedAt: new Date(),
      returnedAt: null,
    });
  });

  it('should mark transaction as returned', () => {
    transaction.markAsReturned();

    expect(transaction.data.returnedAt).toBeInstanceOf(Date);
  });

  it('should throw error if transaction is already marked as returned', () => {
    transaction.markAsReturned();

    expect(() => transaction.markAsReturned()).toThrowError(
      'This transaction has already been completed.',
    );
  });

  it('should return false for isOverdue() if returned within 7 days', () => {
    transaction = new TransactionEntity({
      id: uuidv4(),
      memberId: uuidv4(),
      bookId: uuidv4(),
      borrowedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      returnedAt: new Date(),
    });

    expect(transaction.isOverdue()).toBe(false);
  });

  it('should return true for isOverdue() if returned after 7 days', () => {
    transaction = new TransactionEntity({
      id: uuidv4(),
      memberId: uuidv4(),
      bookId: uuidv4(),
      borrowedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      returnedAt: null,
    });

    expect(transaction.isOverdue()).toBe(true);
  });

  it('should return false for isOverdue() if still within 7 days', () => {
    transaction = new TransactionEntity({
      id: uuidv4(),
      memberId: uuidv4(),
      bookId: uuidv4(),
      borrowedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      returnedAt: null,
    });

    expect(transaction.isOverdue()).toBe(false);
  });
});
