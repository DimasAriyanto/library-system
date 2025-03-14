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

  it('✅ should return a list of available books', async () => {
    const response = await request(app.getHttpServer()).get('/books/check');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: expect.any(String),
          title: expect.any(String),
          author: expect.any(String),
          availableStock: expect.any(Number),
        }),
      ]),
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
