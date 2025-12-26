"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

const measurementsSchema = z.object({
    height: z.coerce.number().min(100, "키는 100cm 이상이어야 합니다").max(250, "키는 250cm 이하여야 합니다"),
    weight: z.coerce.number().optional(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
    topSize: z.string().optional(),
    bottomSize: z.string().optional(),
    shoeSize: z.coerce.number().min(200, "신발 사이즈는 200mm 이상이어야 합니다").max(320, "신발 사이즈는 320mm 이하여야 합니다"),
});

type MeasurementsValues = z.output<typeof measurementsSchema>;

export function MeasurementsForm() {
    const form = useForm<MeasurementsValues>({
        resolver: zodResolver(measurementsSchema) as never,
        defaultValues: {
            height: 0,
            shoeSize: 0,
        },
    });

    const onSubmit = (data: MeasurementsValues) => {
        console.log("Measurements updated:", data);
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="height">키 (cm)</Label>
                    <Input
                        id="height"
                        type="number"
                        {...form.register("height")}
                        className="rounded-xl border-border/50"
                    />
                    {form.formState.errors.height && (
                        <p className="text-sm text-destructive">{form.formState.errors.height.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="weight">몸무게 (kg)</Label>
                    <Input
                        id="weight"
                        type="number"
                        {...form.register("weight")}
                        className="rounded-xl border-border/50"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="shoeSize">신발 사이즈 (mm)</Label>
                <Input
                    id="shoeSize"
                    type="number"
                    {...form.register("shoeSize")}
                    className="rounded-xl border-border/50"
                />
                {form.formState.errors.shoeSize && (
                    <p className="text-sm text-destructive">{form.formState.errors.shoeSize.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="gender">성별</Label>
                <Select
                    onValueChange={(val) => form.setValue("gender", val as MeasurementsValues["gender"])}
                    defaultValue={form.getValues("gender")}
                >
                    <SelectTrigger className="rounded-xl border-border/50">
                        <SelectValue placeholder="선택해주세요" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="MALE">남성</SelectItem>
                        <SelectItem value="FEMALE">여성</SelectItem>
                        <SelectItem value="OTHER">기타</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Button type="submit" className="w-full rounded-xl premium h-12">
                저장
            </Button>
        </form>
    );
}
