import { TransactionEntity } from 'src/domain/entities/transaction.entity';

export interface ITransactionRepository {
  createTransaction(memberCode: string, bookCode: string): Promise<void>;
  countActiveTransactions(memberCode: string): Promise<number>;
  findTransaction(
    memberCode: string,
    bookCode: string,
  ): Promise<TransactionEntity | null>;
  updateTransaction(
    transactionId: string,
    data: Partial<TransactionEntity>,
  ): Promise<void>;
  countActiveTransactionsByBook(bookCode: string): Promise<number>;
}
