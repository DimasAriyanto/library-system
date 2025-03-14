import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('BookController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/books/add (POST)', () => {
    it('should successfully add a book', async () => {
      const validBookDto = {
        code: 'NRN-7',
        title: 'The Lion, the Witch and the Wardrobe',
        author: 'C.S. Lewis',
        stock: 1,
      };

      await request(app.getHttpServer())
        .post('/books/add')
        .send(validBookDto)
        .expect(201)
        .expect({
          status: 'success',
          message:
            'Book "The Lion, the Witch and the Wardrobe" has been successfully added.',
        });
    });

    it('should fail when DTO validation fails', async () => {
      const invalidBookDto = {
        code: '',
        title: '',
        author: '',
        stock: undefined,
      };

      return request(app.getHttpServer())
        .post('/books/add')
        .send(invalidBookDto)
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          const errors = res.body.message;
          const hasCodeError = errors.some(
            (error) => typeof error === 'object' && error.field === 'code',
          );
          expect(hasCodeError).toBe(true);
        });
    });
  });
});
