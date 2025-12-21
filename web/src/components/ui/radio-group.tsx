/**
 * Radio Group Component
 * TeddyBear's Room Design System
 */

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface RadioGroupContextValue {
  name: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(
  null
);

interface RadioGroupProps {
  name?: string;
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  orientation?: "horizontal" | "vertical";
  className?: string;
  children: React.ReactNode;
}

function RadioGroup({
  name,
  value,
  onValueChange,
  disabled,
  orientation = "vertical",
  className,
  children,
}: RadioGroupProps) {
  const generatedName = React.useId();
  const radioName = name || generatedName;

  return (
    <RadioGroupContext.Provider
      value={{
        name: radioName,
        value,
        onChange: onValueChange,
        disabled,
      }}
    >
      <div
        role="radiogroup"
        className={cn(
          "flex gap-4",
          orientation === "vertical" && "flex-col",
          orientation === "horizontal" && "flex-row flex-wrap",
          className
        )}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

interface RadioGroupItemProps {
  value: string;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

function RadioGroupItem({
  value,
  label,
  description,
  disabled: itemDisabled,
  className,
}: RadioGroupItemProps) {
  const context = React.useContext(RadioGroupContext);
  if (!context) {
    throw new Error("RadioGroupItem must be used within a RadioGroup");
  }

  const { name, value: groupValue, onChange, disabled: groupDisabled } = context;
  const isDisabled = itemDisabled || groupDisabled;
  const isChecked = groupValue === value;
  const id = `${name}-${value}`;

  return (
    <div className={cn("flex items-start gap-3", className)}>
      <div className="flex items-center h-5">
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={isChecked}
          disabled={isDisabled}
          onChange={() => onChange(value)}
          className={cn(
            "h-4 w-4 border-2 border-input bg-background transition-colors",
            "checked:border-primary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "accent-primary"
          )}
        />
      </div>
      {(label || description) && (
        <div className="flex flex-col gap-0.5">
          {label && (
            <label
              htmlFor={id}
              className={cn(
                "text-sm font-medium leading-none cursor-pointer",
                isDisabled && "cursor-not-allowed opacity-70"
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

// Card style radio for payment/shipping selection
interface RadioCardProps {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

function RadioCard({
  value,
  label,
  description,
  icon,
  disabled: itemDisabled,
  className,
}: RadioCardProps) {
  const context = React.useContext(RadioGroupContext);
  if (!context) {
    throw new Error("RadioCard must be used within a RadioGroup");
  }

  const { name, value: groupValue, onChange, disabled: groupDisabled } = context;
  const isDisabled = itemDisabled || groupDisabled;
  const isChecked = groupValue === value;
  const id = `${name}-${value}`;

  return (
    <label
      htmlFor={id}
      className={cn(
        "relative flex items-center gap-4 rounded-xl border-2 p-4 cursor-pointer transition-all",
        isChecked
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50",
        isDisabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={isChecked}
        disabled={isDisabled}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      {icon && (
        <div className="flex-shrink-0 text-muted-foreground">{icon}</div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{label}</div>
        {description && (
          <div className="text-xs text-muted-foreground mt-0.5">
            {description}
          </div>
        )}
      </div>
      <div
        className={cn(
          "h-5 w-5 rounded-full border-2 flex items-center justify-center",
          isChecked ? "border-primary" : "border-input"
        )}
      >
        {isChecked && (
          <div className="h-2.5 w-2.5 rounded-full bg-primary" />
        )}
      </div>
    </label>
  );
}

export { RadioGroup, RadioGroupItem, RadioCard };
