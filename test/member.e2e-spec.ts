import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('MemberController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('✅ should return a list of members', async () => {
    const response = await request(app.getHttpServer()).get('/members/check');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: expect.any(String),
          name: expect.any(String),
          borrowedBooks: expect.any(Number),
        }),
      ]),
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
