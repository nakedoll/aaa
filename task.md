# Task List — 한국콘텐츠기업협회 회원관리 시스템

> 소통용 체크리스트 (상단) → 세션 인계용 상세 명세 (하단)
>
> **기준 문서**: `prd.md`는 최종 제품 범위, `task.md`는 MVP 구현 범위입니다. 두 문서가 충돌하는 경우 MVP 단계에서는 `task.md`를 우선합니다.
> `시나리오.md`와 `시나리오완료.md`는 macOS 전용 초안으로 현재 PRD와 충돌하므로 참고용으로만 사용하세요.

---

## ▣ Phase & Task 체크리스트

### Phase 1 — 프로젝트 초기 세팅
- [ ] 1-1. Electron 프로젝트 스캐폴딩 (electron-builder 포함)
- [ ] 1-2. 폴더 구조 및 파일 규칙 확정
- [ ] 1-3. 보안 설정 적용 (nodeIntegration: false, contextIsolation: true)
- [ ] 1-4. 개발 환경 스크립트 정비 (dev / build / package)

### Phase 2 — 데이터베이스 설계 및 초기화
- [ ] 2-1. SQLite 연동 (`better-sqlite3`)
- [ ] 2-2. members 테이블 생성
- [ ] 2-3. dues 테이블 생성
- [ ] 2-4. dues_settings 테이블 생성
- [ ] 2-5. DB 초기화 모듈 작성 (앱 최초 실행 시 자동 생성)

### Phase 3 — 메인 프로세스 & IPC 아키텍처
- [ ] 3-1. IPC 채널 목록 설계 및 문서화
- [ ] 3-2. preload.js 작성 (contextBridge로 안전한 API 노출)
- [ ] 3-3. 회원 CRUD IPC 핸들러 구현
- [ ] 3-4. 회비 조회·등록·수정 IPC 핸들러 구현
- [ ] 3-5. 설정(dues_settings) IPC 핸들러 구현
- [ ] 3-6. IPC 입력값 유효성 검사 및 에러 표준화

### Phase 4 — 공통 UI 컴포넌트
- [ ] 4-1. 레이아웃 (사이드바 + 탑바 + 콘텐츠 영역) 구현
- [ ] 4-2. 공통 컴포넌트: 버튼, 뱃지, 입력 필드, 모달, 알림 토스트
- [ ] 4-3. 라우팅 (화면 전환) 모듈 구현
- [ ] 4-4. Empty State, 로딩, 에러 화면 구현

### Phase 5 — 대시보드
- [ ] 5-1. 통계 카드 (총 회원 수 / 납부 완료 / 미납 / 기준 회비)
- ~~5-2. 기간별 회원 가입 현황 차트~~ → 후속 버전
- ~~5-3. 연도별 수금 추이 차트~~ → 후속 버전
- ~~5-4. 최근 납부 현황 테이블~~ → 회원 목록 필터로 대체
- ~~5-5. 미납 회원 현황 테이블~~ → 회원 목록 필터로 대체
- ~~5-6. 카드 클릭 → 회원 목록 필터 연동~~ → 후속 버전

### Phase 6 — 회원 목록
- [ ] 6-1. 테이블 렌더링 (회사명 가나다순 기본 정렬)
- [ ] 6-2. 회사명 검색 (부분 일치)
- [ ] 6-3. 가입 연도 필터
- [ ] 6-4. 납부 상태 필터
- [ ] 6-5. 회원 상태 필터 (현재 회원만 / 전체 / 탈퇴 회원만) 3-way select
- ~~페이지네이션~~ → 100명 이내, 전체 표시로 충분 (후속 버전)
- [ ] 6-6. 행 클릭 → 회원 상세 이동

### Phase 7 — 회원 추가 / 수정
- [ ] 7-1. 회원 추가 폼 (필수 / 선택 항목 구분)
- [ ] 7-2. 유효성 검사 (회사명 공백, 이메일 형식, 연락처 형식)
- [ ] 7-3. 저장 / 취소 동작
- [ ] 7-4. 회원 수정 폼 (기존 데이터 불러오기)
- [ ] 7-5. 수정 중 화면 이탈 경고

### Phase 8 — 회원 상세
- [ ] 8-1. 기업 정보 조회 화면
- [ ] 8-2. 연도별 회비 납부 이력 목록 (각 행 수정 버튼 포함)
- [ ] 8-3. 납부 등록 모달 (연도, 금액, 납부일 입력 / 기준 회비 자동 불러오기)
- [ ] 8-4. 납부 수정 모달 (이력 행 수정 버튼 → 기존 값 불러오기)
- [ ] 8-5. 탈퇴 처리 버튼 + 확인 팝업 (status → withdrawn 변경)
- [ ] 8-6. 수정 버튼 → Phase 7 수정 폼 연동

### Phase 9 — 설정
- [ ] 9-1. 연도별 기준 회비 목록 조회 / 수정 / 추가
- [ ] 9-2. 자동 백업 (앱 실행 시, 최근 5개 보관, db.backup() API 사용)
- ~~백업 파일 목록 조회~~ → 후속 버전
- ~~선택한 백업으로 복원~~ → 후속 버전 (탐색기/Finder로 직접 복사 안내)
- [ ] 9-3. DB 저장 경로: Electron userData/db/, 백업 경로: userData/backups/

### Phase 10 — 빌드 & 배포
- [ ] 10-1. electron-builder 설정 (Windows NSIS .exe + macOS DMG, electron.vite.config.js 기준)
- [ ] 10-2. 앱 아이콘 제작 및 적용 (Windows: .ico, macOS: .icns)
- [ ] 10-3. Windows x64 EXE 빌드 및 설치 테스트
- [ ] 10-4. macOS 유니버설 DMG 빌드 및 설치 테스트 (arch: universal)
- ~~Apple Developer ID 서명 및 공증~~ → 후속 버전 (선택사항)
- [ ] 10-5. 릴리즈 체크리스트 검토

---
---

## ▣ 세션 인계용 상세 명세

---

### Phase 1 — 프로젝트 초기 세팅

**목표**: 개발 가능한 Electron 프로젝트 뼈대 완성

**기술 선택**
- Electron 최신 안정 버전
- 번들러: Vite + `electron-vite` (빠른 HMR, ESM 지원)
- UI: 순수 HTML/CSS/JS (React 도입은 복잡도 대비 이점이 낮으므로 제외)
- 빌드/패키징: `electron-builder`

**폴더 구조 (예시)**
```
project-root/
├── src/
│   ├── main/          # 메인 프로세스 (main.js, ipcHandlers/, db/)
│   ├── preload/       # preload.js
│   └── renderer/      # HTML, CSS, JS (화면)
│       ├── index.html
│       ├── assets/
│       └── pages/     # dashboard.js, members.js, ...
├── electron-builder.yml
├── electron.vite.config.js   # electron-vite 번들러 설정 (vite.config.js 아님)
└── package.json
```

**보안 설정 (1-3)**
```js
new BrowserWindow({
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    sandbox: true,
    preload: path.join(__dirname, 'preload.js'),
  }
})
```

**주의**: `sandbox: true`로 설정하면 preload에서 `fs`, `path` 등 Node.js 내장 모듈은 사용 불가. `require('electron')`(contextBridge, ipcRenderer)는 사용 가능. 렌더러에 기능을 노출할 때는 반드시 `contextBridge.exposeInMainWorld()`를 통해서만 한다.

---

### Phase 2 — 데이터베이스 설계 및 초기화

**목표**: 앱 최초 실행 시 SQLite DB와 3개 테이블 자동 생성

**라이브러리**: `better-sqlite3` (동기 API, Electron과 호환성 우수)

**DB 저장 경로**
```js
const { app } = require('electron');
const dbPath = path.join(app.getPath('userData'), 'db', 'members.db');
```
- macOS: `~/Library/Application Support/[앱이름]/db/members.db`
- Windows: `C:\Users\[사용자]\AppData\Roaming\[앱이름]\db\members.db`
- `app.getPath('userData')` 사용 시 플랫폼별 경로 자동 처리됨

**DDL — members**
```sql
CREATE TABLE IF NOT EXISTS members (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  company_name  TEXT    NOT NULL CHECK(length(trim(company_name)) > 0),
  ceo_name      TEXT    NOT NULL CHECK(length(trim(ceo_name)) > 0),
  contact_name  TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  joined_at     DATE    NOT NULL,
  status        TEXT    NOT NULL DEFAULT 'active'
                        CHECK(status IN ('active', 'dormant', 'withdrawn')),
  memo          TEXT,
  created_at    DATETIME NOT NULL DEFAULT (datetime('now','localtime')),
  updated_at    DATETIME NOT NULL DEFAULT (datetime('now','localtime'))
);
```

**DDL — dues**
```sql
-- dues에는 실제 납부 완료 건만 저장한다.
-- 레코드 있음 = 납부완료 / 해당 연도 기준 회비 있는데 레코드 없음 = 미납
-- dues.status 컬럼 없음 (레코드 존재 여부로 판단)
CREATE TABLE IF NOT EXISTS dues (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id  INTEGER NOT NULL REFERENCES members(id),
  year       INTEGER NOT NULL CHECK(year >= 2000 AND year <= 2100),
  amount     INTEGER NOT NULL CHECK(amount > 0),
  paid_at    DATE    NOT NULL,   -- 납부 레코드라면 반드시 존재
  created_at DATETIME NOT NULL DEFAULT (datetime('now','localtime')),
  updated_at DATETIME NOT NULL DEFAULT (datetime('now','localtime')),
  UNIQUE(member_id, year)
);
```

**DDL — dues_settings**
```sql
CREATE TABLE IF NOT EXISTS dues_settings (
  year        INTEGER PRIMARY KEY CHECK(year >= 2000 AND year <= 2100),
  base_amount INTEGER NOT NULL CHECK(base_amount > 0),
  created_at  DATETIME NOT NULL DEFAULT (datetime('now','localtime')),
  updated_at  DATETIME NOT NULL DEFAULT (datetime('now','localtime'))
);
```

**초기화 모듈 (`src/main/db/init.js`)**
- 앱 시작 시 `initDB()` 호출
- DB 파일이 없으면 파일 생성 → 테이블 생성 순으로 실행
- `PRAGMA foreign_keys = ON;` — better-sqlite3는 연결마다 초기화되므로 DB 연결 직후 매번 실행해야 함 (앱 시작 시 한 번만으로는 부족)

**`updated_at` 갱신 주의**
- SQLite `DEFAULT (datetime('now','localtime'))`는 INSERT 시에만 적용됨
- UPDATE 쿼리에서는 반드시 직접 명시해야 함:
  ```sql
  UPDATE members SET company_name = ?, updated_at = datetime('now','localtime') WHERE id = ?
  ```

---

### Phase 3 — 메인 프로세스 & IPC 아키텍처

**목표**: 렌더러가 DB에 직접 접근하지 않고 IPC를 통해서만 데이터를 주고받는 구조 확립

**IPC 채널 목록**

| 채널명 | 방향 | 설명 |
|---|---|---|
| `members:list` | invoke | 전체 회원 조회 + 현재 연도 납부 상태 JOIN 반환 (필터는 클라이언트에서 처리) |
| `members:get` | invoke | 단일 회원 조회 |
| `members:create` | invoke | 회원 추가 |
| `members:update` | invoke | 회원 수정 |
| `members:withdraw` | invoke | 탈퇴 처리 (status → withdrawn) |
| `dues:list` | invoke | 특정 회원의 회비 이력 조회 |
| `dues:create` | invoke | 납부 등록 |
| `dues:update` | invoke | 납부 정보 수정 (오입력 정정용) |
| `dues_settings:list` | invoke | 연도별 기준 회비 목록 |
| `dues_settings:upsert` | invoke | 연도별 기준 회비 등록/수정 |
| `stats:dashboard` | invoke | 대시보드 통계 집계 (숫자 카드 4종) |

**preload.js 구조**
```js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  members: {
    list:     ()         => ipcRenderer.invoke('members:list'),
    get:      (id)       => ipcRenderer.invoke('members:get', id),
    create:   (data)     => ipcRenderer.invoke('members:create', data),
    update:   (id, data) => ipcRenderer.invoke('members:update', id, data),
    withdraw: (id)       => ipcRenderer.invoke('members:withdraw', id),
  },
  dues: {
    list:   (memberId) => ipcRenderer.invoke('dues:list', memberId),
    create: (data)     => ipcRenderer.invoke('dues:create', data),
    update: (id, data) => ipcRenderer.invoke('dues:update', id, data),
  },
  duesSettings: {
    list:   ()     => ipcRenderer.invoke('dues_settings:list'),
    upsert: (data) => ipcRenderer.invoke('dues_settings:upsert', data),
  },
  stats: {
    dashboard: () => ipcRenderer.invoke('stats:dashboard'),
  },
  // backup IPC 채널 없음 — 자동 백업은 메인 프로세스 내부에서만 실행
});
```

**에러 처리 원칙**
- 모든 IPC 핸들러는 `try/catch`로 감싸고 다음 형태로 반환:
  - 성공: `{ ok: true, data: <반환값> }`
  - 실패: `{ ok: false, error: '메시지' }`
- 렌더러에서는 `result.ok` 여부로 분기 처리

**핸들러 서버 측 입력 제한**
- `members:create` / `members:update`: `data.status === 'withdrawn'`이면 즉시 `{ ok: false, error: 'withdrawn은 members:withdraw 채널을 통해서만 처리할 수 있습니다.' }` 반환 (UI 우회 방지)
- `members:update`: 기존 회원 상태가 `withdrawn`이면 거부 — `SELECT status FROM members WHERE id = ?` 조회 후 `{ ok: false, error: '탈퇴 회원은 수정할 수 없습니다.' }` 반환 (탈퇴 후 재활성화 MVP 미지원)
- `dues:create` / `dues:update`: 해당 `member_id`의 상태가 `withdrawn`이면 거부 — `{ ok: false, error: '탈퇴 회원의 회비는 변경할 수 없습니다.' }` 반환
- `members:withdraw`: 이미 `withdrawn` 상태인 경우 오류 없이 `{ ok: true, data: null }` 반환 (멱등 처리)
- `dues:update`: `{ amount, paid_at }`만 허용. `year`, `member_id` 등 다른 필드는 핸들러에서 무시하고 해당 컬럼은 UPDATE 쿼리에 포함하지 않음

---

### Phase 4 — 공통 UI 컴포넌트

**목표**: 전체 앱에서 재사용할 레이아웃과 컴포넌트 구현

**레이아웃 구조**
- 사이드바(좌, 고정 228px) + 메인(우, flex)
- 메인: 탑바(고정 54px) + 콘텐츠 영역(스크롤)
- 화면 전환은 SPA 방식: `.page` 클래스 show/hide (리로드 없음)

**필수 컴포넌트**
- `modal(title, content, onConfirm)` — 확인 팝업 (탈퇴 등)
- `toast(message, type)` — 저장 성공 / 오류 알림 (우하단, 3초 후 자동 소멸)
- `badge(status)` — active(초록) / dormant(황색) / withdrawn(회색) / paid(초록) / unpaid(빨강)
- `emptyState(message)` — 데이터 없을 때 안내 화면

**라우팅 모듈 (`renderer/router.js`)**
```js
function navigate(pageId, params = {}) {
  // 현재 페이지가 수정 중이면 이탈 경고
  if (isDirty && !confirm('저장하지 않은 내용이 있습니다. 이동하시겠습니까?')) return;
  // 페이지 전환
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + pageId).classList.add('active');
  // 해당 페이지 init 함수 호출
  pageInits[pageId]?.(params);
}
```

---

### Phase 5 — 대시보드

**목표**: 앱 실행 직후 핵심 현황을 한눈에 파악할 수 있는 메인 화면

**MVP 범위**: stat 카드 4종만 구현. 차트·하단 테이블·카드 클릭 연동은 후속 버전.

**데이터 의존성**
- `stats:dashboard` IPC → 다음 값만 반환:
  - `totalMembers`, `activeMembers`, `dormantMembers`, `withdrawnMembers`
  - `paidCount`, `unpaidCount`, `paidRate`
  - `baseAmount` (현재 연도 기준 회비)

**납부 통계 계산 (현재 연도 기준)**
- 대상 = `status IN ('active', 'dormant')` 회원 (`withdrawn` 제외)
- 해당 연도 `dues_settings` 레코드 없음 → `paidCount`, `unpaidCount`, `paidRate` = `null` (카드에 "미설정" 표시)
- 기준 회비 있을 때:
  - `paidCount` = 대상 회원 중 현재 연도 `dues` 레코드가 존재하는 수
  - `unpaidCount` = 대상 회원 수 − `paidCount`
  - `paidRate` = `ROUND(paidCount * 100.0 / 대상 회원 수)` (대상 회원이 0명이면 `null`)

**stat 카드 구성**:

| 카드 | 값 | 클릭 |
|---|---|---|
| 전체 회원 | `totalMembers` (활동 N · 휴면 N · 탈퇴 N) | 없음 (후속 버전) |
| 납부 완료 | `paidCount` (납부율 N%) | 없음 (후속 버전) |
| 미납 | `unpaidCount` | 없음 (후속 버전) |
| 기준 회비 | `baseAmount` (원) | 없음 |

카드 진입 애니메이션(`fadeUp`) → 후속 버전

---

### Phase 6 — 회원 목록

**목표**: 검색·필터·정렬이 동작하는 회원 테이블

**IPC**: `members:list()` — 필터 없이 전체 조회, 현재 연도 납부 상태 포함 JOIN 반환
- 클라이언트에서 필터링 (100명 이내, 전체 로드 후 JS로 처리)
- IPC가 반환하는 각 행: `{ ...member, currentYearDuesStatus: 'paid' | 'unpaid' | 'not_configured' }`
  - 우선순위 (SQL CASE 구현 기준):
    1. `dues` 레코드 있음 → `'paid'` (기준 회비 설정 여부 무관)
    2. `dues` 레코드 없음 + `dues_settings` 있음 → `'unpaid'`
    3. `dues` 레코드 없음 + `dues_settings` 없음 → `'not_configured'`

**클라이언트 필터 파라미터**:
- `search`: 회사명 부분 일치
- `joinYear`: 가입 연도
- `duesStatus`: `'all'` | `'paid'` | `'unpaid'` | `'not_configured'`
- `memberStatus`: `'current'`(기본, 활동+휴면) | `'all'`(전체) | `'withdrawn'`(탈퇴만)

> ⚠️ `memberStatus` 기본값 `'current'` = **활동 + 휴면** (탈퇴만 제외). 목업에서 "활동 회원만" 선택 시 휴면 회원도 표시되는 것으로 확인됨. UI 레이블은 "현재 회원만"으로 표시.

**렌더링 원칙**
- 기본 정렬: 클라이언트에서 `localeCompare('ko-KR')` 사용 (SQLite `ASC`는 유니코드 바이트 순서라 한글 정렬이 localeCompare와 미세하게 다를 수 있음). `(주)`, `㈜` 등 접두어 무시 정렬은 후속 버전에서 처리.
- 페이지네이션 없음 — 전체 표시 (후속 버전에서 추가)

**표시 컬럼**: 회사명 / 대표자 / 담당자 / 연락처 / 가입일 / 회원 상태 / 현재 연도 납부 상태

> ⚠️ **탈퇴 회원의 납부 상태 표시**: 행 데이터 기준 `member.status === 'withdrawn'`인 행은 납부 상태 컬럼을 `'-'`로 표시한다 (필터 파라미터 `memberStatus` 값과 무관). `currentYearDuesStatus` 값과 무관하게 UI에서만 처리하며, IPC 반환 구조는 변경하지 않는다.

---

### Phase 7 — 회원 추가 / 수정

**목표**: 유효성 검사가 포함된 입력 폼

**필수 항목**: 회사명, 대표자 이름, 가입일, 회원 상태  
**선택 항목**: 담당자 이름, 담당자 연락처, 담당자 이메일, 메모

**회원 상태 선택 제한**
- 추가/수정 폼의 상태 select에는 `active`(활동), `dormant`(휴면)만 표시
- `withdrawn`(탈퇴)는 선택 불가 — 탈퇴는 회원 상세의 "탈퇴 처리" 버튼(`members:withdraw`)으로만 처리
- 탈퇴 후 재활성화는 MVP 미지원 (후속 버전에서 `members:update`로 구현)

**유효성 검사 규칙**
| 항목 | 규칙 |
|---|---|
| 회사명 | `value.trim().length > 0` (공백 문자만 있는 경우 포함 차단), 최대 100자 |
| 대표자 이름 | `value.trim().length > 0` (공백 문자만 있는 경우 포함 차단) |
| 가입일 | 필수. 미래 날짜 불허 (`joined_at <= 오늘`) |
| 담당자 연락처 | 공란이면 건너뜀. 값이 있을 때만 `/^[0-9]{2,4}-[0-9]{3,4}-[0-9]{4}$/` 검사 |
| 담당자 이메일 | 이메일 형식 검사 (입력 시에만, 공란 허용) |

**이탈 경고**: `isDirty` 플래그 관리 — 폼 변경 시 true, 저장/취소 시 false

**수정 모드**: 회원 상세(`member-detail`) 화면에서 "수정" 버튼 클릭 → 동일 화면의 필드를 편집 가능 상태로 전환 (별도 페이지 없음). 기존 데이터는 `members:get(id)`로 불러온 후 폼에 채움.
- 화면 목록에 `member-edit` 페이지는 존재하지 않음 — 상세 화면 내 인라인 편집 방식으로 구현

---

### Phase 8 — 회원 상세

**목표**: 단일 회원의 모든 정보 + 회비 이력을 한 화면에서 관리

**데이터 로딩 순서**
1. `members:get(id)` → 기업 정보 렌더링
2. `dues:list(memberId)` → 연도별 이력 렌더링 (최신 연도 역순)

**납부 등록 모달 동작**
1. 연도 선택 (기본값: 현재 연도)
2. 선택 연도의 `dues_settings`에서 기준 금액 자동 불러오기. 기준 회비 미설정 연도면 금액란 비워두고 수동 입력 허용 (등록 자체는 허용)
3. 금액 수동 수정 가능
4. 납부일 입력
5. `dues:create` 호출 → 성공 시 이력 목록 새로고침

**납부 수정 모달 동작**
1. 이력 목록 각 행의 수정 버튼 클릭
2. 기존 연도·금액·납부일 값 모달에 불러오기
3. 연도는 변경 불가 (UNIQUE 제약상 혼란 방지) — 금액·납부일만 수정 가능
4. `dues:update(id, { amount, paid_at })` 호출 → 성공 시 이력 목록 새로고침

**탈퇴 처리 동작**
1. "탈퇴 처리" 버튼 클릭
2. 확인 모달: "탈퇴 처리하시겠습니까? 데이터는 보존됩니다."
3. 확인 시 `members:withdraw(id)` 호출
4. 성공 시 회원 목록으로 이동

**탈퇴 회원 상세 화면 처리**
- `member.status === 'withdrawn'`인 경우 "수정" 버튼, "탈퇴 처리" 버튼 숨김
- 기업 정보와 회비 이력은 읽기 전용으로 표시 (납부 등록·수정 버튼도 숨김)

---

### Phase 9 — 설정

**목표**: 기준 회비 관리 + 자동 백업 (복원 UI는 후속 버전, 긴급 시 탐색기/Finder로 직접 파일 교체 안내)

**기준 회비 설정**
- `dues_settings:list()` → 연도별 목록 표시
- 각 행 저장 버튼 → `dues_settings:upsert({ year, base_amount })`
- 연도 추가: 입력 필드에 연도 입력 후 저장

**자동 백업 (앱 시작 시 자동 실행)**
```js
// main.js — initDB() 완료 후 호출 (DB 파일이 존재함을 보장)
async function autoBackup(db) {
  try {
    const dir = path.join(app.getPath('userData'), 'backups');
    await fs.mkdir(dir, { recursive: true });

    // PRD 형식: backup_YYYY-MM-DD_HH-MM-SS.db (현지 시간)
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const stamp = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`
                + `_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
    const dest = path.join(dir, `backup_${stamp}.db`);

    // db.backup()으로 연결이 열린 상태에서 안전한 온라인 백업
    await db.backup(dest);

    // 백업 파일만 대상으로 오래된 것 제거 (최근 5개 유지)
    const files = (await fs.readdir(dir))
      .filter(f => /^backup_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.db$/.test(f))
      .sort();
    while (files.length > 5) {
      await fs.unlink(path.join(dir, files.shift()));
    }
  } catch (err) {
    // 백업 실패는 앱 실행을 중단하지 않음 — 로그만 기록
    console.error('[autoBackup] 백업 실패:', err);
  }
}
```

**주의사항**:
- `db.backup()` — better-sqlite3 내장 API, WAL 모드에서도 일관된 스냅샷 보장
- DB 초기화(`initDB()`) 완료 후 호출해야 원본 파일 없음 에러 방지
- 백업 실패 시 앱 실행은 계속됨 — `try/catch`로 감싸고 콘솔 로그만 기록
- 복원 UI 없음 → 긴급 복원 필요 시:
  1. **앱 완전 종료** (트레이 포함)
  2. `db/` 폴더의 파일을 각각 이름 변경 (삭제하지 말 것 — 복원 실패 시 되돌릴 수 있어야 함):
     - `members.db` → `members.db.bak`
     - `members.db-wal` → `members.db-wal.bak` (없으면 건너뜀)
     - `members.db-shm` → `members.db-shm.bak` (없으면 건너뜀)
  3. `backups/` 폴더의 원하는 `.db` 파일을 `db/members.db`로 복사
  4. 앱 재실행 후 정상 동작 확인 — 이상 없으면 `.bak` 파일 삭제
- 후속 버전: 설정 화면에 "마지막 백업 성공 시각" 표시 (배포 앱에서는 콘솔 로그를 사용자가 볼 수 없으므로)

---

### Phase 10 — 빌드 & 배포

**목표**: Windows EXE + macOS DMG 크로스플랫폼 빌드

**프로젝트 설정 파일명 주의**
- electron-vite 사용 시 번들러 설정 파일은 `vite.config.js`가 아닌 `electron.vite.config.js`

**electron-builder 핵심 설정 (`electron-builder.yml`)**
```yaml
appId: kr.kcea.member-manager
productName: 한국콘텐츠기업협회 회원관리

win:
  target:
    - target: nsis
      arch: [x64]
  icon: build/icon.ico

nsis:
  oneClick: false
  allowToChangeInstallationDirectory: true
  language: 1042           # 한국어 (NSIS 언어 코드)

mac:
  category: public.app-category.business
  target:
    - target: dmg
      arch: universal      # 단일 유니버설 바이너리 (Apple Silicon + Intel)
                           # arch: [x64, arm64] 는 별도 2개 바이너리이므로 주의
  hardenedRuntime: true
  entitlements: build/entitlements.mac.plist
  entitlementsInherit: build/entitlements.mac.plist
  icon: build/icon.icns

dmg:
  title: 한국콘텐츠기업협회 회원관리 ${version}
  window:
    width: 540
    height: 380
```

**better-sqlite3 네이티브 모듈 빌드**
- `package.json` postinstall에 추가:
  ```json
  "postinstall": "electron-builder install-app-deps"
  ```
  → electron-builder 공식 권장 방식. 타깃 플랫폼에 맞는 네이티브 의존성을 자동 재빌드함
- Windows에서 빌드하면 Windows용 .exe, macOS에서 빌드하면 macOS용 .dmg 생성
- 크로스빌드(macOS→Windows)는 제약 많음 → **EXE는 Windows 환경에서, DMG는 macOS 환경에서 각각 빌드** 권장

**아이콘 파일 준비**
- `build/icon.ico` — Windows용 (256×256 포함 다중 해상도)
- `build/icon.icns` — macOS용
- 원본 PNG 1024×1024 하나로 `electron-icon-builder` 등으로 자동 변환 가능

**공증(Notarization) — macOS만 해당, 선택사항**
- Apple Developer Program 가입 필요 (연 $99)
- `APPLE_ID`, `APPLE_APP_SPECIFIC_PASSWORD`, `APPLE_TEAM_ID` 환경변수 설정
- 서명 없이도 개발 환경 배포는 가능 (Gatekeeper 우회 안내 필요)

**Windows SmartScreen 경고 대응**
- 서명 없는 EXE 실행 시 "Windows가 PC를 보호했습니다" 경고 발생
- 수신자 안내: "추가 정보" 클릭 → "실행" 버튼으로 우회 가능

**릴리즈 체크리스트**
- [ ] DB 초기화 정상 동작 확인 (Windows / macOS 각각)
- [ ] userData 경로 정상 생성 확인 (Windows: %APPDATA%, macOS: ~/Library)
- [ ] 자동 백업 경로 정상 생성 확인
- [ ] IPC 에러 시 UI 오류 메시지 표출 확인
- [ ] 탈퇴 회원 데이터 보존 확인
- [ ] Windows EXE 설치 후 첫 실행 테스트 (클린 Windows 환경)
- [ ] macOS DMG 설치 후 첫 실행 테스트 (Apple Silicon + Intel)
