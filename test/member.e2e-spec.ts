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

  afterAll(async () => {
    await app.close();
  });

  describe('/members/add (POST)', () => {
    it('should successfully add a member', async () => {
      const validMemberDto = { code: 'M003', name: 'Putri' };

      await request(app.getHttpServer())
        .post('/members/add')
        .send(validMemberDto)
        .expect(201)
        .expect({
          status: 'success',
          message: 'Member "Putri" has been successfully added.',
        });
    });

    it('should fail when DTO validation fails', async () => {
      const invalidMemberDto = { code: '', name: '' };

      return request(app.getHttpServer())
        .post('/members/add')
        .send(invalidMemberDto)
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
