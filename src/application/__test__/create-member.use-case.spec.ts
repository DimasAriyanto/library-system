import { CreateMemberUseCase } from '../use-cases/create-member.use-case';
import { IMemberRepository } from '../interfaces/i-member.repository';
import { CreateMemberDto } from '../dtos/create-member.dto';
import { BadRequestException } from '@nestjs/common';

describe('CreateMemberUseCase', () => {
  let createMemberUseCase: CreateMemberUseCase;
  let mockMemberRepository: jest.Mocked<IMemberRepository>;

  beforeEach(() => {
    mockMemberRepository = {
      findAll: jest.fn(),
      findByCode: jest.fn(),
      createMember: jest.fn(),
      updatePenalty: jest.fn(),
    };

    createMemberUseCase = new CreateMemberUseCase(mockMemberRepository);
  });

  it('should create a new member successfully', async () => {
    const mockDto: CreateMemberDto = {
      code: 'M001',
      name: 'Angga',
    };

    mockMemberRepository.findByCode.mockResolvedValue(null);
    mockMemberRepository.createMember.mockResolvedValue();

    const result = await createMemberUseCase.execute(mockDto);

    expect(result).toBe('Member "Angga" has been successfully added.');
    expect(mockMemberRepository.findByCode).toHaveBeenCalledWith('M001');
    expect(mockMemberRepository.createMember).toHaveBeenCalledWith(mockDto);
  });

  it('should throw error if member with the same code already exists', async () => {
    const mockDto: CreateMemberDto = {
      code: 'M001',
      name: 'Angga',
    };

    mockMemberRepository.findByCode.mockResolvedValue({
      data: mockDto,
    } as any);

    await expect(createMemberUseCase.execute(mockDto)).rejects.toThrow(
      new BadRequestException(`Member with code "M001" already exists.`),
    );

    expect(mockMemberRepository.findByCode).toHaveBeenCalledWith('M001');
    expect(mockMemberRepository.createMember).not.toHaveBeenCalled();
  });
});
