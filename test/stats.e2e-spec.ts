import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { E2ETestHelper } from './utils/e2e-test.helper';
import { DataSource } from 'typeorm';

describe('근무 통계 조회 (e2e)', () => {
  let app: INestApplication;
  let employeeToken: string;
  let managerToken: string;
  let employeeEmail: string;
  let managerEmail: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const companyName = `테스트 회사-${Date.now()}`;
    // 직원 생성 및 출근/퇴근
    const empResult = await E2ETestHelper.createCompanyAndUser(
      app,
      'EMPLOYEE',
      companyName,
    );
    employeeToken = empResult.accessToken;
    employeeEmail = empResult.email;

    await request(app.getHttpServer())
      .post('/attendance/check-in')
      .set('Authorization', `Bearer ${employeeToken}`)
      .send();

    await request(app.getHttpServer())
      .post('/attendance/check-out')
      .set('Authorization', `Bearer ${employeeToken}`)
      .send();

    // 같은 회사의 관리자 생성
    const managerResult = await E2ETestHelper.createCompanyAndUser(
      app,
      'MANAGER',
      companyName,
    );
    managerToken = managerResult.accessToken;
    managerEmail = managerResult.email;
  });

  afterAll(async () => {
    await E2ETestHelper.deleteTestUserAndCompany(app, employeeEmail);
    await E2ETestHelper.deleteTestUserAndCompany(app, managerEmail);
    await app.close();
  });

  it('직원이 자신의 근무 통계 조회', async () => {
    const today = new Date().toISOString().split('T')[0];

    const res = await request(app.getHttpServer())
      .get(`/attendance/stats?type=DAILY&from=${today}&to=${today}`)
      .set('Authorization', `Bearer ${employeeToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0]).toHaveProperty('date');
    expect(res.body.data[0]).toHaveProperty('entries');
  });

  it('관리자가 회사 전체 직원의 근무 통계 조회', async () => {
    const today = new Date().toISOString().split('T')[0];

    const res = await request(app.getHttpServer())
      .get(`/attendance/stats?type=DAILY&from=${today}&to=${today}`)
      .set('Authorization', `Bearer ${managerToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0]).toHaveProperty('date');
    expect(res.body.data[0]).toHaveProperty('entries');
  });
});
