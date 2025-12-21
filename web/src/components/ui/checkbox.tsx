/**
 * Checkbox Component
 * TeddyBear's Room Design System
 */

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, id, ...props }, ref) => {
    const generatedId = React.useId();
    const checkboxId = id || generatedId;

    return (
      <div className="flex items-start gap-3">
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            id={checkboxId}
            ref={ref}
            className={cn(
              "h-4 w-4 rounded border-2 border-input bg-background transition-colors",
              "checked:border-primary checked:bg-primary",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "accent-primary",
              error && "border-destructive",
              className
            )}
            {...props}
          />
        </div>
        {(label || description) && (
          <div className="flex flex-col gap-0.5">
            {label && (
              <label
                htmlFor={checkboxId}
                className={cn(
                  "text-sm font-medium leading-none cursor-pointer",
                  "peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

// Checkbox Group
interface CheckboxGroupProps {
  options: Array<{
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
  }>;
  value: string[];
  onChange: (value: string[]) => void;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

function CheckboxGroup({
  options,
  value,
  onChange,
  orientation = "vertical",
  className,
}: CheckboxGroupProps) {
  const handleChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      onChange([...value, optionValue]);
    } else {
      onChange(value.filter((v) => v !== optionValue));
    }
  };

  return (
    <div
      className={cn(
        "flex gap-4",
        orientation === "vertical" && "flex-col",
        orientation === "horizontal" && "flex-row flex-wrap",
        className
      )}
    >
      {options.map((option) => (
        <Checkbox
          key={option.value}
          label={option.label}
          description={option.description}
          checked={value.includes(option.value)}
          disabled={option.disabled}
          onChange={(e) => handleChange(option.value, e.target.checked)}
        />
      ))}
    </div>
  );
}

export { Checkbox, CheckboxGroup };
