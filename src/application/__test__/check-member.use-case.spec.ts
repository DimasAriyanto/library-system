import { CheckMemberUseCase } from '../use-cases/check-member.use-case';
import { IMemberRepository } from '../interfaces/i-member.repository';
import { MemberEntity } from '../../domain/entities/member.entity';
import { v4 as uuidv4 } from 'uuid';

describe('CheckMemberUseCase', () => {
  let checkMemberUseCase: CheckMemberUseCase;
  let mockMemberRepository: jest.Mocked<IMemberRepository>;

  beforeEach(() => {
    mockMemberRepository = {
      createMember: jest.fn(),
      findByCode: jest.fn(),
      updatePenalty: jest.fn(),
      findAll: jest.fn(),
    };

    checkMemberUseCase = new CheckMemberUseCase(mockMemberRepository);
  });

  it('should return list of members with correct borrowed books count', async () => {
    const mockMembers = [
      new MemberEntity({
        id: uuidv4(),
        code: 'M001',
        name: 'Angga',
        borrowedBooks: ['JK-45'],
        penaltyExpiry: null,
      }),
      new MemberEntity({
        id: uuidv4(),
        code: 'M002',
        name: 'Ferry',
        borrowedBooks: [],
        penaltyExpiry: null,
      }),
    ];

    mockMemberRepository.findAll.mockResolvedValue(mockMembers);

    const result = await checkMemberUseCase.execute();

    expect(result).toEqual([
      {
        code: 'M001',
        name: 'Angga',
        borrowedBooks: 1,
      },
      {
        code: 'M002',
        name: 'Ferry',
        borrowedBooks: 0,
      },
    ]);
  });

  it('should return an empty list if no members are available', async () => {
    mockMemberRepository.findAll.mockResolvedValue([]);

    const result = await checkMemberUseCase.execute();

    expect(result).toEqual([]);
  });
});
