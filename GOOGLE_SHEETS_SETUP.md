# Google Sheets 연동 설정 가이드

이 프로젝트는 `Google Apps Script Web App`을 통해 Google Sheets 데이터를 저장/조회합니다.

기본 대상 스프레드시트:
- [아이콩콩 DB 시트](https://docs.google.com/spreadsheets/d/1-4yzOffi19OwcxzdUgt8bOTIsroc9zqRibVDfZC3nPI/edit?usp=sharing)
- Spreadsheet ID: `1-4yzOffi19OwcxzdUgt8bOTIsroc9zqRibVDfZC3nPI`

## 1) Apps Script 프로젝트 교체
1. [https://script.google.com](https://script.google.com) 접속
2. 현재 사용하는 Apps Script 프로젝트 열기
3. 기존 `Code.gs` 전체 삭제
4. 아래 파일 내용 전체 붙여넣기
- `google-apps-script/Code.gs`

중요:
- 예전 배포본은 계약 저장은 되더라도 `load` 시 일부 필드만 읽어 와서 `시공 차수`, `할인 유형`, `기타 할인 상세`, `시공 특이사항` 같은 값이 계약서 미리보기에서 빠질 수 있습니다.
- 이번 `Code.gs`는 기존 영문/구버전 헤더도 읽어서 한글 표준 열 순서로 다시 정리하도록 바뀌었습니다.

## 2) 웹 앱 다시 배포
코드만 저장하면 기존 웹 앱 URL에 바로 반영되지 않을 수 있습니다. 반드시 다시 배포하세요.

1. 우측 상단 `배포` -> `새 배포`
2. 유형: `웹 앱`
3. 실행 사용자: `나`
4. 액세스 권한: `모든 사용자`
5. 새로 발급된 URL 복사
- 예: `https://script.google.com/macros/s/XXXXX/exec`

기존 URL을 계속 쓰고 있었다면, 앱은 여전히 이전 버전을 보고 있을 수 있습니다.

## 3) 앱에 새 웹 앱 URL 적용
현재 코드에는 Web App URL이 기본값으로 포함되어 있어, 관리자 화면에서 별도 입력 UI는 없습니다.

URL을 교체해야 할 경우 브라우저 콘솔에서 아래처럼 저장하세요.

```js
localStorage.setItem('aikongkong_sheets_api_url', 'https://script.google.com/macros/s/새웹앱ID/exec');
location.reload();
```

## 4) 시트 구조 한글 표준으로 재구성
재배포 후 아래 URL을 1회 호출하면 시트 탭 이름과 헤더가 모두 한글 기준으로 재구성됩니다.

```text
https://script.google.com/macros/s/새웹앱ID/exec?action=normalizeHeadersKo
```

이 작업에서 처리되는 내용:
- 기존 영어 탭 이름 `contracts`, `as_requests`, `admins`를 각각 `시공계약서`, `AS신청내역`, `관리자`로 변경
- 기존 영문 헤더(`id`, `customerName` 등)를 한글 헤더로 통일
- 구버전 열 순서 데이터를 새 양식 순서에 맞게 다시 저장
- 필요한 경우 시트별 백업 탭 자동 생성
- 계약서 필드 누락 없이 새 양식 기준으로 저장/조회 가능

응답 예시:
- `ok: true`이면 정상 처리
- `UNKNOWN_ACTION: normalizeHeadersKo`가 나오면 아직 예전 배포 URL을 보고 있는 상태입니다. `Code.gs` 반영 후 다시 배포한 URL로 바꿔야 합니다.

## 5) 자동 생성되는 시트와 주요 컬럼
연동 성공 시 아래 한글 탭이 자동으로 준비됩니다.
- `시공계약서`
- `AS신청내역`
- `관리자`

`contracts`는 아래 한글 컬럼 순서로 저장됩니다.
- `식별ID`, `계약번호`, `고객명`, `연락처`, `주소`, `제품`, `색상`, `총금액`
- `결제방식`, `결제요약`, `시공일자`, `문서연도`, `문서월`, `문서일`
- `시공차수`, `할인유형`, `기타할인상세`, `시공특이사항`
- `고객서명명`, `시공자서명명`, `고객서명이미지`, `시공자명`, `시공자서명이미지`
- `생성일시`, `수정일시`, `시공자주소`, `시공자연락처`

`관리자` 탭 컬럼:
- `식별ID`, `이름`, `연락처`, `사용여부`, `생성일시`, `수정일시`
- `사용여부`는 `Y`(사용) / `N`(중지)

## 6) 동작 방식
- 관리자 페이지에서 계약 저장 시 Google Sheets 저장을 먼저 시도합니다.
- 원격 저장이 실패하면 localStorage 백업 저장으로 이어집니다.
- 고객/관리자/계약서 페이지는 원격 데이터가 일부 누락되어도 같은 계약 ID의 로컬 백업 값을 우선 합쳐서 표시합니다.
- 따라서 예전 배포본을 쓰는 동안에도 직전 저장 건은 화면에서 최대한 보정되지만, 근본 해결은 Apps Script 재배포입니다.

## 7) 관리자 로그인 기준
관리자 로그인은 `관리자` 탭 기준으로 판단됩니다.
- 기본값으로 `정지오 / 01085259253 / 사용여부 Y`가 자동 생성됩니다.
- 관리자 추가/변경은 `관리자` 탭 행을 직접 수정해서 관리하면 됩니다.

## 8) 보안 주의
- 현재는 데모 구조라 관리자 인증이 단순합니다.
- 운영 환경에서는 관리자 인증 강화(OTP/서버 세션/JWT 등) 권장
- Apps Script URL이 외부에 노출될 수 있으므로 정기 점검 권장
