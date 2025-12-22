import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RegisterForm } from '@/components/auth/register-form';

describe('RegisterForm Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should render registration form first', () => {
            render(<RegisterForm />);

            expect(screen.getByText(/회원가입/)).toBeInTheDocument();
            expect(screen.getByLabelText(/이메일/)).toBeInTheDocument();
        });

        it('should render all form fields', () => {
            render(<RegisterForm />);

            expect(document.getElementById('email')).toBeInTheDocument();
            expect(document.getElementById('password')).toBeInTheDocument();
            expect(document.getElementById('passwordConfirm')).toBeInTheDocument();
            expect(document.getElementById('name')).toBeInTheDocument();
            expect(document.getElementById('phone')).toBeInTheDocument();
        });

        it('should render agreement checkboxes', () => {
            render(<RegisterForm />);

            expect(screen.getByLabelText(/전체 동의/)).toBeInTheDocument();
            expect(screen.getByLabelText(/이용약관 동의/)).toBeInTheDocument();
            expect(screen.getByLabelText(/개인정보처리방침 동의/)).toBeInTheDocument();
            expect(screen.getByLabelText(/마케팅 정보 수신 동의/)).toBeInTheDocument();
        });

        it('should render social login buttons', () => {
            render(<RegisterForm />);

            const socialButtons = screen.getAllByRole('button', { name: '' });
            // At least 3 social buttons (Kakao, Naver, Google)
            expect(socialButtons.length).toBeGreaterThanOrEqual(3);
        });
    });

    describe('Password Validation', () => {
        it('should show error if passwords do not match', async () => {
            render(<RegisterForm />);

            const passwordInput = document.getElementById('password') as HTMLInputElement;
            const confirmInput = document.getElementById('passwordConfirm') as HTMLInputElement;

            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.change(confirmInput, { target: { value: 'different' } });

            await waitFor(() => {
                expect(screen.getByText(/비밀번호가 일치하지 않습니다/)).toBeInTheDocument();
            });
        });

        it('should show error if password is less than 8 characters', async () => {
            render(<RegisterForm />);

            const passwordInput = document.getElementById('password') as HTMLInputElement;
            fireEvent.change(passwordInput, { target: { value: 'short' } });

            await waitFor(() => {
                expect(screen.getByText(/비밀번호는 8자 이상이어야 합니다/)).toBeInTheDocument();
            });
        });

        it('should not show password error for valid password', async () => {
            render(<RegisterForm />);

            const passwordInput = document.getElementById('password') as HTMLInputElement;
            fireEvent.change(passwordInput, { target: { value: 'validpassword123' } });

            await waitFor(() => {
                expect(screen.queryByText(/비밀번호는 8자 이상이어야 합니다/)).not.toBeInTheDocument();
            });
        });
    });

    describe('Agreement Checkboxes', () => {
        it('should check all agreements when "전체 동의" is clicked', async () => {
            render(<RegisterForm />);

            const allAgreeCheckbox = screen.getByLabelText(/전체 동의/);
            fireEvent.click(allAgreeCheckbox);

            await waitFor(() => {
                expect(screen.getByLabelText(/이용약관 동의/)).toBeChecked();
                expect(screen.getByLabelText(/개인정보처리방침 동의/)).toBeChecked();
                expect(screen.getByLabelText(/마케팅 정보 수신 동의/)).toBeChecked();
            });
        });

        it('should uncheck all agreements when "전체 동의" is unchecked', async () => {
            render(<RegisterForm />);

            const allAgreeCheckbox = screen.getByLabelText(/전체 동의/);
            // Check all first
            fireEvent.click(allAgreeCheckbox);
            // Then uncheck
            fireEvent.click(allAgreeCheckbox);

            await waitFor(() => {
                expect(screen.getByLabelText(/이용약관 동의/)).not.toBeChecked();
                expect(screen.getByLabelText(/개인정보처리방침 동의/)).not.toBeChecked();
                expect(screen.getByLabelText(/마케팅 정보 수신 동의/)).not.toBeChecked();
            });
        });
    });

    describe('Form Submission', () => {
        it('should disable submit button when required fields are empty', () => {
            render(<RegisterForm />);

            const submitButton = screen.getByRole('button', { name: /다음 단계/ });
            expect(submitButton).toBeDisabled();
        });

        it('should enable submit button when all required fields are filled', async () => {
            render(<RegisterForm />);

            const emailInput = document.getElementById('email') as HTMLInputElement;
            const passwordInput = document.getElementById('password') as HTMLInputElement;
            const passwordConfirmInput = document.getElementById('passwordConfirm') as HTMLInputElement;
            const nameInput = document.getElementById('name') as HTMLInputElement;

            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.change(passwordConfirmInput, { target: { value: 'password123' } });
            fireEvent.change(nameInput, { target: { value: 'Test User' } });

            fireEvent.click(screen.getByLabelText(/이용약관 동의/));
            fireEvent.click(screen.getByLabelText(/개인정보처리방침 동의/));

            await waitFor(() => {
                const submitButton = screen.getByRole('button', { name: /다음 단계/ });
                expect(submitButton).not.toBeDisabled();
            });
        });

        it('should move to adult verification step after valid form submission', async () => {
            render(<RegisterForm />);

            const emailInput = document.getElementById('email') as HTMLInputElement;
            const passwordInput = document.getElementById('password') as HTMLInputElement;
            const passwordConfirmInput = document.getElementById('passwordConfirm') as HTMLInputElement;
            const nameInput = document.getElementById('name') as HTMLInputElement;

            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.change(passwordConfirmInput, { target: { value: 'password123' } });
            fireEvent.change(nameInput, { target: { value: 'Test User' } });

            fireEvent.click(screen.getByLabelText(/이용약관 동의/));
            fireEvent.click(screen.getByLabelText(/개인정보처리방침 동의/));

            const submitButton = screen.getByRole('button', { name: /다음 단계/ });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('성인인증')).toBeInTheDocument();
            }, { timeout: 3000 });
        });
    });

    describe('Adult Verification Step', () => {
        const fillAndSubmitForm = async () => {
            const emailInput = document.getElementById('email') as HTMLInputElement;
            const passwordInput = document.getElementById('password') as HTMLInputElement;
            const passwordConfirmInput = document.getElementById('passwordConfirm') as HTMLInputElement;
            const nameInput = document.getElementById('name') as HTMLInputElement;

            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.change(passwordConfirmInput, { target: { value: 'password123' } });
            fireEvent.change(nameInput, { target: { value: 'Test User' } });

            fireEvent.click(screen.getByLabelText(/이용약관 동의/));
            fireEvent.click(screen.getByLabelText(/개인정보처리방침 동의/));

            const submitButton = screen.getByRole('button', { name: /다음 단계/ });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('성인인증')).toBeInTheDocument();
            }, { timeout: 3000 });
        };

        it('should render PASS verification button', async () => {
            render(<RegisterForm />);
            await fillAndSubmitForm();

            expect(screen.getByRole('button', { name: /PASS 본인인증/ })).toBeInTheDocument();
        });

        it('should render back button to return to form', async () => {
            render(<RegisterForm />);
            await fillAndSubmitForm();

            expect(screen.getByRole('button', { name: /이전 단계로/ })).toBeInTheDocument();
        });

        it('should return to form when back button is clicked', async () => {
            render(<RegisterForm />);
            await fillAndSubmitForm();

            const backButton = screen.getByRole('button', { name: /이전 단계로/ });
            fireEvent.click(backButton);

            await waitFor(() => {
                expect(screen.getByText(/회원가입/)).toBeInTheDocument();
            });
        });

        it('should call onSubmit when verification is completed', async () => {
            const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
            render(<RegisterForm onSubmit={mockOnSubmit} />);
            await fillAndSubmitForm();

            const verifyButton = screen.getByRole('button', { name: /PASS 본인인증/ });
            fireEvent.click(verifyButton);

            await waitFor(() => {
                expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
                    email: 'test@example.com',
                    name: 'Test User',
                }));
            });
        });

        it('should show error message when verification fails', async () => {
            const mockOnSubmit = vi.fn().mockRejectedValue(new Error('Verification failed'));
            render(<RegisterForm onSubmit={mockOnSubmit} />);
            await fillAndSubmitForm();

            const verifyButton = screen.getByRole('button', { name: /PASS 본인인증/ });
            fireEvent.click(verifyButton);

            await waitFor(() => {
                expect(screen.getByText(/본인인증에 실패했습니다/)).toBeInTheDocument();
            });
        });
    });
});
