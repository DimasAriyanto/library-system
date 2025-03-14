import { Test, TestingModule } from '@nestjs/testing';
import { MemberController } from '../controllers/member.controller';
import { CheckMemberUseCase } from '../../application/use-cases/check-member.use-case';
import { CreateMemberUseCase } from '../../application/use-cases/create-member.use-case';

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

    expect(result).toEqual(mockMembers);
    expect(mockCheckMemberUseCase.execute).toHaveBeenCalled();
  });
});
