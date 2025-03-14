import { Module } from '@nestjs/common';
import { BorrowBookUseCase } from './application/use-cases/borrow-book.use-case';
import { BookRepository } from './infrastructure/repositories/book.repository';
import { MemberRepository } from './infrastructure/repositories/member.repository';
import { TransactionRepository } from './infrastructure/repositories/transaction.repository';
import { TransactionController } from './presentation/controllers/transaction.controller';
import { ReturnBookUseCase } from './application/use-cases/return-book.use-case';
import { CheckBookUseCase } from './application/use-cases/check-book.use-case';
import { BookController } from './presentation/controllers/book.controller';
import { MemberController } from './presentation/controllers/member.controller';
import { CheckMemberUseCase } from './application/use-cases/check-member.use-case';
import { CreateBookUseCase } from './application/use-cases/create-book.use-case';
import { CreateMemberUseCase } from './application/use-cases/create-member.use-case';
import { PrismaModule } from './infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TransactionController, BookController, MemberController],
  providers: [
    CreateBookUseCase,
    BorrowBookUseCase,
    CreateMemberUseCase,
    CheckMemberUseCase,
    ReturnBookUseCase,
    CheckBookUseCase,
    {
      provide: 'IBookRepository',
      useClass: BookRepository,
    },
    {
      provide: 'IMemberRepository',
      useClass: MemberRepository,
    },
    {
      provide: 'ITransactionRepository',
      useClass: TransactionRepository,
    },
  ],
})
export class AppModule {}
