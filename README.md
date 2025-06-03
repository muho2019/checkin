# Mini SaaS 근태 관리 서비스 (Backend - NestJS)

직원들의 출근/퇴근을 기록하고, 근무 통계를 확인할 수 있는 **간단한 SaaS 형태의 근태 관리 서비스**입니다.  
NestJS + TypeORM + PostgreSQL 기반으로 구축되었으며, **역할 기반 권한 관리**, **JWT 인증**, **DTO 명세**, **보안 강화** 등의 실무 요소를 반영했습니다.

---

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
