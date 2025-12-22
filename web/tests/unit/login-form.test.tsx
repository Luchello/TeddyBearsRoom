import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '@/components/auth/login-form';
import { signInWithSocial, type SocialProvider } from '@/lib/auth/social';

// Type for mocked function
type MockedSignIn = ReturnType<typeof vi.fn<(provider: SocialProvider, redirectUrl: string) => Promise<{ success: boolean; url?: string; error?: string }>>>;

// Mock the social auth lib
vi.mock('@/lib/auth/social', () => ({
    signInWithSocial: vi.fn(),
}));

const mockedSignIn = signInWithSocial as MockedSignIn;

describe('LoginForm Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render social login buttons', () => {
        render(<LoginForm />);

        expect(screen.getByText(/카카오로 계속하기/i)).toBeInTheDocument();
        expect(screen.getByText(/Google로 계속하기/i)).toBeInTheDocument();
    });

    it('should call signInWithSocial for Kakao', async () => {
        mockedSignIn.mockResolvedValue({ success: true, url: 'https://kakao.com/oauth' });

        render(<LoginForm />);

        const kakaoButton = screen.getByText(/카카오로 계속하기/i).closest('button')!;
        fireEvent.click(kakaoButton);

        await waitFor(() => {
            expect(signInWithSocial).toHaveBeenCalledWith('kakao', '/');
        });
    });

    it('should show error message on failure', async () => {
        mockedSignIn.mockResolvedValue({ success: false, error: '로그인에 실패했습니다' });

        render(<LoginForm />);

        const googleButton = screen.getByText(/Google로 계속하기/i).closest('button')!;
        fireEvent.click(googleButton);

        await waitFor(() => {
            expect(screen.getByText(/로그인에 실패했습니다/i)).toBeInTheDocument();
        });
    });
});
