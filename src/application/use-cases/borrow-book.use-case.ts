import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { BorrowBookDto } from '../dtos/borrow-book.dto';
import { IBookRepository } from '../interfaces/i-book.repository';
import { IMemberRepository } from '../interfaces/i-member.repository';
import { ITransactionRepository } from '../interfaces/i-transaction.repository';

@Injectable()
export class BorrowBookUseCase {
  constructor(
    @Inject('IBookRepository')
    private readonly bookRepo: IBookRepository,

    @Inject('IMemberRepository')
    private readonly memberRepo: IMemberRepository,

    @Inject('ITransactionRepository')
    private readonly transactionRepo: ITransactionRepository,
  ) {}

  async execute(dto: BorrowBookDto): Promise<string> {
    const { memberCode, bookCode } = dto;

    const memberEntity = await this.memberRepo.findByCode(memberCode);
    if (!memberEntity) throw new NotFoundException('Member not found.');

    const memberData = memberEntity.data;
    if (
      memberData.penaltyExpiry &&
      new Date() < new Date(memberData.penaltyExpiry)
    ) {
      throw new BadRequestException('Member is currently penalized.');
    }

    const bookEntity = await this.bookRepo.findByCode(bookCode);
    if (!bookEntity) {
      throw new BadRequestException('Book is not available.');
    }

    const bookData = bookEntity.data;
    if (bookData.stock < 1) {
      throw new BadRequestException('Book is out of stock.');
    }

    const activeBorrowedBooks =
      await this.transactionRepo.countActiveTransactions(memberCode);
    if (activeBorrowedBooks >= 2) {
      throw new BadRequestException('Member cannot borrow more than 2 books.');
    }

    await this.transactionRepo.createTransaction(memberCode, bookCode);

    bookEntity.decreaseStock();
    await this.bookRepo.updateStock(bookCode, bookEntity.data.stock);

    return `Book "${bookData.title}" successfully borrowed by ${memberData.name}`;
  }
}
