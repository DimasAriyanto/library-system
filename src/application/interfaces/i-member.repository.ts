import { MemberEntity } from 'src/domain/entities/member.entity';
import { CreateMemberDto } from '../dtos/create-member.dto';

export interface IMemberRepository {
  createMember(dto: CreateMemberDto): Promise<void>;
  findAll(): Promise<MemberEntity[]>;
  findByCode(code: string): Promise<MemberEntity | null>;
  updatePenalty(memberCode: string, penaltyExpiry: Date): Promise<void>;
}
