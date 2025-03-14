import { Injectable, Inject } from '@nestjs/common';
import { IMemberRepository } from '../interfaces/i-member.repository';

@Injectable()
export class CheckMemberUseCase {
  constructor(
    @Inject('IMemberRepository') private readonly memberRepo: IMemberRepository,
  ) {}

  async execute(): Promise<any[]> {
    const members = await this.memberRepo.findAll();

    return members.map((member) => ({
      code: member.data.code,
      name: member.data.name,
      borrowedBooks: member.data.borrowedBooks.length,
    }));
  }
}
