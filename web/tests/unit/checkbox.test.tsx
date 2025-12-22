/**
 * Checkbox Component Unit Tests
 * TDD: Testing Checkbox and CheckboxGroup for TeddyBear's Room
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox, CheckboxGroup } from '@/components/ui/checkbox';

describe('Checkbox Component', () => {
    describe('Basic Rendering', () => {
        it('should render a checkbox input', () => {
            render(<Checkbox />);
            expect(screen.getByRole('checkbox')).toBeInTheDocument();
        });

        it('should render with label', () => {
            render(<Checkbox label="Accept terms" />);
            expect(screen.getByText('Accept terms')).toBeInTheDocument();
        });

        it('should render with description', () => {
            render(<Checkbox description="This is a description" />);
            expect(screen.getByText('This is a description')).toBeInTheDocument();
        });

        it('should render with both label and description', () => {
            render(
                <Checkbox
                    label="Newsletter"
                    description="Receive updates about new products"
                />
            );
            expect(screen.getByText('Newsletter')).toBeInTheDocument();
            expect(screen.getByText('Receive updates about new products')).toBeInTheDocument();
        });
    });

    describe('Interaction', () => {
        it('should be unchecked by default', () => {
            render(<Checkbox />);
            expect(screen.getByRole('checkbox')).not.toBeChecked();
        });

        it('should check when clicked', () => {
            render(<Checkbox />);
            const checkbox = screen.getByRole('checkbox');

            fireEvent.click(checkbox);
            expect(checkbox).toBeChecked();
        });

        it('should uncheck when clicked again', () => {
            render(<Checkbox defaultChecked />);
            const checkbox = screen.getByRole('checkbox');

            expect(checkbox).toBeChecked();
            fireEvent.click(checkbox);
            expect(checkbox).not.toBeChecked();
        });

        it('should call onChange handler', () => {
            const handleChange = vi.fn();
            render(<Checkbox onChange={handleChange} />);

            fireEvent.click(screen.getByRole('checkbox'));
            expect(handleChange).toHaveBeenCalledTimes(1);
        });

        it('should toggle when clicking label', () => {
            render(<Checkbox label="Click me" />);

            const label = screen.getByText('Click me');
            const checkbox = screen.getByRole('checkbox');

            fireEvent.click(label);
            expect(checkbox).toBeChecked();
        });
    });

    describe('States', () => {
        it('should be disabled when disabled prop is set', () => {
            render(<Checkbox disabled />);
            expect(screen.getByRole('checkbox')).toBeDisabled();
        });

        it('should not change when disabled and clicked', () => {
            render(<Checkbox disabled />);
            const checkbox = screen.getByRole('checkbox');

            fireEvent.click(checkbox);
            expect(checkbox).not.toBeChecked();
        });

        it('should apply error styling', () => {
            render(<Checkbox error />);
            const checkbox = screen.getByRole('checkbox');

            expect(checkbox).toHaveClass('border-destructive');
        });
    });

    describe('Accessibility', () => {
        it('should associate label with checkbox via id', () => {
            render(<Checkbox id="terms" label="Terms" />);
            const checkbox = screen.getByRole('checkbox');
            const label = screen.getByText('Terms');

            expect(checkbox).toHaveAttribute('id', 'terms');
            expect(label).toHaveAttribute('for', 'terms');
        });

        it('should generate unique id when not provided', () => {
            render(<Checkbox label="Auto ID" />);
            const checkbox = screen.getByRole('checkbox');

            expect(checkbox).toHaveAttribute('id');
            expect(checkbox.id).toBeTruthy();
        });
    });

    describe('Custom Props', () => {
        it('should accept custom className', () => {
            render(<Checkbox className="custom-class" />);
            expect(screen.getByRole('checkbox')).toHaveClass('custom-class');
        });

        it('should forward ref to input element', () => {
            const ref = vi.fn();
            render(<Checkbox ref={ref} />);

            expect(ref).toHaveBeenCalled();
        });

        it('should accept name attribute', () => {
            render(<Checkbox name="myCheckbox" />);
            expect(screen.getByRole('checkbox')).toHaveAttribute('name', 'myCheckbox');
        });

        it('should accept value attribute', () => {
            render(<Checkbox value="yes" />);
            expect(screen.getByRole('checkbox')).toHaveAttribute('value', 'yes');
        });
    });
});

describe('CheckboxGroup Component', () => {
    const options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
    ];

    describe('Rendering', () => {
        it('should render all options', () => {
            render(<CheckboxGroup options={options} value={[]} onChange={() => {}} />);

            expect(screen.getByText('Option 1')).toBeInTheDocument();
            expect(screen.getByText('Option 2')).toBeInTheDocument();
            expect(screen.getByText('Option 3')).toBeInTheDocument();
        });

        it('should render with descriptions', () => {
            const optionsWithDesc = [
                { value: 'a', label: 'A', description: 'Description A' },
                { value: 'b', label: 'B', description: 'Description B' },
            ];
            render(<CheckboxGroup options={optionsWithDesc} value={[]} onChange={() => {}} />);

            expect(screen.getByText('Description A')).toBeInTheDocument();
            expect(screen.getByText('Description B')).toBeInTheDocument();
        });

        it('should render in vertical orientation by default', () => {
            const { container } = render(
                <CheckboxGroup options={options} value={[]} onChange={() => {}} />
            );

            expect(container.firstChild).toHaveClass('flex-col');
        });

        it('should render in horizontal orientation', () => {
            const { container } = render(
                <CheckboxGroup
                    options={options}
                    value={[]}
                    onChange={() => {}}
                    orientation="horizontal"
                />
            );

            expect(container.firstChild).toHaveClass('flex-row');
        });
    });

    describe('Selection', () => {
        it('should check selected values', () => {
            render(
                <CheckboxGroup
                    options={options}
                    value={['option1', 'option3']}
                    onChange={() => {}}
                />
            );

            const checkboxes = screen.getAllByRole('checkbox');
            expect(checkboxes[0]).toBeChecked();
            expect(checkboxes[1]).not.toBeChecked();
            expect(checkboxes[2]).toBeChecked();
        });

        it('should call onChange with added value when unchecked item is clicked', () => {
            const handleChange = vi.fn();
            render(
                <CheckboxGroup
                    options={options}
                    value={['option1']}
                    onChange={handleChange}
                />
            );

            const checkboxes = screen.getAllByRole('checkbox');
            fireEvent.click(checkboxes[1]); // Click option2

            expect(handleChange).toHaveBeenCalledWith(['option1', 'option2']);
        });

        it('should call onChange with removed value when checked item is clicked', () => {
            const handleChange = vi.fn();
            render(
                <CheckboxGroup
                    options={options}
                    value={['option1', 'option2']}
                    onChange={handleChange}
                />
            );

            const checkboxes = screen.getAllByRole('checkbox');
            fireEvent.click(checkboxes[0]); // Uncheck option1

            expect(handleChange).toHaveBeenCalledWith(['option2']);
        });

        it('should handle selecting all options', () => {
            const handleChange = vi.fn();
            render(
                <CheckboxGroup
                    options={options}
                    value={['option1', 'option2']}
                    onChange={handleChange}
                />
            );

            const checkboxes = screen.getAllByRole('checkbox');
            fireEvent.click(checkboxes[2]); // Click option3

            expect(handleChange).toHaveBeenCalledWith(['option1', 'option2', 'option3']);
        });
    });

    describe('Disabled Options', () => {
        it('should disable individual options', () => {
            const optionsWithDisabled = [
                { value: 'a', label: 'A' },
                { value: 'b', label: 'B', disabled: true },
                { value: 'c', label: 'C' },
            ];
            render(
                <CheckboxGroup
                    options={optionsWithDisabled}
                    value={[]}
                    onChange={() => {}}
                />
            );

            const checkboxes = screen.getAllByRole('checkbox');
            expect(checkboxes[0]).not.toBeDisabled();
            expect(checkboxes[1]).toBeDisabled();
            expect(checkboxes[2]).not.toBeDisabled();
        });

        it('should not call onChange when disabled option is clicked', () => {
            const handleChange = vi.fn();
            const optionsWithDisabled = [
                { value: 'a', label: 'A', disabled: true },
            ];
            render(
                <CheckboxGroup
                    options={optionsWithDisabled}
                    value={[]}
                    onChange={handleChange}
                />
            );

            const checkbox = screen.getByRole('checkbox');
            fireEvent.click(checkbox);

            expect(handleChange).not.toHaveBeenCalled();
        });
    });

    describe('Custom Styling', () => {
        it('should accept custom className', () => {
            const { container } = render(
                <CheckboxGroup
                    options={options}
                    value={[]}
                    onChange={() => {}}
                    className="custom-group"
                />
            );

            expect(container.firstChild).toHaveClass('custom-group');
        });
    });
});
