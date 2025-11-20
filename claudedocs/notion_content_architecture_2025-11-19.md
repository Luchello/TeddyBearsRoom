# Notion 기술 스택 페이지 콘텐츠 아키텍처

**작성일**: 2025-11-19
**타입**: Architecture Design
**대상**: Notion 🔧 기술 스택 페이지 (ID: `2ac77770-ad42-8193-bd55-df8586d12aa7`)

---

## 📐 Overall Structure (전체 구조)

### Page Hierarchy
```
🔧 기술 스택 (Page)
├── 📄 Introduction (Optional)
├── 1️⃣ 섹션 1: 디자인 컨셉
├── 2️⃣ 섹션 2: 간소화된 기술 스택
├── 3️⃣ 섹션 3: 데이터베이스 설계
├── 4️⃣ 섹션 4: 핵심 로직 상세
└── 5️⃣ 섹션 5: 1인 개발 로드맵
```

### Block Count Estimation
- Total blocks: ~80-100개
- Section 1: ~15 blocks
- Section 2: ~20 blocks
- Section 3: ~15 blocks
- Section 4: ~20 blocks
- Section 5: ~15 blocks

**Notion API Constraint**: 한 번에 최대 100 blocks append 가능
**Strategy**: 한 번에 모두 전송 또는 섹션별 5회 분할

---

## 🎨 섹션 1: 디자인 컨셉 (Architecture)

### Block Structure
```json
[
  {
    "type": "heading_1",
    "heading_1": {
      "rich_text": [{ "type": "text", "text": { "content": "1. 🎨 디자인 컨셉: \"디지털 테디베어 하우스\"" } }],
      "color": "default",
      "is_toggleable": false
    }
  },
  {
    "type": "quote",
    "quote": {
      "rich_text": [{ "type": "text", "text": { "content": "차가운 공학적인 느낌을 배제하고, 사용자가 원하는 '둥글고 따뜻한 파스텔톤'을 기술적으로 구현합니다." } }],
      "color": "default"
    }
  },
  {
    "type": "heading_2",
    "heading_2": {
      "rich_text": [{ "type": "text", "text": { "content": "Core Theme: Soft, Cozy, Pastel" } }],
      "color": "default"
    }
  },
  {
    "type": "heading_3",
    "heading_3": {
      "rich_text": [{ "type": "text", "text": { "content": "Color Palette (예시)" } }]
    }
  },
  {
    "type": "code",
    "code": {
      "rich_text": [{
        "type": "text",
        "text": {
          "content": "Primary: 따뜻한 라떼 베이지 (#F5E6D3) - 배경\nSecondary: 부드러운 코코아 브라운 (#8D6E63) - 텍스트/강조\nAccent: 파스텔 핑크 (#FFCDD2) & 민트 (#B2DFDB) - 버튼/알림"
        }
      }],
      "language": "plain text",
      "caption": []
    }
  },
  {
    "type": "heading_3",
    "heading_3": {
      "rich_text": [{ "type": "text", "text": { "content": "UI Shape (Border Radius)" } }]
    }
  },
  {
    "type": "bulleted_list_item",
    "bulleted_list_item": {
      "rich_text": [{
        "type": "text",
        "text": { "content": "기본 shadcn/ui의 날카로운 모서리(radius: 0.5rem) 대신 " }
      }, {
        "type": "text",
        "text": { "content": "radius: 1rem 이상" },
        "annotations": { "bold": true }
      }, {
        "type": "text",
        "text": { "content": "을 사용하여 모든 요소를 동글동글하게 처리합니다." }
      }],
      "color": "default"
    }
  },
  {
    "type": "bulleted_list_item",
    "bulleted_list_item": {
      "rich_text": [{
        "type": "text",
        "text": { "content": "버튼은 " }
      }, {
        "type": "text",
        "text": { "content": "알약 모양(Pill shape)" },
        "annotations": { "bold": true }
      }, {
        "type": "text",
        "text": { "content": "을 기본으로 합니다." }
      }]
    }
  },
  {
    "type": "heading_3",
    "heading_3": {
      "rich_text": [{ "type": "text", "text": { "content": "Font" } }]
    }
  },
  {
    "type": "paragraph",
    "paragraph": {
      "rich_text": [{
        "type": "text",
        "text": { "content": "가독성이 좋으면서도 딱딱하지 않은 산세리프 폰트 (예: Pretendard Rounded 혹은 둥근모꼴 느낌의 웹폰트)" }
      }]
    }
  },
  {
    "type": "divider",
    "divider": {}
  }
]
```

### Design Rationale
- **Heading 계층**: H1 (섹션) → H2 (주제) → H3 (세부항목)
- **Code block**: 컬러 팔레트는 코드로 표현하여 복사 용이
- **Rich text annotations**: Bold로 핵심 키워드 강조
- **Divider**: 섹션 간 명확한 구분

---

## 🛠 섹션 2: 간소화된 기술 스택 (Architecture)

### Block Structure
```json
[
  {
    "type": "heading_1",
    "heading_1": {
      "rich_text": [{ "type": "text", "text": { "content": "2. 🛠 간소화된 최종 기술 스택 (Lite Version)" } }]
    }
  },
  {
    "type": "callout",
    "callout": {
      "rich_text": [{
        "type": "text",
        "text": { "content": "⚠️ 주요 변경사항: TanStack Query 제거" },
        "annotations": { "bold": true }
      }, {
        "type": "text",
        "text": { "content": " - Next.js 14 Server Components와의 완벽한 호환을 위해 TanStack Query를 제거하고, Supabase를 Server Components에서 직접 사용합니다." }
      }],
      "icon": { "type": "emoji", "emoji": "⚠️" },
      "color": "yellow_background"
    }
  },
  {
    "type": "heading_2",
    "heading_2": {
      "rich_text": [{ "type": "text", "text": { "content": "Framework" } }]
    }
  },
  {
    "type": "bulleted_list_item",
    "bulleted_list_item": {
      "rich_text": [{
        "type": "text",
        "text": { "content": "Framework: " },
        "annotations": { "bold": true }
      }, {
        "type": "text",
        "text": { "content": "Next.js 14 (App Router)" }
      }]
    }
  },
  {
    "type": "bulleted_list_item",
    "bulleted_list_item": {
      "rich_text": [{
        "type": "text",
        "text": { "content": "Language: " },
        "annotations": { "bold": true }
      }, {
        "type": "text",
        "text": { "content": "TypeScript" }
      }]
    }
  },
  {
    "type": "heading_2",
    "heading_2": {
      "rich_text": [{ "type": "text", "text": { "content": "Database & Auth" } }]
    }
  },
  {
    "type": "bulleted_list_item",
    "bulleted_list_item": {
      "rich_text": [{
        "type": "text",
        "text": { "content": "Database: " },
        "annotations": { "bold": true }
      }, {
        "type": "text",
        "text": { "content": "Supabase (PostgreSQL)" }
      }]
    }
  },
  {
    "type": "bulleted_list_item",
    "bulleted_list_item": {
      "rich_text": [{
        "type": "text",
        "text": { "content": "Auth: " },
        "annotations": { "bold": true }
      }, {
        "type": "text",
        "text": { "content": "Supabase Auth" }
      }]
    }
  },
  {
    "type": "heading_2",
    "heading_2": {
      "rich_text": [{ "type": "text", "text": { "content": "State Management" } }]
    }
  },
  {
    "type": "toggle",
    "toggle": {
      "rich_text": [{
        "type": "text",
        "text": { "content": "❌ TanStack Query 제거 (이유 보기)" },
        "annotations": { "bold": true }
      }],
      "children": [
        {
          "type": "paragraph",
          "paragraph": {
            "rich_text": [{
              "type": "text",
              "text": { "content": "Supabase는 Next.js의 Server Components와 궁합이 아주 좋습니다. 데이터를 서버에서 바로 가져오면 되므로 복잡한 클라이언트 캐싱이 초기엔 불필요합니다." }
            }]
          }
        }
      ]
    }
  },
  {
    "type": "toggle",
    "toggle": {
      "rich_text": [{
        "type": "text",
        "text": { "content": "⚠️ Zustand (조건부 사용)" }
      }],
      "children": [
        {
          "type": "paragraph",
          "paragraph": {
            "rich_text": [{
              "type": "text",
              "text": { "content": "'장바구니(Cart)' 같이 여러 페이지에서 유지되어야 하는 데이터에만 제한적으로 사용합니다." }
            }]
          }
        }
      ]
    }
  },
  {
    "type": "heading_2",
    "heading_2": {
      "rich_text": [{ "type": "text", "text": { "content": "Styling" } }]
    }
  },
  {
    "type": "bulleted_list_item",
    "bulleted_list_item": {
      "rich_text": [{
        "type": "text",
        "text": { "content": "CSS Framework: " },
        "annotations": { "bold": true }
      }, {
        "type": "text",
        "text": { "content": "Tailwind CSS + shadcn/ui" }
      }]
    }
  },
  {
    "type": "heading_2",
    "heading_2": {
      "rich_text": [{ "type": "text", "text": { "content": "Payments" } }]
    }
  },
  {
    "type": "bulleted_list_item",
    "bulleted_list_item": {
      "rich_text": [{
        "type": "text",
        "text": { "content": "결제 시스템: " },
        "annotations": { "bold": true }
      }, {
        "type": "text",
        "text": { "content": "TossPayments SDK (빌링키 방식)" }
      }]
    }
  },
  {
    "type": "divider",
    "divider": {}
  }
]
```

### Design Rationale
- **Callout block**: 주요 변경사항을 눈에 띄게 강조 (yellow background)
- **Toggle blocks**: TanStack Query 제거 이유 등 상세 설명을 접을 수 있게
- **Nested children**: Toggle 내부에 paragraph를 children으로 추가
- **Consistent formatting**: "항목명: " bold + "값" normal

---

## 🗄️ 섹션 3: 데이터베이스 설계 (Architecture)

### Block Structure
```json
[
  {
    "type": "heading_1",
    "heading_1": {
      "rich_text": [{ "type": "text", "text": { "content": "3. 🗄️ 데이터베이스 설계 (보안 강화 및 구독)" } }]
    }
  },
  {
    "type": "callout",
    "callout": {
      "rich_text": [{
        "type": "text",
        "text": { "content": "Supabase의 기능을 100% 활용하여 백엔드 코드를 줄입니다." }
      }],
      "icon": { "type": "emoji", "emoji": "💡" },
      "color": "blue_background"
    }
  },
  {
    "type": "heading_2",
    "heading_2": {
      "rich_text": [{ "type": "text", "text": { "content": "A. user_body_profiles (신체 정보 - 보안 강화)" } }]
    }
  },
  {
    "type": "paragraph",
    "paragraph": {
      "rich_text": [{
        "type": "text",
        "text": { "content": "PostgreSQL의 " }
      }, {
        "type": "text",
        "text": { "content": "pgcrypto" },
        "annotations": { "code": true }
      }, {
        "type": "text",
        "text": { "content": " 확장을 사용하여 DB 레벨에서 암호화합니다." }
      }]
    }
  },
  {
    "type": "code",
    "code": {
      "rich_text": [{
        "type": "text",
        "text": {
          "content": "user_id (PK, FK): 사용자 ID\nheight: 키 (암호화 저장)\nweight: 몸무게 (암호화 저장)\nchest, waist, hip: 각 둘레 정보 (암호화 저장)\nencrypted_key: 복호화를 위한 키 (별도 관리 필요, 혹은 Supabase Vault 사용 고려)"
        }
      }],
      "language": "plain text",
      "caption": []
    }
  },
  {
    "type": "heading_2",
    "heading_2": {
      "rich_text": [{ "type": "text", "text": { "content": "B. product_size_specs (제품 스펙)" } }]
    }
  },
  {
    "type": "paragraph",
    "paragraph": {
      "rich_text": [{
        "type": "text",
        "text": { "content": "관대한 핏을 고려하여 단순 범위로 저장합니다." }
      }]
    }
  },
  {
    "type": "code",
    "code": {
      "rich_text": [{
        "type": "text",
        "text": {
          "content": "product_id (FK)\nsize_label: 'M', 'L', 'Free' 등\nmin_height ~ max_height\nmin_chest ~ max_chest\n... (허리, 엉덩이 동일 패턴)"
        }
      }],
      "language": "plain text"
    }
  },
  {
    "type": "heading_2",
    "heading_2": {
      "rich_text": [{ "type": "text", "text": { "content": "C. subscriptions (구독 정보)" } }]
    }
  },
  {
    "type": "code",
    "code": {
      "rich_text": [{
        "type": "text",
        "text": {
          "content": "user_id (FK)\nbilling_key: 토스에서 발급받은 정기 결제용 키 (중요!)\nplan_type: 'BASIC', 'PREMIUM'\nnext_payment_date: 다음 결제 예정일\nstatus: 'ACTIVE', 'PAUSED', 'CANCELLED'"
        }
      }],
      "language": "plain text"
    }
  },
  {
    "type": "divider",
    "divider": {}
  }
]
```

### Design Rationale
- **Code blocks for schemas**: 테이블 스키마는 code block으로 명확히 표현
- **Inline code**: `pgcrypto` 같은 기술 용어는 inline code 포맷
- **Callout for context**: Supabase 활용 철학을 callout으로 강조

---

## ⚙️ 섹션 4: 핵심 로직 상세 (Architecture)

### Block Structure
```json
[
  {
    "type": "heading_1",
    "heading_1": {
      "rich_text": [{ "type": "text", "text": { "content": "4. ⚙️ 핵심 로직 상세 (Logic Spec)" } }]
    }
  },
  {
    "type": "heading_2",
    "heading_2": {
      "rich_text": [{ "type": "text", "text": { "content": "A. 스마트 사이즈 추천 (단순 매칭)" } }]
    }
  },
  {
    "type": "paragraph",
    "paragraph": {
      "rich_text": [{
        "type": "text",
        "text": { "content": "복잡한 점수제 대신 " }
      }, {
        "type": "text",
        "text": { "content": "Pass/Fail + 약간의 여유 로직" },
        "annotations": { "bold": true }
      }, {
        "type": "text",
        "text": { "content": "을 사용합니다." }
      }]
    }
  },
  {
    "type": "numbered_list_item",
    "numbered_list_item": {
      "rich_text": [{
        "type": "text",
        "text": { "content": "Fetch: " },
        "annotations": { "bold": true }
      }, {
        "type": "text",
        "text": { "content": "사용자의 신체 치수와 보고 있는 제품의 사이즈 스펙을 가져옵니다." }
      }]
    }
  },
  {
    "type": "numbered_list_item",
    "numbered_list_item": {
      "rich_text": [{
        "type": "text",
        "text": { "content": "Compare:" },
        "annotations": { "bold": true }
      }]
    }
  },
  {
    "type": "bulleted_list_item",
    "bulleted_list_item": {
      "rich_text": [{
        "type": "text",
        "text": { "content": "사용자 치수가 min과 max 사이에 있는가? → " }
      }, {
        "type": "text",
        "text": { "content": "OK" },
        "annotations": { "bold": true, "color": "green" }
      }]
    }
  },
  {
    "type": "bulleted_list_item",
    "bulleted_list_item": {
      "rich_text": [{
        "type": "text",
        "text": { "content": "범위를 약간 벗어났지만(예: ±2cm) 허용 가능한가? → " }
      }, {
        "type": "text",
        "text": { "content": "TIGHT / LOOSE" },
        "annotations": { "bold": true, "color": "yellow" }
      }]
    }
  },
  {
    "type": "bulleted_list_item",
    "bulleted_list_item": {
      "rich_text": [{
        "type": "text",
        "text": { "content": "범위를 많이 벗어났는가? → " }
      }, {
        "type": "text",
        "text": { "content": "NO" },
        "annotations": { "bold": true, "color": "red" }
      }]
    }
  },
  {
    "type": "numbered_list_item",
    "numbered_list_item": {
      "rich_text": [{
        "type": "text",
        "text": { "content": "Result:" },
        "annotations": { "bold": true }
      }]
    }
  },
  {
    "type": "quote",
    "quote": {
      "rich_text": [{
        "type": "text",
        "text": { "content": "\"고객님껜 M 사이즈가 가장 편안하게 맞아요! (🐻 추천)\"" }
      }]
    }
  },
  {
    "type": "heading_2",
    "heading_2": {
      "rich_text": [{ "type": "text", "text": { "content": "B. 구독 결제 시스템 (토스 연동)" } }]
    }
  },
  {
    "type": "paragraph",
    "paragraph": {
      "rich_text": [{
        "type": "text",
        "text": { "content": "직접 결제 엔진을 만드는 것이 아니라 " }
      }, {
        "type": "text",
        "text": { "content": "'스케줄러'" },
        "annotations": { "bold": true }
      }, {
        "type": "text",
        "text": { "content": "를 만듭니다." }
      }]
    }
  },
  {
    "type": "numbered_list_item",
    "numbered_list_item": {
      "rich_text": [{
        "type": "text",
        "text": { "content": "카드 등록: " },
        "annotations": { "bold": true }
      }, {
        "type": "text",
        "text": { "content": "사용자가 카드 정보를 입력 → 토스페이먼츠 창 뜸 → 성공 시 billingKey 발급." }
      }]
    }
  },
  {
    "type": "numbered_list_item",
    "numbered_list_item": {
      "rich_text": [{
        "type": "text",
        "text": { "content": "DB 저장: " },
        "annotations": { "bold": true }
      }, {
        "type": "text",
        "text": { "content": "발급받은 billingKey를 Supabase subscriptions 테이블에 저장." }
      }]
    }
  },
  {
    "type": "numbered_list_item",
    "numbered_list_item": {
      "rich_text": [{
        "type": "text",
        "text": { "content": "스케줄링 (Cron):" },
        "annotations": { "bold": true }
      }]
    }
  },
  {
    "type": "bulleted_list_item",
    "bulleted_list_item": {
      "rich_text": [{
        "type": "text",
        "text": { "content": "Supabase의 pg_cron (데이터베이스 스케줄러) 혹은 Vercel Cron을 사용합니다." }
      }]
    }
  },
  {
    "type": "bulleted_list_item",
    "bulleted_list_item": {
      "rich_text": [{
        "type": "text",
        "text": { "content": "매일 자정 로직: next_payment_date가 '오늘'인 사용자 조회 → 토스 API에 billingKey로 결제 요청 → 성공 시 next_payment_date +30일 업데이트." }
      }]
    }
  },
  {
    "type": "divider",
    "divider": {}
  }
]
```

### Design Rationale
- **Numbered list**: 순차적 로직은 numbered list로 단계 표현
- **Nested bullets**: numbered list 하위에 bulleted list로 세부 사항
- **Color annotations**: OK (green), TIGHT/LOOSE (yellow), NO (red)로 시각적 구분
- **Quote block**: 사용자에게 보여질 메시지는 quote로 표현

---

## 🗓️ 섹션 5: 1인 개발 로드맵 (Architecture)

### Block Structure
```json
[
  {
    "type": "heading_1",
    "heading_1": {
      "rich_text": [{ "type": "text", "text": { "content": "5. 🗓️ 1인 개발 최적화 로드맵 (1주 단위)" } }]
    }
  },
  {
    "type": "toggle",
    "toggle": {
      "rich_text": [{
        "type": "text",
        "text": { "content": "Week 1: 집 짓기 (Setup & Design)" },
        "annotations": { "bold": true }
      }],
      "children": [
        {
          "type": "to_do",
          "to_do": {
            "rich_text": [{ "type": "text", "text": { "content": "Next.js + Supabase 세팅" } }],
            "checked": false
          }
        },
        {
          "type": "to_do",
          "to_do": {
            "rich_text": [{ "type": "text", "text": { "content": "Tailwind config 설정 (파스텔톤 컬러 변수 등록, border-radius 조정)" } }],
            "checked": false
          }
        },
        {
          "type": "to_do",
          "to_do": {
            "rich_text": [{ "type": "text", "text": { "content": "메인 레이아웃 잡기 (헤더, 푸터)" } }],
            "checked": false
          }
        },
        {
          "type": "callout",
          "callout": {
            "rich_text": [{
              "type": "text",
              "text": { "content": "→ 이게 가장 먼저 되어야 개발할 때 기분이 좋습니다." }
            }],
            "icon": { "type": "emoji", "emoji": "💡" },
            "color": "gray_background"
          }
        }
      ]
    }
  },
  {
    "type": "toggle",
    "toggle": {
      "rich_text": [{
        "type": "text",
        "text": { "content": "Week 2: 옷장 채우기 (Product & DB)" },
        "annotations": { "bold": true }
      }],
      "children": [
        {
          "type": "to_do",
          "to_do": {
            "rich_text": [{ "type": "text", "text": { "content": "상품 테이블 생성 및 더미 데이터 입력" } }],
            "checked": false
          }
        },
        {
          "type": "to_do",
          "to_do": {
            "rich_text": [{ "type": "text", "text": { "content": "상품 상세 페이지 (이미지, 설명)" } }],
            "checked": false
          }
        },
        {
          "type": "to_do",
          "to_do": {
            "rich_text": [{ "type": "text", "text": { "content": "Supabase Auth 연동 (로그인/회원가입)" } }],
            "checked": false
          }
        }
      ]
    }
  },
  {
    "type": "toggle",
    "toggle": {
      "rich_text": [{
        "type": "text",
        "text": { "content": "Week 3: 마법 거울 (Size Tech)" },
        "annotations": { "bold": true }
      }],
      "children": [
        {
          "type": "to_do",
          "to_do": {
            "rich_text": [{ "type": "text", "text": { "content": "pgcrypto 활성화 및 신체 정보 입력 폼 제작" } }],
            "checked": false
          }
        },
        {
          "type": "to_do",
          "to_do": {
            "rich_text": [{ "type": "text", "text": { "content": "상세 페이지에 '사이즈 추천 로직' 함수 구현 및 UI 표시" } }],
            "checked": false
          }
        }
      ]
    }
  },
  {
    "type": "toggle",
    "toggle": {
      "rich_text": [{
        "type": "text",
        "text": { "content": "Week 4: 계산대 (Payment & Subscription)" },
        "annotations": { "bold": true }
      }],
      "children": [
        {
          "type": "to_do",
          "to_do": {
            "rich_text": [{ "type": "text", "text": { "content": "토스페이먼츠 개발자 센터 가입 및 API 키 발급" } }],
            "checked": false
          }
        },
        {
          "type": "to_do",
          "to_do": {
            "rich_text": [{ "type": "text", "text": { "content": "빌링키 발급 테스트" } }],
            "checked": false
          }
        },
        {
          "type": "to_do",
          "to_do": {
            "rich_text": [{ "type": "text", "text": { "content": "간단한 스케줄러 연동 테스트" } }],
            "checked": false
          }
        }
      ]
    }
  },
  {
    "type": "divider",
    "divider": {}
  }
]
```

### Design Rationale
- **Toggle blocks**: 각 주를 접고 펼 수 있게 하여 가독성 향상
- **To-do items**: 체크리스트로 진행 상황 추적 가능
- **Nested callout**: Toggle 내부에 팁이나 참고사항 추가
- **children array**: Toggle 내부 콘텐츠는 children으로 중첩

---

## 📊 Block Type Distribution (블록 타입 분포)

| Block Type | Count | Usage |
|-----------|-------|-------|
| `heading_1` | 5 | 섹션 제목 |
| `heading_2` | ~15 | 주요 주제 |
| `heading_3` | ~10 | 세부 항목 |
| `paragraph` | ~20 | 일반 텍스트 |
| `bulleted_list_item` | ~25 | 리스트 |
| `numbered_list_item` | ~10 | 순차 로직 |
| `code` | ~10 | 스키마, 컬러 코드 |
| `callout` | ~5 | 중요 정보 강조 |
| `toggle` | ~6 | 접을 수 있는 섹션 |
| `to_do` | ~10 | 체크리스트 |
| `quote` | ~3 | 인용, 메시지 |
| `divider` | 5 | 섹션 구분 |

**Total**: ~124 blocks

**Notion API Constraint**: 한 번에 100개까지만 전송 가능
**Solution**: 섹션 1-3을 첫 번째 배치(~50 blocks), 섹션 4-5를 두 번째 배치(~40 blocks)로 분할

---

## 🔐 Data Flow & Security (데이터 흐름 및 보안)

### Update Flow
```
1. 기존 페이지 읽기
   ↓
2. 기존 블록 백업 (선택적)
   ↓
3. 기존 블록 삭제 (Clean Slate) 또는 유지
   ↓
4. 새 블록 배치 1 전송 (섹션 1-3)
   ↓
5. 새 블록 배치 2 전송 (섹션 4-5)
   ↓
6. 검증 (모든 섹션 존재 확인)
```

### Error Handling
- **API 오류**: 섹션별로 나눠 전송하므로 일부 실패 시 재시도 가능
- **권한 오류**: Page ID 정확성 및 Notion integration 권한 확인
- **형식 오류**: 각 block의 rich_text 구조 검증 후 전송

---

## 🎯 Implementation Checklist (구현 체크리스트)

### Phase 1: Preparation
- [ ] Notion API 인증 확인
- [ ] Page ID 검증 (`2ac77770-ad42-8193-bd55-df8586d12aa7`)
- [ ] 기존 페이지 백업 (optional)

### Phase 2: Content Generation
- [ ] 섹션 1 블록 배열 생성
- [ ] 섹션 2 블록 배열 생성
- [ ] 섹션 3 블록 배열 생성
- [ ] 섹션 4 블록 배열 생성
- [ ] 섹션 5 블록 배열 생성

### Phase 3: API Execution
- [ ] 배치 1 전송 (섹션 1-3, ~50 blocks)
- [ ] 배치 2 전송 (섹션 4-5, ~40 blocks)
- [ ] 오류 처리 및 재시도

### Phase 4: Validation
- [ ] 페이지 재조회
- [ ] 5개 섹션 모두 존재 확인
- [ ] 주요 콘텐츠 샘플 검증

---

## 📐 JSON Schema Validation (JSON 스키마 검증)

### Sample Block Validation
```typescript
// TypeScript 타입 정의
interface NotionBlock {
  type: string
  [blockType: string]: {
    rich_text: RichText[]
    color?: string
    children?: NotionBlock[]
    // ... 기타 속성
  }
}

interface RichText {
  type: 'text'
  text: {
    content: string
    link?: { url: string } | null
  }
  annotations?: {
    bold?: boolean
    italic?: boolean
    code?: boolean
    color?: string
  }
}

// 검증 함수
function validateBlock(block: any): boolean {
  if (!block.type) return false
  if (!block[block.type]) return false
  if (!Array.isArray(block[block.type].rich_text)) return false
  // ... 추가 검증
  return true
}
```

---

## ✅ Success Criteria (성공 기준)

1. **구조 완결성**: 5개 섹션 모두 Notion에 정확히 반영
2. **서식 정확성**: Heading, Code, Callout, Toggle 등 올바른 블록 타입 사용
3. **가독성**: 컬러, Bold, Code 포맷 등으로 핵심 정보 강조
4. **기능성**: Toggle, To-do 등 인터랙티브 요소 정상 작동
5. **일관성**: 기존 CLAUDE.md와 정보 일치

---

**아키텍처 설계 완료**
**작성자**: Claude Code
**작성 일시**: 2025-11-19
**문서 버전**: v1.0
**상세 수준**: ⭐⭐⭐⭐⭐ (Implementation-ready)
