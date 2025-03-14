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

  it('✅ should borrow a book successfully', async () => {
    const borrowDto = {
      memberCode: 'M001',
      bookCode: 'JK-45',
    };

    const response = await request(app.getHttpServer())
      .post('/transaction/borrow')
      .send(borrowDto);

    expect(response.status).toBe(201);
    expect(response.text).toContain('successfully borrowed');
  });

  it('❌ should fail to borrow a book if data is invalid', async () => {
    const borrowDto = {
      memberCode: '',
      bookCode: '',
    };

    const response = await request(app.getHttpServer())
      .post('/transaction/borrow')
      .send(borrowDto);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Invalid data provided');
  });

  it('✅ should return a book successfully', async () => {
    const returnDto = {
      memberCode: 'M001',
      bookCode: 'JK-45',
    };

    const response = await request(app.getHttpServer())
      .post('/transaction/return')
      .send(returnDto);

    expect(response.status).toBe(201);
    expect(response.text).toContain('successfully returned');
  });

  it('❌ should fail to return a book if data is invalid', async () => {
    const returnDto = {
      memberCode: '',
      bookCode: '',
    };

    const response = await request(app.getHttpServer())
      .post('/transaction/return')
      .send(returnDto);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Invalid data provided');
  });

  afterAll(async () => {
    await app.close();
  });
});
