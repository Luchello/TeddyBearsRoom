"use client";

// ====================================
// TeddyBear's Room - SizeMeasurementForm 컴포넌트
// 사용자 신체정보 측정 입력 폼 (암호화 저장)
// ====================================
//
// 🎯 용도:
// - 사용자 신체정보 (키, 몸무게, 성별, 의류 사이즈, 신발 사이즈) 입력
// - 스마트 사이즈 추천 시스템의 기초 데이터 수집
// - pgcrypto DB 레벨 암호화로 개인정보 보호 (Privacy-First)
// - 프로필 페이지 또는 초기 설정 화면에서 사용
//
// 📦 구조:
// - CardHeader: 아이콘 + 제목 + 설명
// - Privacy Notice: 암호화 저장 안내
// - Form Grid: 3개 섹션
//   1. Basic Info: 성별, 키(cm), 몸무게(kg)
//   2. Clothing: 상의/하의 사이즈 (Select)
//   3. Footwear: 신발 사이즈 (Select - SIZE_MAPPINGS.shoes.mm)
// - Submit Button: 저장하기 (로딩 상태 표시)
//
// 🎨 디자인:
// - Card: rounded-2xl, border-border
// - FormLayout: grid cols-1 sm:cols-3 (모바일 1컬럼, 태블릿 3컬럼)
// - Icons: Ruler, Weight, Shirt, User, Footprints, Save, Loader2, Lock
// - Validation: Input border-destructive + error message (red text)
// - Privacy Notice: bg-muted/50 + Lock icon
//
// 🔧 주요 기능:
// - validate(): 범위 검증 (키 100~250, 몸무게 30~200, 신발 200~320mm)
// - handleNumberChange: 숫자 입력 + 에러 자동 클리어
// - handleSubmit: 폼 제출 + onSave 콜백 실행 + 로딩 상태 관리
// - initialData: 기존 데이터 수정 모드 지원
//
// 📝 의존성:
// - shadcn/ui: Card, Button, Input, Label, Select
// - lucide-react: Ruler, Weight, Shirt, User, Footprints, Save, Loader2, Lock
// - React: useState
// - lib/types: SizeMeasurements, Gender
// - lib/encryption: SIZE_MAPPINGS (신발 사이즈 옵션)
// ====================================

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Ruler, Weight, Shirt, User, Footprints, Save, Loader2, Lock } from "lucide-react";
import type { SizeMeasurements, Gender } from "@/lib/types";
import { SIZE_MAPPINGS } from "@/lib/encryption";

// ──────────────────────────────────────
// Props 타입 정의
// ──────────────────────────────────────

interface SizeMeasurementFormProps {
  /** 기존 신체정보 데이터 (수정 모드 시 전달) */
  initialData?: SizeMeasurements;
  /** 폼 제출 시 호출되는 콜백 함수 (서버 저장 처리) */
  onSave: (data: SizeMeasurements) => Promise<void>;
  /** 외부에서의 로딩 상태 (true면 submit 비활성화) */
  isLoading?: boolean;
}

// ──────────────────────────────────────
// SizeMeasurementForm 컴포넌트
// ──────────────────────────────────────

/**
 * 사용자 신체정보 입력 폼 컴포넌트
 *
 * @description
 * 사용자의 신체정보(키, 몸무게, 성별, 의류 사이즈, 신발 사이즈)를 입력받는 폼입니다.
 * - 초기 데이터가 있으면 수정 모드, 없으면 신규 입력 모드
 * - 각 필드에 대한 범위 검증 (키 100~250cm, 몸무게 30~200kg 등)
 * - 폼 제출 시 onSave 콜백으로 서버 저장 처리
 * - pgcrypto 암호화로 DB 레벨에서 개인정보 보호
 *
 * @param initialData - 기존 신체정보 (수정 모드)
 * @param onSave - 폼 제출 시 호출되는 서버 저장 함수
 * @param isLoading - 외부 로딩 상태
 *
 * @example
 * const [formData, setFormData] = useState<SizeMeasurements>({...});
 * <SizeMeasurementForm
 *   initialData={user.sizeMeasurements}
 *   onSave={async (data) => {
 *     const result = await saveSizeInfo(data);
 *     if (result.success) toast.success("저장되었어요!");
 *   }}
 * />
 */
export default function SizeMeasurementForm({
  initialData,
  onSave,
  isLoading = false,
}: SizeMeasurementFormProps) {
  // ──────────────────────────────────────
  // 폼 상태 관리
  // ──────────────────────────────────────
  /** 폼 데이터 (키, 몸무게, 성별, 사이즈) */
  const [formData, setFormData] = useState<SizeMeasurements>({
    height: initialData?.height,
    weight: initialData?.weight,
    gender: initialData?.gender,
    topSize: initialData?.topSize,
    bottomSize: initialData?.bottomSize,
    shoeSize: initialData?.shoeSize,
  });

  /** 필드별 에러 메시지 */
  const [errors, setErrors] = useState<Record<string, string>>({});
  /** 저장 중 로딩 상태 */
  const [isSaving, setIsSaving] = useState(false);

  // ──────────────────────────────────────
  // 폼 검증 함수
  // ──────────────────────────────────────
  /**
   * 입력값 범위 검증 함수
   * - 키: 100cm ~ 250cm
   * - 몸무게: 30kg ~ 200kg
   * - 신발: 200mm ~ 320mm
   * @returns 검증 통과 여부
   */
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 키 범위 검증 (100~250cm)
    if (formData.height !== undefined) {
      if (formData.height < 100 || formData.height > 250) {
        newErrors.height = "100cm ~ 250cm 사이로 입력해주세요";
      }
    }

    // 몸무게 범위 검증 (30~200kg)
    if (formData.weight !== undefined) {
      if (formData.weight < 30 || formData.weight > 200) {
        newErrors.weight = "30kg ~ 200kg 사이로 입력해주세요";
      }
    }

    // 신발 사이즈 범위 검증 (200~320mm)
    if (formData.shoeSize !== undefined) {
      if (formData.shoeSize < 200 || formData.shoeSize > 320) {
        newErrors.shoeSize = "200mm ~ 320mm 사이로 입력해주세요";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ──────────────────────────────────────
  // 폼 제출 핸들러
  // ──────────────────────────────────────
  /**
   * 폼 제출 시 호출되는 핸들러
   * 1. 검증 수행
   * 2. 유효하면 onSave 콜백으로 서버 저장 처리
   * 3. 저장 완료 후 로딩 상태 해제
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 검증 실패 시 조기 반환
    if (!validate()) return;

    setIsSaving(true);
    try {
      // 부모 컴포넌트에서 제공한 onSave 콜백 실행 (서버 저장)
      await onSave(formData);
    } finally {
      setIsSaving(false);
    }
  };

  // ──────────────────────────────────────
  // 숫자 입력 핸들러
  // ──────────────────────────────────────
  /**
   * 숫자 필드 (키, 몸무게, 신발) 값 변경 핸들러
   * - 빈 문자열이면 undefined로 설정 (선택사항)
   * - 입력값을 정수로 파싱
   * - 필드 변경 시 해당 필드의 에러 메시지 자동 클리어
   */
  const handleNumberChange = (
    field: "height" | "weight" | "shoeSize",
    value: string
  ) => {
    // 빈 문자열이면 undefined, 아니면 정수로 변환
    const numValue = value === "" ? undefined : parseInt(value, 10);
    setFormData((prev) => ({ ...prev, [field]: numValue }));

    // 입력 중 에러 메시지 자동 제거 (UX 개선)
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Card className="rounded-2xl border-border">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Ruler className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">나의 사이즈 정보</CardTitle>
            <CardDescription>
              사이즈 추천을 위한 정보를 입력해주세요
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ─────────────────────────────────────
              프라이버시 공지 (암호화 저장 안내)
              ───────────────────────────────────── */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
            <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>
              입력하신 정보는 암호화되어 안전하게 저장되며, 사이즈 추천에만
              사용됩니다.
            </p>
          </div>

          {/* ─────────────────────────────────────
              기본 정보 입력 섹션 (성별, 키, 몸무게)
              모바일: 1컬럼 | 태블릿: 3컬럼
              ───────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 성별 선택 (Select) */}
            <div className="space-y-2">
              <Label htmlFor="gender" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                성별
              </Label>
              <Select
                value={formData.gender || ""}
                onValueChange={(value: string) =>
                  setFormData((prev) => ({ ...prev, gender: value as Gender }))
                }
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">남성</SelectItem>
                  <SelectItem value="FEMALE">여성</SelectItem>
                  <SelectItem value="OTHER">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Height */}
            <div className="space-y-2">
              <Label htmlFor="height" className="flex items-center gap-2">
                <Ruler className="w-4 h-4" />키 (cm)
              </Label>
              <Input
                id="height"
                type="number"
                placeholder="170"
                value={formData.height ?? ""}
                onChange={(e) => handleNumberChange("height", e.target.value)}
                min={100}
                max={250}
                className={errors.height ? "border-destructive" : ""}
              />
              {errors.height && (
                <p className="text-xs text-destructive">{errors.height}</p>
              )}
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <Label htmlFor="weight" className="flex items-center gap-2">
                <Weight className="w-4 h-4" />
                몸무게 (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                placeholder="65"
                value={formData.weight ?? ""}
                onChange={(e) => handleNumberChange("weight", e.target.value)}
                min={30}
                max={200}
                className={errors.weight ? "border-destructive" : ""}
              />
              {errors.weight && (
                <p className="text-xs text-destructive">{errors.weight}</p>
              )}
            </div>
          </div>

          {/* ─────────────────────────────────────
              의류 사이즈 입력 섹션 (상의, 하의)
              모바일: 1컬럼 | 태블릿: 3컬럼
              ───────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 상의 사이즈 (XS, S, M, L, XL, XXL) */}
            <div className="space-y-2">
              <Label htmlFor="topSize" className="flex items-center gap-2">
                <Shirt className="w-4 h-4" />
                상의 사이즈
              </Label>
              <Select
                value={formData.topSize || ""}
                onValueChange={(value: string) =>
                  setFormData((prev) => ({ ...prev, topSize: value }))
                }
              >
                <SelectTrigger id="topSize">
                  <SelectValue placeholder="선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="XS">XS (85)</SelectItem>
                  <SelectItem value="S">S (90)</SelectItem>
                  <SelectItem value="M">M (95)</SelectItem>
                  <SelectItem value="L">L (100)</SelectItem>
                  <SelectItem value="XL">XL (105)</SelectItem>
                  <SelectItem value="XXL">XXL (110)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 하의 사이즈 (26인치, 28인치, 30인치, 32인치, 34인치, 36인치) */}
            <div className="space-y-2">
              <Label htmlFor="bottomSize" className="flex items-center gap-2">
                <Shirt className="w-4 h-4 rotate-180" />
                하의 사이즈
              </Label>
              <Select
                value={formData.bottomSize || ""}
                onValueChange={(value: string) =>
                  setFormData((prev) => ({ ...prev, bottomSize: value }))
                }
              >
                <SelectTrigger id="bottomSize">
                  <SelectValue placeholder="선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="26">26인치 (XS)</SelectItem>
                  <SelectItem value="28">28인치 (S)</SelectItem>
                  <SelectItem value="30">30인치 (M)</SelectItem>
                  <SelectItem value="32">32인치 (L)</SelectItem>
                  <SelectItem value="34">34인치 (XL)</SelectItem>
                  <SelectItem value="36">36인치 (XXL)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 신발 사이즈 (200mm ~ 320mm, SIZE_MAPPINGS.shoes.mm 사용) */}
            <div className="space-y-2">
              <Label htmlFor="shoeSize" className="flex items-center gap-2">
                <Footprints className="w-4 h-4" />
                신발 사이즈 (mm)
              </Label>
              <Select
                value={formData.shoeSize?.toString() || ""}
                onValueChange={(value: string) =>
                  setFormData((prev) => ({
                    ...prev,
                    shoeSize: parseInt(value, 10),
                  }))
                }
              >
                <SelectTrigger id="shoeSize">
                  <SelectValue placeholder="선택" />
                </SelectTrigger>
                <SelectContent>
                  {SIZE_MAPPINGS.shoes.mm.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}mm
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ─────────────────────────────────────
              제출 버튼
              로딩 중일 때 비활성화, 스피너 표시
              ───────────────────────────────────── */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isSaving || isLoading}
              className="min-w-[120px]"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  저장 중...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  저장하기
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
