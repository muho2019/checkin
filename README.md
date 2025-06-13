# Mini SaaS 근태 관리 서비스

직원들의 출근/퇴근을 기록하고, 근무 통계를 확인할 수 있는 **간단한 SaaS 형태의 근태 관리 서비스**입니다.

NestJS + TypeORM + PostgreSQL 기반으로 구축된 백엔드는 역할 기반 인증, JWT 보안, DTO 기반 유효성 검사 등의 구성 요소를 반영하였고,
프론트엔드는 Next.js + Tailwind CSS + shadcn/ui 기반으로 설계되어 모던 UI/UX 환경에서의 SaaS 개발 경험을 제공합니다.

## 프로젝트 목적

이 프로젝트는 NestJS와 Next.js의 기본적인 사용법을 익히고, 타입 안정성과 SaaS 아키텍처 구조를 이해하기 위한 포트폴리오 프로젝트입니다.

## 🚀 주요 기능

### 인증 & 사용자 관리
- 회원가입 / 로그인 (JWT 기반)
- 회사 소속 개념 도입 (다중 테넌시 구조 기초)
- 역할(Role): `EMPLOYEE`, `MANAGER`
- 비밀번호 해싱 (`bcrypt`) 및 응답에서 자동 제거 (`@Exclude()`)

### 근태 기능
- 대시보드
  - 출근/퇴근 기록
    - 하루 1회만 가능
    - 본인만 기록 가능
  - 이번 주 근무시간, 이번 달 출근일, 평균 근무시간, 오늘의 출퇴근 기록, 최근 근태 기록 제공
- 근무 통계 조회 (예정)
  - 일간 / 주간 / 월간 단위
  - 차트/표 형태로 시각화
  - `MANAGER`: 같은 회사 직원 전체 통계 조회
  - `EMPLOYEE`: 본인 통계만 조회

---

## 기술 스택

| 영역          | 분야                | 기술                                     |
|-------------|-------------------|----------------------------------------|
| Backend     | Framework         | NestJS                                 |
|             | Database          | PostgreSQL                             |
|             | ORM               | TypeORM                                |
|             | 인증                | JWT (passport-jwt)                     |
|             | 환경변수 관리           | `@nestjs/config`                       |
|             | 암호화               | `bcrypt`                               |
|             | 데이터 검증            | `class-validator`, `class-transformer` |
| Frontend    | Framework         | Next.js 14                             |
|             | css framework     | Tailwind CSS 3                         |
|             | Component library | shadcn/ui                              |
|             | 상태 관리             | 예정                                     |
| Devops (예정) | Cloud             | AWS                                    |

---

## 프로젝트 구조

```
backend/
├── src/
│   ├── common/
│   │   ├── decorators/
│   │   ├── interfaces/
│   ├── modules/
│   │   ├── attendance/
│   │   ├── auth/
│   │   ├── companies/
│   │   ├── dashboard/
│   │   ├── users/
│   ├── main.ts
│   ├── app.module.ts
└── test/
frontend/
├── src/
│   ├── app/
│   │   ├── login/
│   │   ├── register/
│   ├── components/
│   │   ├── auth/
│   │   ├── common/
│   │   ├── dashboard/
│   │   ├── ui/
│   ├── contexts/
│   ├── lib/
│   └── types/
```

## 환경 설정

### 백엔드

루트에 .env 파일을 생성하여 다음 내용을 추가:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
DB_NAME=checkin_db
JWT_SECRET=your_jwt_secret
```

### 프론트엔드

루트에 .env 파일을 생성하여 다음 내용을 추가:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 실행 방법

```bash
# 백엔드
## 의존성 설치
npm install

## 개발 서버 실행
npm run start:dev

# 프론트엔드
## 의존성 설치
npm install

## 개발 서버 실행
npm run dev
```

## 향후 개선 예정

- [ ] 프론트엔드 (Next.js 기반 관리자 페이지) - 진행 중
- [ ] 출근 시간 유효성 검사를 통한 지각 / 조퇴 판단 및 기록 기능
- [ ] Swagger 기반 API 문서 자동화 (실시간 문서 제공)
- [ ] AWS 배포 (RDS, S3, EC2 등)

# 🧑‍💻 개발자

- 개발자: 므호 (muho)
- 블로그: [muho writes](https://www.muhowrites.dev/)

