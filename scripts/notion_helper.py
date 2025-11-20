#!/usr/bin/env python3
"""
Notion Helper Script - Lightweight Automation Layer
TeddyBear'sRoom 프로젝트를 위한 Notion API 직접 호출 도구

사용법:
    python scripts/notion_helper.py <command> [arguments]

환경변수:
    NOTION_API_KEY: Notion Integration API Key
"""

import os
import sys
import json
import requests
from typing import Dict, List, Optional, Any
from datetime import datetime

# Notion API 설정
NOTION_VERSION = "2022-06-28"
BASE_URL = "https://api.notion.com/v1"

class NotionHelper:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("NOTION_API_KEY")
        if not self.api_key:
            raise ValueError("NOTION_API_KEY가 설정되지 않았습니다. 환경변수를 확인하세요.")

        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Notion-Version": NOTION_VERSION,
            "Content-Type": "application/json"
        }

    def _request(self, method: str, endpoint: str, **kwargs) -> Dict:
        """Notion API 요청 헬퍼"""
        url = f"{BASE_URL}/{endpoint}"
        response = requests.request(method, url, headers=self.headers, **kwargs)
        response.raise_for_status()
        return response.json()

    # ========================================
    # 대용량 페이지 읽기 (Pagination 자동화)
    # ========================================

    def get_full_page_content(self, page_id: str, max_blocks: int = 1000) -> Dict:
        """
        페이지의 모든 block을 pagination으로 가져오기
        MCP의 token 제한을 우회

        Args:
            page_id: Notion page ID
            max_blocks: 최대 가져올 block 수 (안전장치)

        Returns:
            {
                "page": page_object,
                "blocks": [block_objects],
                "total_blocks": int
            }
        """
        print(f"📄 페이지 읽기 시작: {page_id}")

        # 1. 페이지 메타데이터 가져오기
        page = self._request("GET", f"pages/{page_id}")

        # 2. 모든 blocks 가져오기 (pagination)
        all_blocks = []
        cursor = None
        page_num = 1

        while len(all_blocks) < max_blocks:
            params = {"page_size": 100}
            if cursor:
                params["start_cursor"] = cursor

            response = self._request("GET", f"blocks/{page_id}/children", params=params)
            blocks = response.get("results", [])
            all_blocks.extend(blocks)

            print(f"  ├─ Page {page_num}: {len(blocks)} blocks 로딩됨")
            page_num += 1

            if not response.get("has_more"):
                break

            cursor = response.get("next_cursor")

        print(f"  └─ ✅ 총 {len(all_blocks)} blocks 로딩 완료\n")

        return {
            "page": page,
            "blocks": all_blocks,
            "total_blocks": len(all_blocks)
        }

    # ========================================
    # 대용량 콘텐츠 작성 (Batch Operations)
    # ========================================

    def append_blocks_batch(self, page_id: str, blocks: List[Dict], batch_size: int = 100) -> Dict:
        """
        많은 block을 batch로 나눠서 추가

        Args:
            page_id: 대상 page ID
            blocks: 추가할 block 객체 리스트
            batch_size: 한 번에 추가할 block 수

        Returns:
            {
                "success": bool,
                "total_added": int,
                "batches": int
            }
        """
        print(f"✍️  Block 추가 시작: {len(blocks)}개 blocks")

        total_added = 0
        batch_num = 1

        for i in range(0, len(blocks), batch_size):
            batch = blocks[i:i + batch_size]

            try:
                self._request(
                    "PATCH",
                    f"blocks/{page_id}/children",
                    json={"children": batch}
                )
                total_added += len(batch)
                print(f"  ├─ Batch {batch_num}: {len(batch)} blocks 추가됨")
                batch_num += 1
            except Exception as e:
                print(f"  ├─ ❌ Batch {batch_num} 실패: {e}")
                break

        print(f"  └─ ✅ 총 {total_added}개 blocks 추가 완료\n")

        return {
            "success": total_added == len(blocks),
            "total_added": total_added,
            "batches": batch_num - 1
        }

    # ========================================
    # 페이지 검색 (필터링 최적화)
    # ========================================

    def search_pages(self, query: str, filter_type: Optional[str] = None) -> List[Dict]:
        """
        페이지 검색 (제목 기반)

        Args:
            query: 검색어
            filter_type: "page" 또는 "database"로 필터링

        Returns:
            매칭되는 page 객체 리스트
        """
        print(f"🔍 검색 중: '{query}'")

        payload = {"query": query}
        if filter_type:
            payload["filter"] = {"property": "object", "value": filter_type}

        response = self._request("POST", "search", json=payload)
        results = response.get("results", [])

        print(f"  └─ ✅ {len(results)}개 결과 발견\n")

        return results

    # ========================================
    # 페이지 업데이트 (Property만)
    # ========================================

    def update_page_properties(self, page_id: str, properties: Dict) -> Dict:
        """
        페이지 property만 업데이트 (빠르고 가벼움)

        Args:
            page_id: 대상 page ID
            properties: 업데이트할 property 객체

        Returns:
            업데이트된 page 객체
        """
        print(f"🔄 페이지 property 업데이트: {page_id}")

        response = self._request(
            "PATCH",
            f"pages/{page_id}",
            json={"properties": properties}
        )

        print(f"  └─ ✅ Property 업데이트 완료\n")

        return response

    # ========================================
    # Block 삭제 (Batch)
    # ========================================

    def delete_blocks_batch(self, block_ids: List[str]) -> Dict:
        """
        여러 block을 일괄 삭제 (archive)

        Args:
            block_ids: 삭제할 block ID 리스트

        Returns:
            {
                "success": int,
                "failed": int
            }
        """
        print(f"🗑️  Block 삭제 시작: {len(block_ids)}개")

        success = 0
        failed = 0

        for block_id in block_ids:
            try:
                self._request(
                    "PATCH",
                    f"blocks/{block_id}",
                    json={"archived": True}
                )
                success += 1
                print(f"  ├─ ✅ {block_id[:8]}... 삭제됨")
            except Exception as e:
                failed += 1
                print(f"  ├─ ❌ {block_id[:8]}... 실패: {e}")

        print(f"  └─ 완료: {success}개 성공, {failed}개 실패\n")

        return {"success": success, "failed": failed}

    # ========================================
    # 유틸리티: Markdown → Notion Blocks 변환
    # ========================================

    def markdown_to_blocks(self, markdown_file: str) -> List[Dict]:
        """
        Markdown 파일을 Notion block 객체로 변환
        (간단한 변환만 지원: heading, paragraph, bullet list)

        Args:
            markdown_file: markdown 파일 경로

        Returns:
            Notion block 객체 리스트
        """
        with open(markdown_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        blocks = []

        for line in lines:
            line = line.rstrip()

            if not line:
                # 빈 줄은 paragraph로
                blocks.append({"type": "paragraph", "paragraph": {"rich_text": []}})

            elif line.startswith("### "):
                # Heading 3
                text = line[4:]
                blocks.append({
                    "type": "heading_3",
                    "heading_3": {
                        "rich_text": [{"type": "text", "text": {"content": text}}]
                    }
                })

            elif line.startswith("## "):
                # Heading 2
                text = line[3:]
                blocks.append({
                    "type": "heading_2",
                    "heading_2": {
                        "rich_text": [{"type": "text", "text": {"content": text}}]
                    }
                })

            elif line.startswith("# "):
                # Heading 1
                text = line[2:]
                blocks.append({
                    "type": "heading_1",
                    "heading_1": {
                        "rich_text": [{"type": "text", "text": {"content": text}}]
                    }
                })

            elif line.startswith("- "):
                # Bullet list
                text = line[2:]
                blocks.append({
                    "type": "bulleted_list_item",
                    "bulleted_list_item": {
                        "rich_text": [{"type": "text", "text": {"content": text}}]
                    }
                })

            else:
                # 일반 paragraph
                blocks.append({
                    "type": "paragraph",
                    "paragraph": {
                        "rich_text": [{"type": "text", "text": {"content": line}}]
                    }
                })

        return blocks


# ========================================
# CLI 인터페이스
# ========================================

def main():
    if len(sys.argv) < 2:
        print("사용법: python notion_helper.py <command> [arguments]")
        print("\n사용 가능한 명령:")
        print("  read <page_id>              - 페이지 전체 읽기")
        print("  search <query>              - 페이지 검색")
        print("  append <page_id> <md_file>  - Markdown 파일 내용 추가")
        print("  update <page_id> <json>     - Property 업데이트")
        sys.exit(1)

    command = sys.argv[1]
    helper = NotionHelper()

    try:
        if command == "read":
            page_id = sys.argv[2]
            result = helper.get_full_page_content(page_id)
            print(json.dumps(result, indent=2, ensure_ascii=False))

        elif command == "search":
            query = sys.argv[2]
            results = helper.search_pages(query)
            print(json.dumps(results, indent=2, ensure_ascii=False))

        elif command == "append":
            page_id = sys.argv[2]
            md_file = sys.argv[3]
            blocks = helper.markdown_to_blocks(md_file)
            result = helper.append_blocks_batch(page_id, blocks)
            print(json.dumps(result, indent=2, ensure_ascii=False))

        elif command == "update":
            page_id = sys.argv[2]
            properties = json.loads(sys.argv[3])
            result = helper.update_page_properties(page_id, properties)
            print(json.dumps(result, indent=2, ensure_ascii=False))

        else:
            print(f"알 수 없는 명령: {command}")
            sys.exit(1)

    except Exception as e:
        print(f"❌ 에러: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
