import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { IMemberRepository } from '../interfaces/i-member.repository';
import { CreateMemberDto } from '../dtos/create-member.dto';

@Injectable()
export class CreateMemberUseCase {
  constructor(
    @Inject('IMemberRepository') private readonly memberRepo: IMemberRepository,
  ) {}

  async execute(dto: CreateMemberDto): Promise<string> {
    const existingMember = await this.memberRepo.findByCode(dto.code);
    if (existingMember) {
      throw new BadRequestException(
        `Member with code "${dto.code}" already exists.`,
      );
    }

    await this.memberRepo.createMember(dto);

    return `Member "${dto.name}" has been successfully added.`;
  }
}
