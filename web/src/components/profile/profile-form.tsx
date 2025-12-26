"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const profileSchema = z.object({
    name: z.string().min(2, "이름은 2자 이상이어야 합니다"),
    email: z.string().email("유효한 이메일을 입력해주세요"),
});

type ProfileValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
    user?: {
        name?: string | null;
        email?: string | null;
    };
}

export function ProfileForm({ user }: ProfileFormProps) {
    const form = useForm<ProfileValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
        },
    });

    const onSubmit = (data: ProfileValues) => {
        console.log("Profile updated:", data);
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                    id="name"
                    {...form.register("name")}
                    className="rounded-xl border-border/50 focus:border-primary"
                />
                {form.formState.errors.name && (
                    <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                    id="email"
                    type="email"
                    {...form.register("email")}
                    readOnly
                    className="rounded-xl bg-muted/30 border-border/50"
                />
                {form.formState.errors.email && (
                    <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                )}
            </div>

            <Button type="submit" className="w-full rounded-xl premium h-12">
                저장
            </Button>
        </form>
    );
}
