import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { DataSource } from 'typeorm';

export class E2ETestHelper {
  static async createCompanyAndUser(
    app: INestApplication,
    role: 'EMPLOYEE' | 'MANAGER' = 'EMPLOYEE',
    companyName: string = `테스트 회사-${uuid().slice(0, 8)}`,
  ) {
    const email = `user-${uuid()}@test.com`;
    const password = 'test1234';

    // 회원가입
    await request(app.getHttpServer()).post('/auth/signup').send({
      email,
      password,
      name: 'E2E Tester',
      role,
      companyName,
    });

    // 로그인 후 access token 받기
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password });

    const accessToken = loginRes.body.accessToken;

    return {
      email,
      password,
      companyName,
      accessToken,
    };
  }

  static async deleteTestUserAndCompany(app: INestApplication, email: string) {
    const dataSource = app.get(DataSource);
    const userRepo = dataSource.getRepository('User');
    const companyRepo = dataSource.getRepository('Company');
    const attendanceRepo = dataSource.getRepository('AttendanceRecord');

    const user = await userRepo.findOne({
      where: { email },
      relations: ['company'],
    });

    if (user) {
      await attendanceRepo.delete({ user: { id: user.id } });
      await userRepo.delete({ id: user.id });
      await companyRepo.delete({ id: user.company.id });
    }
  }
}
