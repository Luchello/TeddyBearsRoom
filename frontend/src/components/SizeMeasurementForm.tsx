"use client";

// ====================================
// TeddyBear's Room - Size Measurement Form
// User profile size input component
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

interface SizeMeasurementFormProps {
  initialData?: SizeMeasurements;
  onSave: (data: SizeMeasurements) => Promise<void>;
  isLoading?: boolean;
}

export default function SizeMeasurementForm({
  initialData,
  onSave,
  isLoading = false,
}: SizeMeasurementFormProps) {
  const [formData, setFormData] = useState<SizeMeasurements>({
    height: initialData?.height,
    weight: initialData?.weight,
    gender: initialData?.gender,
    topSize: initialData?.topSize,
    bottomSize: initialData?.bottomSize,
    shoeSize: initialData?.shoeSize,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.height !== undefined) {
      if (formData.height < 100 || formData.height > 250) {
        newErrors.height = "100cm ~ 250cm 사이로 입력해주세요";
      }
    }

    if (formData.weight !== undefined) {
      if (formData.weight < 30 || formData.weight > 200) {
        newErrors.weight = "30kg ~ 200kg 사이로 입력해주세요";
      }
    }

    if (formData.shoeSize !== undefined) {
      if (formData.shoeSize < 200 || formData.shoeSize > 320) {
        newErrors.shoeSize = "200mm ~ 320mm 사이로 입력해주세요";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSaving(true);
    try {
      await onSave(formData);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNumberChange = (
    field: "height" | "weight" | "shoeSize",
    value: string
  ) => {
    const numValue = value === "" ? undefined : parseInt(value, 10);
    setFormData((prev) => ({ ...prev, [field]: numValue }));
    // Clear error on change
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
          {/* Privacy Notice */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
            <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>
              입력하신 정보는 암호화되어 안전하게 저장되며, 사이즈 추천에만
              사용됩니다.
            </p>
          </div>

          {/* Basic Info Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Gender */}
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

          {/* Clothing Sizes Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Top Size */}
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

            {/* Bottom Size */}
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

            {/* Shoe Size */}
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

          {/* Submit Button */}
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
