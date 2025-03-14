import { Test, TestingModule } from '@nestjs/testing';
import { BookRepository } from '../repositories/book.repository';
import { PrismaService } from '../prisma/prisma.service';
import { BookEntity } from '../../domain/entities/book.entity';

describe('BookRepository (Integration Test)', () => {
  let bookRepository: BookRepository;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, BookRepository],
    }).compile();

    bookRepository = module.get<BookRepository>(BookRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await prismaService.cleanDatabase();

    await prismaService.book.createMany({
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
    });
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('should create a new book successfully', async () => {
    await bookRepository.createBook({
      code: 'NEW-01',
      title: 'New Book Title',
      author: 'New Author',
      stock: 10,
    });

    const createdBook = await prismaService.book.findUnique({
      where: { code: 'NEW-01' },
    });

    expect(createdBook).not.toBeNull();
    expect(createdBook?.title).toBe('New Book Title');
    expect(createdBook?.author).toBe('New Author');
    expect(createdBook?.stock).toBe(10);
  });

  it('should find book by code', async () => {
    const result = await bookRepository.findByCode('JK-45');

    expect(result).toBeInstanceOf(BookEntity);
    expect(result?.data.title).toBe('Harry Potter');
  });

  it('should return null if book code is not found', async () => {
    const result = await bookRepository.findByCode('INVALID-CODE');

    expect(result).toBeNull();
  });

  it('should update book stock successfully', async () => {
    await bookRepository.updateStock('JK-45', 5);

    const updatedBook = await prismaService.book.findUnique({
      where: { code: 'JK-45' },
    });

    expect(updatedBook?.stock).toBe(5);
  });

  it('should throw error when updating stock for non-existing book', async () => {
    await expect(
      bookRepository.updateStock('INVALID-CODE', 5),
    ).rejects.toThrowError();
  });

  it('should return all books', async () => {
    const result = await bookRepository.findAll();

    expect(result.length).toBe(2);
    expect(result[0].data.title).toBe('Harry Potter');
    expect(result[1].data.title).toBe('A Study in Scarlet');
  });
});
