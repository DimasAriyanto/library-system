import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';

describe('TransactionController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should borrow a book successfully', async () => {
    const response = await request(app.getHttpServer())
      .post('/transaction/borrow')
      .send({ memberCode: 'M001', bookCode: 'JK-45' })
      .expect(201);

    expect(response.text).toContain('successfully borrowed');
  });

  it('should fail to borrow a book if data is invalid', async () => {
    const response = await request(app.getHttpServer())
      .post('/transaction/borrow')
      .send({ memberCode: '', bookCode: '' })
      .expect(400);

    expect(response.body.message).toContain('Invalid data provided');

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'memberCode',
          message: expect.any(String),
        }),
        expect.objectContaining({
          field: 'bookCode',
          message: expect.any(String),
        }),
        'Invalid data provided',
      ]),
    );
  });

  it('should return a book successfully', async () => {
    const response = await request(app.getHttpServer())
      .post('/transaction/return')
      .send({ memberCode: 'M001', bookCode: 'JK-45' })
      .expect(201);

    expect(response.text).toContain('successfully returned');
  });

  it('should fail to return a book if data is invalid', async () => {
    const response = await request(app.getHttpServer())
      .post('/transaction/return')
      .send({ memberCode: '', bookCode: '' })
      .expect(400);

    expect(response.body.message).toContain('Invalid data provided');

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'memberCode',
          message: expect.any(String),
        }),
        expect.objectContaining({
          field: 'bookCode',
          message: expect.any(String),
        }),
        'Invalid data provided',
      ]),
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
