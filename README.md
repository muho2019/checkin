# Mini SaaS 근태 관리 서비스 (Backend - NestJS)

직원들의 출근/퇴근을 기록하고, 근무 통계를 확인할 수 있는 **간단한 SaaS 형태의 근태 관리 서비스**입니다.  
NestJS + TypeORM + PostgreSQL 기반으로 구축되었으며, **역할 기반 권한 관리**, **JWT 인증**, **DTO 명세**, **보안 강화** 등의 실무 요소를 반영했습니다.

## 프로젝트 목적

이 프로젝트는 NestJS의 기본적인 사용법을 익히고, 타입 안정성과 SaaS 아키텍처 구조를 이해하기 위한 포트폴리오 프로젝트입니다.

## 🚀 주요 기능

### 인증 & 사용자 관리
- 회원가입 / 로그인 (JWT 기반)
- 회사 소속 개념 도입 (다중 테넌시 구조 기초)
- 역할(Role): `EMPLOYEE`, `MANAGER`
- 비밀번호 해싱 (`bcrypt`) 및 응답에서 자동 제거 (`@Exclude()`)

### 근태 기능
- 출근 / 퇴근 기록
    - 하루 1회만 가능
    - 본인만 기록 가능
- 근무 통계 조회
    - 일간 / 주간 / 월간 단위
    - `MANAGER`: 같은 회사 직원 전체 통계 조회
    - `EMPLOYEE`: 본인 통계만 조회

---

## 기술 스택

| 분야 | 기술 |
|------|------|
| Backend | NestJS |
| Database | PostgreSQL |
| ORM | TypeORM |
| 인증 | JWT (passport-jwt) |
| 환경변수 관리 | `@nestjs/config` |
| 암호화 | `bcrypt` |
| 데이터 검증 | `class-validator`, `class-transformer` |

---

## 프로젝트 구조

```
src/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── companies/
│   └── attendance/
├── common/
│   ├── decorators/
│   └── interfaces/
├── migrations/
├── main.ts
└── app.module.ts
```

## API 테스트 방법 (Postman)

1. POST /auth/signup - 회원가입
2. POST /auth/login - 로그인 후 accessToken 획득
3. 이후 요청에 Authorization: Bearer <accessToken> 헤더 추가
4. 테스트 가능한 주요 API:

|메서드|	경로	설명|
|------|------------------|
|POST|	/attendance/check-in|	출근 기록|
|POST|	/attendance/check-out|	퇴근 기록|
|GET|	/attendance/stats?type=daily&from=2025-06-01&to=2025-06-30|	통계 조회|

## 환경 설정

루트에 .env 파일을 생성하여 다음 내용을 추가:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
DB_NAME=checkin_db
JWT_SECRET=your_jwt_secret
```

## 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run start:dev
```

## 향후 개선 예정

- 관리자 기능: 직원 근무 기록 열람 및 수정
- 지각 / 조퇴 / 휴가 기록
- 프론트엔드 (Next.js 기반 관리자 페이지)
- Swagger 문서 자동 생성

# 🧑‍💻 개발자

- 개발자: 므호 (muho)
- 블로그: [muho writes](https://www.muhowrites.dev/)

