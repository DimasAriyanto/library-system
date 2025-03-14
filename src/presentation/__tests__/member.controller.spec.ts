import { Test, TestingModule } from '@nestjs/testing';
import { MemberController } from '../controllers/member.controller';
import { CheckMemberUseCase } from '../../application/use-cases/check-member.use-case';
import { CreateMemberUseCase } from '../../application/use-cases/create-member.use-case';
import { CreateMemberDto } from '../../application/dtos/create-member.dto';

describe('MemberController', () => {
  let controller: MemberController;
  let mockCheckMemberUseCase: jest.Mocked<CheckMemberUseCase>;
  let mockCreateMemberUseCase: jest.Mocked<CreateMemberUseCase>;

  beforeEach(async () => {
    mockCheckMemberUseCase = {
      execute: jest.fn(),
    } as any;

    mockCreateMemberUseCase = {
      execute: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberController],
      providers: [
        { provide: CheckMemberUseCase, useValue: mockCheckMemberUseCase },
        { provide: CreateMemberUseCase, useValue: mockCreateMemberUseCase },
      ],
    }).compile();

    controller = module.get<MemberController>(MemberController);
  });

  it('should return list of members successfully', async () => {
    const mockMembers = [
      { code: 'M001', name: 'Angga', borrowedBooks: 1 },
      { code: 'M002', name: 'Ferry', borrowedBooks: 0 },
    ];

    mockCheckMemberUseCase.execute.mockResolvedValue(mockMembers);

    const result = await controller.getMembers();

    expect(result).toEqual({
      status: 'success',
      message: 'Daftar anggota berhasil dimuat.',
      data: mockMembers,
    });

    expect(mockCheckMemberUseCase.execute).toHaveBeenCalled();
  });

  it('should create a new member successfully', async () => {
    const mockDto: CreateMemberDto = {
      code: 'M001',
      name: 'Angga',
    };

    mockCreateMemberUseCase.execute.mockResolvedValue(
      `Member "${mockDto.name}" has been successfully added.`,
    );

    const result = await controller.addMember(mockDto);

    expect(result).toEqual({
      status: 'success',
      message: `Member "${mockDto.name}" has been successfully added.`,
    });

    expect(mockCreateMemberUseCase.execute).toHaveBeenCalledWith(mockDto);
  });

  it('should handle error if createMember fails', async () => {
    const mockDto: CreateMemberDto = {
      code: 'M001',
      name: 'Angga',
    };

    mockCreateMemberUseCase.execute.mockRejectedValue(
      new Error('Failed to create member'),
    );

    await expect(controller.addMember(mockDto)).rejects.toThrowError(
      'Failed to create member',
    );

    expect(mockCreateMemberUseCase.execute).toHaveBeenCalledWith(mockDto);
  });
});
