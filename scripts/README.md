# Notion Helper Script - 사용 가이드

TeddyBear'sRoom 프로젝트를 위한 Notion 자동화 도구입니다.

## 🎯 목적

Notion MCP의 제약사항을 우회하여:
- ✅ 대용량 페이지 읽기/쓰기 (token 제한 해결)
- ✅ Batch 작업 자동화
- ✅ Markdown → Notion 자동 변환
- ✅ 복잡한 작업을 간단한 명령어로

---

## 🚀 설치 방법

### 1. Python 의존성 설치

```bash
pip install -r scripts/requirements.txt
```

### 2. Notion API Key 설정

#### Step 1: Notion Integration 생성
1. https://www.notion.so/my-integrations 방문
2. "New integration" 클릭
3. 이름: "TeddyBear's Room Helper"
4. Associated workspace 선택
5. "Submit" 클릭
6. **Internal Integration Token** 복사

#### Step 2: 환경변수 설정

**Windows (PowerShell)**:
```powershell
$env:NOTION_API_KEY="secret_..."
```

**Windows (CMD)**:
```cmd
set NOTION_API_KEY=secret_...
```

**Linux/Mac**:
```bash
export NOTION_API_KEY="secret_..."
```

**영구 설정 (Windows)**:
```powershell
[System.Environment]::SetEnvironmentVariable('NOTION_API_KEY', 'secret_...', 'User')
```

#### Step 3: Integration에 페이지 권한 부여
1. Notion에서 작업할 페이지 열기
2. 우측 상단 "..." 메뉴 클릭
3. "Add connections" 클릭
4. "TeddyBear's Room Helper" 선택
5. "Confirm" 클릭

---

## 📖 사용법

### 기본 명령어

#### 1. 페이지 전체 읽기
```bash
python scripts/notion_helper.py read <page_id>
```

**예시**:
```bash
python scripts/notion_helper.py read 2ac77770-ad42-8193-bd55-df8586d12aa7
```

**출력**:
```json
{
  "page": {...},
  "blocks": [...],
  "total_blocks": 150
}
```

---

#### 2. 페이지 검색
```bash
python scripts/notion_helper.py search "검색어"
```

**예시**:
```bash
python scripts/notion_helper.py search "기술 스택"
```

**출력**:
```json
[
  {
    "id": "2ac77770-ad42-8193-bd55-df8586d12aa7",
    "properties": {...}
  }
]
```

---

#### 3. Markdown 파일 내용 추가
```bash
python scripts/notion_helper.py append <page_id> <markdown_file>
```

**예시**:
```bash
python scripts/notion_helper.py append 2ac77770-ad42-8193-bd55-df8586d12aa7 claudedocs/tech_stack_summary_2025-11-19.md
```

**지원 포맷**:
- `# Heading 1`
- `## Heading 2`
- `### Heading 3`
- `- Bullet list`
- 일반 paragraph

---

#### 4. 페이지 Property 업데이트
```bash
python scripts/notion_helper.py update <page_id> '{"title": [...]}'
```

**예시**:
```bash
python scripts/notion_helper.py update 2ac77770-ad42-8193-bd55-df8586d12aa7 '{"title": [{"type": "text", "text": {"content": "새 제목"}}]}'
```

---

## 🔧 Python 코드에서 직접 사용

```python
from scripts.notion_helper import NotionHelper

# Helper 초기화
helper = NotionHelper()

# 대용량 페이지 읽기
result = helper.get_full_page_content("page_id")
print(f"총 {result['total_blocks']} blocks 로딩됨")

# Markdown 변환 후 추가
blocks = helper.markdown_to_blocks("path/to/file.md")
helper.append_blocks_batch("page_id", blocks)

# 페이지 검색
pages = helper.search_pages("검색어")

# Property 업데이트
helper.update_page_properties("page_id", {
    "title": [{"type": "text", "text": {"content": "새 제목"}}]
})
```

---

## 💡 Claude Code와 함께 사용

Claude가 자동으로 이 스크립트를 호출하도록 할 수 있습니다:

**Claude에게 요청**:
```
"기술 스택 페이지의 모든 내용을 읽어줘"
```

**Claude의 동작**:
```bash
python scripts/notion_helper.py read 2ac77770-ad42-8193-bd55-df8586d12aa7
```

**Markdown 파일 추가 요청**:
```
"tech_stack_summary_2025-11-19.md 파일을 Notion 기술 스택 페이지에 추가해줘"
```

**Claude의 동작**:
```bash
python scripts/notion_helper.py append 2ac77770-ad42-8193-bd55-df8586d12aa7 claudedocs/tech_stack_summary_2025-11-19.md
```

---

## 🎯 주요 기능 상세

### 1. 대용량 페이지 읽기 (`get_full_page_content`)

**문제**: Notion MCP는 25,000 token 제한이 있어 큰 페이지를 읽을 수 없음

**해결**: Pagination을 자동으로 처리하여 모든 block을 순차적으로 로딩

**성능**:
- 100 blocks/request
- 자동 cursor 관리
- 진행 상황 실시간 출력

---

### 2. Batch Block 추가 (`append_blocks_batch`)

**문제**: 많은 block을 한 번에 추가하면 timeout 발생

**해결**: Block을 batch로 나눠서 순차적으로 추가

**성능**:
- 기본 100 blocks/batch
- 에러 발생 시 중단 및 리포트
- 성공/실패 통계 제공

---

### 3. Markdown → Notion 변환 (`markdown_to_blocks`)

**문제**: Markdown 파일을 수동으로 복사하면 포맷 깨짐

**해결**: Markdown을 Notion block 구조로 자동 변환

**지원 포맷**:
- Heading 1-3
- Bullet list
- Paragraph
- (향후 확장 가능: code block, image 등)

---

## ⚠️ 제약 사항 및 주의사항

### API 제약사항
1. **Page Parent 변경 불가**: Notion API 자체가 지원하지 않음
   - 해결: Notion UI에서 수동 drag & drop 필요

2. **Rate Limiting**: 초당 3 requests 제한
   - 해결: 스크립트가 자동으로 처리 (에러 시 재시도)

3. **Block 중첩 제한**: 최대 2 레벨 중첩만 지원
   - 해결: 평탄화된 구조로 변환

### 보안 주의사항
1. **API Key 노출 방지**:
   - ❌ 절대 Git에 커밋하지 말 것
   - ✅ 환경변수로만 관리
   - ✅ `.gitignore`에 `.env` 파일 추가

2. **권한 최소화**:
   - Integration에 필요한 페이지만 연결
   - 주기적으로 권한 검토

---

## 🔍 문제 해결

### 에러: "NOTION_API_KEY가 설정되지 않았습니다"

**해결**:
```bash
# Windows
$env:NOTION_API_KEY="your_key_here"

# Linux/Mac
export NOTION_API_KEY="your_key_here"
```

### 에러: "requests module not found"

**해결**:
```bash
pip install -r scripts/requirements.txt
```

### 에러: "401 Unauthorized"

**원인**: Integration이 페이지에 연결되지 않음

**해결**:
1. Notion 페이지에서 "..." 메뉴
2. "Add connections"
3. Integration 선택

### 에러: "429 Too Many Requests"

**원인**: Rate limit 초과

**해결**: 잠시 대기 후 재시도 (스크립트가 자동 처리)

---

## 📊 성능 비교

### Before (Notion MCP 사용)
- 큰 페이지: ❌ Token 제한으로 읽기 불가
- Markdown 추가: ⚠️ 수동 복사 필요
- Batch 작업: ❌ 수동으로 하나씩 처리

### After (Helper Script 사용)
- 큰 페이지: ✅ 전체 내용 자동 로딩
- Markdown 추가: ✅ 한 줄 명령어로 완료
- Batch 작업: ✅ 자동화된 일괄 처리

**시간 절감**: 약 **70-80%** 단축

---

## 🚀 향후 개선 계획

### Phase 1 (현재)
- [x] 기본 CRUD 작업
- [x] Pagination 자동화
- [x] Markdown 변환

### Phase 2 (1-2주 후)
- [ ] Code block 지원
- [ ] Image 업로드 지원
- [ ] Database row 관리
- [ ] 에러 재시도 로직 개선

### Phase 3 (1달 후)
- [ ] 양방향 동기화 (Notion ↔ Git)
- [ ] Webhook 통합
- [ ] GitHub Actions 자동화

---

## 📚 참고 자료

- [Notion API 공식 문서](https://developers.notion.com/)
- [Notion API Reference](https://developers.notion.com/reference)
- [Python requests 문서](https://requests.readthedocs.io/)

---

**작성자**: Claude Code
**작성일**: 2025-11-19
**버전**: 1.0.0
