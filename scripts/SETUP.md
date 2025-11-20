# Notion Helper Script - 빠른 설정 가이드

## ⚡ 5분 설정

### Step 1: Python 확인
```bash
python --version
```
Python 3.7 이상이 필요합니다.

### Step 2: 의존성 설치
```bash
pip install -r scripts/requirements.txt
```

### Step 3: Notion Integration 생성

1. **Notion Integrations 페이지 접속**
   - https://www.notion.so/my-integrations

2. **New integration 클릭**

3. **설정 입력**
   - Name: `TeddyBear's Room Helper`
   - Associated workspace: 자신의 workspace 선택
   - Type: Internal

4. **Capabilities 설정** (모두 체크)
   - ✅ Read content
   - ✅ Update content
   - ✅ Insert content

5. **Submit 클릭**

6. **Internal Integration Token 복사**
   - `secret_...` 형태의 토큰을 복사

### Step 4: 환경변수 설정

**Windows PowerShell** (권장):
```powershell
# 현재 세션에만 설정
$env:NOTION_API_KEY="secret_..."

# 또는 영구 설정 (재부팅 후에도 유지)
[System.Environment]::SetEnvironmentVariable('NOTION_API_KEY', 'secret_...', 'User')
```

**확인**:
```powershell
echo $env:NOTION_API_KEY
```

### Step 5: Integration에 페이지 권한 부여

작업하려는 Notion 페이지마다:

1. 페이지 우측 상단 **"..."** 클릭
2. **"Add connections"** 클릭
3. **"TeddyBear's Room Helper"** 선택
4. **"Confirm"** 클릭

예시: 🔧 기술 스택 페이지에 연결

### Step 6: 테스트

```bash
# 기술 스택 페이지 검색 테스트
python scripts/notion_helper.py search "기술 스택"
```

성공하면 JSON 결과가 출력됩니다! 🎉

---

## 🎯 첫 실행 예제

### 예제 1: 페이지 검색
```bash
python scripts/notion_helper.py search "업무 허브"
```

### 예제 2: 페이지 전체 읽기
```bash
# 먼저 page_id를 검색으로 찾기
python scripts/notion_helper.py search "기술 스택"

# 나온 page_id로 전체 읽기
python scripts/notion_helper.py read 2ac77770-ad42-8193-bd55-df8586d12aa7
```

### 예제 3: Markdown 파일 추가
```bash
python scripts/notion_helper.py append 2ac77770-ad42-8193-bd55-df8586d12aa7 claudedocs/tech_stack_summary_2025-11-19.md
```

---

## 🔧 문제 해결

### "NOTION_API_KEY가 설정되지 않았습니다"
→ Step 4를 다시 확인하세요

### "401 Unauthorized"
→ Step 5에서 Integration을 페이지에 연결하지 않았습니다

### "ModuleNotFoundError: No module named 'requests'"
→ Step 2를 다시 실행하세요

---

## ✅ 설정 완료 체크리스트

- [ ] Python 3.7+ 설치 확인
- [ ] requests 라이브러리 설치
- [ ] Notion Integration 생성
- [ ] NOTION_API_KEY 환경변수 설정
- [ ] Integration을 작업할 페이지에 연결
- [ ] 테스트 명령어 실행 성공

모두 체크하셨다면 준비 완료! 🚀

---

## 📞 다음 단계

설정이 완료되면 `scripts/README.md`를 참고하여 다양한 기능을 사용하세요.

**Claude Code와 함께 사용하기**:
- "Notion 기술 스택 페이지의 모든 내용을 읽어줘"
- "tech_stack_summary 파일을 Notion에 추가해줘"

Claude가 자동으로 이 스크립트를 호출합니다!
