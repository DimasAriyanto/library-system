import { Injectable, NotFoundException } from '@nestjs/common';
import { ITransactionRepository } from '../../application/interfaces/i-transaction.repository';
import { TransactionEntity } from '../../domain/entities/transaction.entity';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createTransaction(memberCode: string, bookCode: string): Promise<void> {
    const member = await this.prisma.member.findUnique({
      where: { code: memberCode },
    });
    const book = await this.prisma.book.findUnique({
      where: { code: bookCode },
    });

    if (!member || !book) {
      throw new Error('Member or Book not found.');
    }

    await this.prisma.transaction.create({
      data: {
        memberId: member.id,
        bookId: book.id,
        borrowedAt: new Date(),
      },
    });
  }

  async countActiveTransactions(memberCode: string): Promise<number> {
    const member = await this.prisma.member.findUnique({
      where: { code: memberCode },
    });

    if (!member) {
      throw new Error(`Member with code ${memberCode} not found.`);
    }

    const activeTransactions = await this.prisma.transaction.count({
      where: {
        memberId: member.id,
        returnedAt: null,
      },
    });

    return activeTransactions;
  }

  async findTransaction(
    memberCode: string,
    bookCode: string,
  ): Promise<TransactionEntity | null> {
    const member = await this.prisma.member.findUnique({
      where: { code: memberCode },
    });
    const book = await this.prisma.book.findUnique({
      where: { code: bookCode },
    });

    if (!member || !book) return null;

    const transaction = await this.prisma.transaction.findFirst({
      where: {
        memberId: member.id,
        bookId: book.id,
        returnedAt: null,
      },
    });

    if (!transaction) return null;

    return new TransactionEntity({
      id: transaction.id,
      memberId: transaction.memberId,
      bookId: transaction.bookId,
      borrowedAt: transaction.borrowedAt,
      returnedAt: transaction.returnedAt,
    });
  }

  async updateTransaction(
    transactionId: string,
    data: Partial<TransactionEntity>,
  ): Promise<void> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new NotFoundException(
        `Transaction with ID ${transactionId} not found.`,
      );
    }

    const transactionEntity = new TransactionEntity({
      id: transaction.id,
      memberId: transaction.memberId,
      bookId: transaction.bookId,
      borrowedAt: transaction.borrowedAt,
      returnedAt: transaction.returnedAt,
    });

    if (data.data?.returnedAt) {
      transactionEntity.setReturnedAt(data.data.returnedAt);
    }

    await this.prisma.transaction.update({
      where: { id: transactionId },
      data: {
        returnedAt: transactionEntity.data.returnedAt,
      },
    });
  }

  async countActiveTransactionsByBook(bookCode: string): Promise<number> {
    const book = await this.prisma.book.findUnique({
      where: { code: bookCode },
    });
    if (!book) return 0;

    return this.prisma.transaction.count({
      where: {
        bookId: book.id,
        returnedAt: null,
      },
    });
  }
}
