import { z } from 'zod';

export const TransactionSchema = z.object({
  id: z.string().uuid(),
  memberId: z.string().uuid(),
  bookId: z.string().uuid(),
  borrowedAt: z.date(),
  returnedAt: z.date().nullable().default(null),
});

export type Transaction = z.infer<typeof TransactionSchema>;

export class TransactionEntity {
  private transaction: Transaction;

  constructor(transaction: Transaction) {
    const parsed = TransactionSchema.parse(transaction);
    this.transaction = parsed;
  }

  get data() {
    return this.transaction;
  }

  setReturnedAt(date: Date): void {
    this.transaction.returnedAt = date;
  }

  markAsReturned(): void {
    if (this.transaction.returnedAt) {
      throw new Error('This transaction has already been completed.');
    }
    this.setReturnedAt(new Date());
  }

  isOverdue(): boolean {
    const now = new Date();
    const dueDate = new Date(this.transaction.borrowedAt);
    dueDate.setDate(dueDate.getDate() + 7);
    return now > dueDate;
  }
}
