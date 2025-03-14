import { Injectable, NotFoundException } from '@nestjs/common';
import { IMemberRepository } from '../../application/interfaces/i-member.repository';
import { MemberEntity } from '../../domain/entities/member.entity';
import { CreateMemberDto } from 'src/application/dtos/create-member.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MemberRepository implements IMemberRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createMember(dto: CreateMemberDto): Promise<void> {
    await this.prisma.member.create({
      data: {
        code: dto.code,
        name: dto.name,
      },
    });
  }

  async findAll(): Promise<MemberEntity[]> {
    const members = await this.prisma.member.findMany({
      include: { transactions: true },
    });

    return members.map((member) => {
      const borrowedBooks = member.transactions
        .filter((transaction) => !transaction.returnedAt)
        .map((transaction) => transaction.bookId);

      return new MemberEntity({
        id: member.id,
        code: member.code,
        name: member.name,
        borrowedBooks,
        penaltyExpiry: member.penaltyExpiry,
      });
    });
  }

  async findByCode(code: string): Promise<MemberEntity | null> {
    const member = await this.prisma.member.findUnique({
      where: { code },
      include: { transactions: true },
    });

    if (!member) return null;

    const borrowedBooks = member.transactions
      .filter((transaction) => !transaction.returnedAt)
      .map((transaction) => transaction.bookId);

    return new MemberEntity({
      id: member.id,
      code: member.code,
      name: member.name,
      borrowedBooks,
      penaltyExpiry: member.penaltyExpiry,
    });
  }

  async updatePenalty(memberCode: string, penaltyExpiry: Date): Promise<void> {
    const member = await this.prisma.member.findUnique({
      where: { code: memberCode },
    });

    if (!member) {
      throw new NotFoundException(`Member with code ${memberCode} not found.`);
    }

    await this.prisma.member.update({
      where: { code: memberCode },
      data: { penaltyExpiry },
    });
  }
}
