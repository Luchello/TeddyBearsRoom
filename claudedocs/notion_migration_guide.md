# Notion 업무 허브 Migration Guide

**작업 완료 일시**: 2025-11-19
**작업자**: Claude Code

---

## ✅ 완료된 작업

### 1. Empty Pages Archive (6개)
다음 페이지들은 content가 없어서 자동으로 archive 처리되었습니다:

- ✅ 🎨 웹디자인
- ✅ 📝 콘텐츠 관리
- ✅ 📊 운영 관리
- ✅ 📈 데이터 분석
- ✅ ⚖️ 법률
- ✅ 🔒 보안/개인정보

**위치**: Notion Trash에서 확인 가능 (필요시 복구 가능)

### 2. Reference Links 추가 (4개 Target Pages)
각 통합 target page의 최상단에 기존 content pages로의 link를 추가했습니다:

- ✅ **🎨 브랜드 & 디자인** → ✨ 브랜딩 link 추가
- ✅ **📣 마케팅 & 콘텐츠** → 🎯 마케팅 link 추가
- ✅ **📦 상품 관리** → 📦 소싱 link 추가
- ✅ **📊 운영 & 분석** → 🔧 기술 스택, 💬 고객 서비스/CS links 추가

---

## 📋 사용자가 수동으로 완료해야 할 작업

### Step 1: Page 이동 (Drag & Drop)

Notion API 제약으로 인해 page의 parent를 자동으로 변경할 수 없습니다.
다음 pages를 **수동으로 이동**해주세요:

#### 방법:
1. Notion workspace에서 해당 page를 찾습니다
2. Page 제목 왼쪽의 `⋮⋮` (6-dot handle)을 클릭하고 드래그합니다
3. Target page 위에 드롭하여 child page로 만듭니다

#### 이동할 Pages:

**1. ✨ 브랜딩 → 🎨 브랜드 & 디자인**
- Source: `업무 허브 > ✨ 브랜딩`
- Target: `업무 허브 > 🎨 브랜드 & 디자인` (child page로 이동)
- Content: 브랜드 아이덴티티, 컬러 팔레트, 기부 전략 등 (~4,000 characters)

**2. 🎯 마케팅 → 📣 마케팅 & 콘텐츠**
- Source: `업무 허브 > 🎯 마케팅`
- Target: `업무 허브 > 📣 마케팅 & 콘텐츠` (child page로 이동)
- Content: 브랜드 포지셔닝, 타겟 세그먼트, 채널 전략 등 (~3,000 characters)

**3. 📦 소싱 → 📦 상품 관리**
- Source: `업무 허브 > 📦 소싱`
- Target: `업무 허브 > 📦 상품 관리` (child page로 이동)
- Content: 공급업체 선정, AliExpress 전략 등 (~2,000 characters)

**4. 🔧 기술 스택 → 📊 운영 & 분석**
- Source: `업무 허브 > 🔧 기술 스택`
- Target: `업무 허브 > 📊 운영 & 분석` (child page로 이동)
- Content: 스마트 사이즈 추천 시스템 (~1,500 characters)

**5. 💬 고객 서비스/CS → 📊 운영 & 분석**
- Source: `업무 허브 > 💬 고객 서비스/CS`
- Target: `업무 허브 > 📊 운영 & 분석` (child page로 이동)
- Content: Minimal parent + child page "✨ 스마트 사이즈 추천"

---

### Step 2: Content 통합 (선택사항)

Page 이동 후, 원하신다면 child pages의 내용을 parent page로 직접 통합할 수 있습니다:

1. Child page를 열고 모든 content를 선택 (Ctrl+A)
2. 복사 (Ctrl+C)
3. Parent page로 이동하여 적절한 위치에 붙여넣기 (Ctrl+V)
4. Child page는 더 이상 필요없으면 archive

---

### Step 3: 최종 구조 검증

작업 완료 후 다음 구조가 되어야 합니다:

```
📋 업무 허브
├── 📦 소싱 (기존 유지)
├── 💬 고객 서비스/CS (기존 유지)
├── 🔧 기술 스택 (기존 유지)
├── 💰 재무/회계 (기존 유지)
├── 🎪 행사 계획 (기존 유지)
│
├── 🎨 브랜드 & 디자인 (2025-11-18 NEW)
│   └── ✨ 브랜딩 (이동됨)
│
├── 📣 마케팅 & 콘텐츠 (2025-11-18 NEW)
│   └── 🎯 마케팅 (이동됨)
│
├── 📊 운영 & 분석 (2025-11-18 NEW)
│   ├── 🔧 기술 스택 (이동됨)
│   └── 💬 고객 서비스/CS (이동됨)
│
├── ⚖️ 법률 & 컴플라이언스 (2025-11-18 NEW)
│
├── 🚚 물류 & 배송 (2025-11-18 NEW)
│
├── 📦 상품 관리 (2025-11-18 NEW)
│   └── 📦 소싱 (이동됨)
│
└── 🤝 파트너십 & 제휴 (2025-11-18 NEW)
```

---

## 📊 Migration Summary

| 작업 유형 | 개수 | 상태 |
|---------|------|------|
| Empty pages archived | 6개 | ✅ 완료 (자동) |
| Reference links 추가 | 4개 | ✅ 완료 (자동) |
| Pages 이동 필요 | 5개 | ⏳ 수동 작업 필요 |
| Content 통합 (선택) | 5개 | 📝 선택사항 |

---

## 🔍 Before / After

### Before (2025-11-18 이전)
```
업무 허브
├── ✨ 브랜딩
├── 🎨 웹디자인 (empty)
├── 🎯 마케팅
├── 📝 콘텐츠 관리 (empty)
├── 📊 운영 관리 (empty)
├── 📈 데이터 분석 (empty)
├── ⚖️ 법률 (empty)
├── 🔒 보안/개인정보 (empty)
├── 📦 소싱
├── 💬 고객 서비스/CS
├── 🔧 기술 스택
└── 💰 재무/회계
```

### After (2025-11-19 현재)
```
업무 허브 (정리됨)
├── [기존 5개 유지]
├── 🎨 브랜드 & 디자인 📌→ ✨ 브랜딩
├── 📣 마케팅 & 콘텐츠 📌→ 🎯 마케팅
├── 📊 운영 & 분석 📌→ 🔧 기술스택, 💬 CS
├── ⚖️ 법률 & 컴플라이언스
├── 🚚 물류 & 배송
├── 📦 상품 관리 📌→ 📦 소싱
└── 🤝 파트너십 & 제휴

Trash (archived)
├── 🎨 웹디자인
├── 📝 콘텐츠 관리
├── 📊 운영 관리
├── 📈 데이터 분석
├── ⚖️ 법률
└── 🔒 보안/개인정보
```

**📌 = Reference link 추가됨**

---

## ⚠️ 주의사항

1. **Archive된 pages 복구**: 필요시 Notion Trash에서 30일 이내 복구 가능
2. **Page 이동 시 권한**: Workspace owner 또는 admin 권한 필요
3. **Child pages 보존**: Page 이동 시 모든 child pages도 함께 이동됩니다
4. **Link 유지**: Page 이동해도 기존 internal links는 자동으로 업데이트됩니다

---

## 📞 문제 발생 시

Migration 과정에서 문제가 발생하면:

1. **Pages 찾을 수 없음**: Notion 좌측 sidebar에서 "All Pages" 검색 사용
2. **이동 권한 없음**: Workspace admin에게 권한 요청
3. **Content 손실 우려**: Archive 전에 각 page를 export (PDF/Markdown)하여 백업

---

## ✅ 완료 체크리스트

사용자가 수동으로 완료할 작업:

- [ ] ✨ 브랜딩 → 🎨 브랜드 & 디자인으로 이동
- [ ] 🎯 마케팅 → 📣 마케팅 & 콘텐츠로 이동
- [ ] 📦 소싱 → 📦 상품 관리로 이동
- [ ] 🔧 기술 스택 → 📊 운영 & 분석으로 이동
- [ ] 💬 고객 서비스/CS → 📊 운영 & 분석으로 이동
- [ ] 최종 구조 검증 완료
- [ ] (선택) Child pages content 통합

---

**작업 완료 후 이 가이드는 삭제하셔도 됩니다.**
