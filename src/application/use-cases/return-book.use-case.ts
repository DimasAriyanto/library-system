import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ReturnBookDto } from '../dtos/return-book.dto';
import { IBookRepository } from '../interfaces/i-book.repository';
import { IMemberRepository } from '../interfaces/i-member.repository';
import { ITransactionRepository } from '../interfaces/i-transaction.repository';

@Injectable()
export class ReturnBookUseCase {
  constructor(
    @Inject('IBookRepository') private readonly bookRepo: IBookRepository,
    @Inject('IMemberRepository') private readonly memberRepo: IMemberRepository,
    @Inject('ITransactionRepository')
    private readonly transactionRepo: ITransactionRepository,
  ) {}

  async execute(dto: ReturnBookDto): Promise<string> {
    const { memberCode, bookCode } = dto;

    const memberEntity = await this.memberRepo.findByCode(memberCode);
    if (!memberEntity) throw new NotFoundException('Member not found.');

    const bookEntity = await this.bookRepo.findByCode(bookCode);
    if (!bookEntity) throw new NotFoundException('Book not found.');

    const transaction = await this.transactionRepo.findTransaction(
      memberCode,
      bookCode,
    );
    if (!transaction)
      throw new BadRequestException('This member did not borrow this book.');

    const transactionData = transaction.data;
    if (transactionData.returnedAt) {
      throw new BadRequestException('This book has already been returned.');
    }

    transaction.markAsReturned();
    await this.transactionRepo.updateTransaction(transactionData.id, {
      data: { returnedAt: transaction.data.returnedAt },
    });

    bookEntity.increaseStock();
    await this.bookRepo.updateStock(bookCode, bookEntity.data.stock);

    if (transaction.isOverdue()) {
      memberEntity.applyPenalty(3);
      await this.memberRepo.updatePenalty(
        memberCode,
        memberEntity.data.penaltyExpiry!,
      );

      return `Book "${bookEntity.data.title}" returned late. Member has been penalized for 3 days.`;
    }

    return `Book "${bookEntity.data.title}" successfully returned.`;
  }
}
