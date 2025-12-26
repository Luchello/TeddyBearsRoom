import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProfileForm } from "@/components/profile/profile-form";
import { MeasurementsForm } from "@/components/profile/measurements-form";

describe("ProfileForm Component", () => {
    it("should render profile fields", () => {
        const mockUser = { name: "Test User", email: "test@example.com" };
        render(<ProfileForm user={mockUser} />);

        expect(screen.getByLabelText(/이름/i)).toHaveValue("Test User");
        expect(screen.getByLabelText(/이메일/i)).toHaveValue("test@example.com");
    });

    it("should validate name length", async () => {
        const mockUser = { name: "T", email: "test@example.com" };
        render(<ProfileForm user={mockUser} />);

        const saveButton = screen.getByRole("button", { name: /저장/i });
        fireEvent.click(saveButton);

        expect(await screen.findByText(/이름은 2자 이상이어야 합니다/i)).toBeInTheDocument();
    });
});

describe("MeasurementsForm Component", () => {
    it("should validate height range (100-250)", async () => {
        render(<MeasurementsForm />);

        const heightInput = screen.getByLabelText(/키/i);
        fireEvent.change(heightInput, { target: { value: "50" } });

        const saveButton = screen.getByRole("button", { name: /저장/i });
        fireEvent.click(saveButton);

        expect(await screen.findByText(/키는 100cm 이상이어야 합니다/i)).toBeInTheDocument();

        fireEvent.change(heightInput, { target: { value: "300" } });
        fireEvent.click(saveButton);
        expect(await screen.findByText(/키는 250cm 이하여야 합니다/i)).toBeInTheDocument();
    });

    it("should validate shoe size range (200-320)", async () => {
        render(<MeasurementsForm />);

        const shoeSizeInput = screen.getByLabelText(/신발 사이즈/i);
        fireEvent.change(shoeSizeInput, { target: { value: "150" } });

        const saveButton = screen.getByRole("button", { name: /저장/i });
        fireEvent.click(saveButton);

        expect(await screen.findByText(/신발 사이즈는 200mm 이상이어야 합니다/i)).toBeInTheDocument();

        fireEvent.change(shoeSizeInput, { target: { value: "400" } });
        fireEvent.click(saveButton);
        expect(await screen.findByText(/신발 사이즈는 320mm 이하여야 합니다/i)).toBeInTheDocument();
    });
});
