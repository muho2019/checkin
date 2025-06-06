import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { E2ETestHelper } from './utils/e2e-test.helper';

describe('근태 기능 (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let testEmail: string;

  const postWithToken = (url: string) =>
    request(app.getHttpServer())
      .post(url)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const result = await E2ETestHelper.createCompanyAndUser(app);
    accessToken = result.accessToken;
    testEmail = result.email;
  });

  afterAll(async () => {
    await E2ETestHelper.deleteTestUserAndCompany(app, testEmail);
    await app.close();
  });

  describe('출근/퇴근 정상 흐름', () => {
    it('출근 성공', async () => {
      const res = await postWithToken('/attendance/check-in');

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('checkIn');
      expect(res.body).toHaveProperty('checkOut');
      expect(res.body).toHaveProperty('date');
      expect(res.body).toHaveProperty('user');
      expect(res.body.checkOut).toBeNull();
    });

    it('퇴근 성공', async () => {
      const res = await postWithToken('/attendance/check-out');

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('checkIn');
      expect(res.body).toHaveProperty('checkOut');
      expect(res.body).toHaveProperty('date');
      expect(res.body).toHaveProperty('user');
      expect(res.body.checkOut).toBeDefined();
    });
  });

  describe('예외 처리', () => {
    it('출근 없이 퇴근 요청 시 에러', async () => {
      const result = await E2ETestHelper.createCompanyAndUser(app);
      const token = result.accessToken;

      const res = await request(app.getHttpServer())
        .post('/attendance/check-out')
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(res.status).toBe(400);
      expect(res.body.message).toBeDefined();

      await E2ETestHelper.deleteTestUserAndCompany(app, result.email);
    });

    it('중복 출근/퇴근 요청 시 에러', async () => {
      const checkInRes = await postWithToken('/attendance/check-in');
      expect(checkInRes.status).toBe(400);
      expect(checkInRes.body.message).toBeDefined();

      const checkOutRes = await postWithToken('/attendance/check-out');
      expect(checkOutRes.status).toBe(400);
      expect(checkOutRes.body.message).toBeDefined();
    });
  });
});
