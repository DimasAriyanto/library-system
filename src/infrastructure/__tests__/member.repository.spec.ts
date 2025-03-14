import { Test, TestingModule } from '@nestjs/testing';
import { MemberRepository } from '../repositories/member.repository';
import { PrismaService } from '../prisma/prisma.service';
import { MemberEntity } from '../../domain/entities/member.entity';

describe('MemberRepository (Integration Test)', () => {
  let memberRepository: MemberRepository;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, MemberRepository],
    }).compile();

    memberRepository = module.get<MemberRepository>(MemberRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await prismaService.cleanDatabase();

    await prismaService.$transaction([
      prismaService.member.createMany({
        data: [
          {
            id: '550e8400-e29b-41d4-a716-446655440000',
            code: 'M001',
            name: 'Angga',
            penaltyExpiry: null,
          },
          {
            id: '550e8400-e29b-41d4-a716-446655440001',
            code: 'M002',
            name: 'Ferry',
            penaltyExpiry: null,
          },
        ],
      }),
      prismaService.book.createMany({
        data: [
          {
            id: '550e8400-e29b-41d4-a716-446655440002',
            code: 'JK-45',
            title: 'Harry Potter',
            author: 'J.K Rowling',
            stock: 3,
          },
          {
            id: '550e8400-e29b-41d4-a716-446655440003',
            code: 'SHR-1',
            title: 'A Study in Scarlet',
            author: 'Arthur Conan Doyle',
            stock: 2,
          },
        ],
      }),
    ]);
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('should create a new member successfully', async () => {
    await memberRepository.createMember({
      code: 'M003',
      name: 'Budi',
    });

    const createdMember = await prismaService.member.findUnique({
      where: { code: 'M003' },
    });

    expect(createdMember).not.toBeNull();
    expect(createdMember?.name).toBe('Budi');
  });

  it('should find member by code', async () => {
    const result = await memberRepository.findByCode('M001');

    expect(result).toBeInstanceOf(MemberEntity);
    expect(result?.data.name).toBe('Angga');
  });

  it('should return null if member code is not found', async () => {
    const result = await memberRepository.findByCode('INVALID-CODE');

    expect(result).toBeNull();
  });

  it('should update member penalty expiry successfully', async () => {
    const penaltyDate = new Date();
    penaltyDate.setDate(penaltyDate.getDate() + 3);

    await memberRepository.updatePenalty('M001', penaltyDate);

    const updatedMember = await prismaService.member.findUnique({
      where: { code: 'M001' },
    });

    expect(updatedMember?.penaltyExpiry?.toISOString()).toEqual(
      penaltyDate.toISOString(),
    );
  });

  it('should throw error when updating penalty for non-existing member', async () => {
    const penaltyDate = new Date();
    penaltyDate.setDate(penaltyDate.getDate() + 3);

    await expect(
      memberRepository.updatePenalty('INVALID-CODE', penaltyDate),
    ).rejects.toThrowError();
  });

  it('should return all members', async () => {
    const result = await memberRepository.findAll();

    expect(result.length).toBe(2);
    expect(result[0].data.name).toBe('Angga');
    expect(result[1].data.name).toBe('Ferry');
  });
});
