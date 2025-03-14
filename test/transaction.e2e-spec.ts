import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('TransactionController (e2e)', () => {
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

  describe('/transaction/borrow (POST)', () => {
    it('should successfully borrow a book', async () => {
      const validBorrowDto = { memberCode: 'M001', bookCode: 'JK-45' };

      await request(app.getHttpServer())
        .post('/transaction/borrow')
        .send(validBorrowDto)
        .expect(201)
        .expect({
          status: 'success',
          message: 'Book "Harry Potter" successfully borrowed by Angga',
        });
    });

    it('should fail when DTO validation fails', async () => {
      const invalidBorrowDto = { memberCode: '', bookCode: '' };

      return request(app.getHttpServer())
        .post('/transaction/borrow')
        .send(invalidBorrowDto)
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          const errors = res.body.message;
          const hasMemberCodeError = errors.some(
            (error) =>
              typeof error === 'object' && error.field === 'memberCode',
          );
          expect(hasMemberCodeError).toBe(true);
        });
    });
  });

  describe('/transaction/return (POST)', () => {
    it('should successfully return a book', async () => {
      const validReturnDto = { memberCode: 'M001', bookCode: 'JK-45' };

      await request(app.getHttpServer())
        .post('/transaction/return')
        .send(validReturnDto)
        .expect(201)
        .expect({
          status: 'success',
          message: 'Book "Harry Potter" successfully returned.',
        });
    });

    it('should fail when DTO validation fails', async () => {
      const invalidReturnDto = { memberCode: '', bookCode: '' };

      return request(app.getHttpServer())
        .post('/transaction/return')
        .send(invalidReturnDto)
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          const errors = res.body.message;
          const hasMemberCodeError = errors.some(
            (error) =>
              typeof error === 'object' && error.field === 'memberCode',
          );
          expect(hasMemberCodeError).toBe(true);
        });
    });
  });
});
