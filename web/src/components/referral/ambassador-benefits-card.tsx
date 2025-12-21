/**
 * AmbassadorBenefitsCard Component
 * TeddyBear's Room Referral System
 *
 * Displays ambassador benefits with availability status.
 *
 * Visual Structure (Ambassador):
 * +--------------------------------------------------+
 * |  Ambassador Benefits                             |
 * +--------------------------------------------------+
 * |                                                  |
 * |  [Gift Icon] Early Access to New Products        |
 * |  |- Experience new products before release       |
 * |  +- [Activated]                                  |
 * |                                                  |
 * |  [Package Icon] Monthly Free Shipping            |
 * |  |- Free shipping once per month (any amount)   |
 * |  +- [Available] or [Next: 01/01]                |
 * |                                                  |
 * |  ------------------------------------------------|
 * |  [Use Free Shipping] <- Only when available     |
 * |                                                  |
 * +--------------------------------------------------+
 *
 * Visual Structure (Non-Ambassador):
 * +--------------------------------------------------+
 * |  Benefits You Can Get as an Ambassador          |
 * +--------------------------------------------------+
 * |  [Lock] Early Access to New Products - Inactive |
 * |  [Lock] Monthly Free Shipping - Inactive        |
 * |  ------------------------------------------------|
 * |  Refer 10 people to become an Ambassador!       |
 * +--------------------------------------------------+
 */

"use client";

import * as React from "react";
import { Gift, Package, Check, Lock, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// ============================================================================
// Types
// ============================================================================

export interface AmbassadorBenefitsCardProps {
  /** Whether the user is an ambassador */
  isAmbassador: boolean;
  /** Benefit availability status */
  benefits: {
    /** Early access to new products */
    newProductEarlyAccess: boolean;
    /** Number of free shipping uses available per month */
    monthlyFreeShipping: number;
    /** Whether free shipping can be used now */
    freeShippingAvailable: boolean;
    /** Next date when free shipping becomes available */
    nextFreeShippingAt?: Date;
  };
  /** Callback when using free shipping benefit */
  onUseFreeShipping?: () => Promise<void>;
  /** Optional className for styling */
  className?: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Format date to Korean locale string (MM/DD)
 */
function formatDateShortKR(date: Date): string {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
  })
    .format(date)
    .replace(/\. /g, "/")
    .replace(/\.$/, "");
}

// ============================================================================
// Sub-Components
// ============================================================================

interface BenefitItemProps {
  /** Icon component to display */
  icon: React.ReactNode;
  /** Benefit title */
  title: string;
  /** Benefit description */
  description: string;
  /** Whether the benefit is active */
  isActive: boolean;
  /** Status label to display */
  statusLabel: string;
  /** Additional status info (e.g., next available date) */
  statusSubLabel?: string;
}

function BenefitItem({
  icon,
  title,
  description,
  isActive,
  statusLabel,
  statusSubLabel,
}: BenefitItemProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4 rounded-xl transition-all duration-200",
        isActive
          ? "bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800"
          : "bg-muted/30 border border-transparent"
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
          isActive
            ? "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400"
            : "bg-muted text-muted-foreground"
        )}
        aria-hidden="true"
      >
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h4
            className={cn(
              "font-medium text-sm",
              isActive ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {title}
          </h4>

          {/* Status Badge */}
          <Badge
            variant={isActive ? "secondary" : "outline"}
            size="sm"
            className={cn(
              isActive
                ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 border-green-200 dark:border-green-800"
                : "text-muted-foreground"
            )}
          >
            {isActive ? (
              <Check className="w-3 h-3 mr-1" aria-hidden="true" />
            ) : (
              <Lock className="w-3 h-3 mr-1" aria-hidden="true" />
            )}
            {statusLabel}
          </Badge>
        </div>

        <p
          className={cn(
            "text-xs mt-1",
            isActive ? "text-muted-foreground" : "text-muted-foreground/70"
          )}
        >
          {description}
        </p>

        {/* Additional status info */}
        {statusSubLabel && (
          <p className="text-xs mt-1 text-muted-foreground">{statusSubLabel}</p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function AmbassadorBenefitsCard({
  isAmbassador,
  benefits,
  onUseFreeShipping,
  className,
}: AmbassadorBenefitsCardProps) {
  const [isUsingFreeShipping, setIsUsingFreeShipping] = React.useState(false);

  const handleUseFreeShipping = async () => {
    if (!onUseFreeShipping || isUsingFreeShipping) return;

    try {
      setIsUsingFreeShipping(true);
      await onUseFreeShipping();
    } finally {
      setIsUsingFreeShipping(false);
    }
  };

  // Determine free shipping status label
  const getFreeShippingStatus = (): {
    label: string;
    subLabel?: string;
    isActive: boolean;
  } => {
    if (!isAmbassador) {
      return { label: "Inactive", isActive: false };
    }

    if (benefits.freeShippingAvailable && benefits.monthlyFreeShipping > 0) {
      return {
        label: "Available",
        subLabel: `${benefits.monthlyFreeShipping} use(s) remaining this month`,
        isActive: true,
      };
    }

    if (benefits.nextFreeShippingAt) {
      return {
        label: `Next: ${formatDateShortKR(benefits.nextFreeShippingAt)}`,
        isActive: false,
      };
    }

    return { label: "Not available", isActive: false };
  };

  const freeShippingStatus = getFreeShippingStatus();

  // Korean labels
  const cardTitle = isAmbassador
    ? "Ambassador Benefits"
    : "Benefits Available to Ambassadors";

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{cardTitle}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Benefit: New Product Early Access */}
        <BenefitItem
          icon={<Gift className="w-5 h-5" />}
          title="Early Access to New Products"
          description="Experience new products before they are released to the public"
          isActive={isAmbassador && benefits.newProductEarlyAccess}
          statusLabel={
            isAmbassador && benefits.newProductEarlyAccess
              ? "Activated"
              : "Inactive"
          }
        />

        {/* Benefit: Monthly Free Shipping */}
        <BenefitItem
          icon={<Package className="w-5 h-5" />}
          title="Monthly Free Shipping"
          description="Free shipping once per month regardless of order amount"
          isActive={freeShippingStatus.isActive}
          statusLabel={freeShippingStatus.label}
          statusSubLabel={freeShippingStatus.subLabel}
        />

        {/* Separator */}
        <Separator className="my-4" />

        {/* Action Button or CTA */}
        {isAmbassador ? (
          // Ambassador: Show free shipping button if available
          benefits.freeShippingAvailable && benefits.monthlyFreeShipping > 0 ? (
            <Button
              variant="secondary"
              fullWidth
              onClick={handleUseFreeShipping}
              disabled={isUsingFreeShipping}
              isLoading={isUsingFreeShipping}
              leftIcon={<Truck className="w-4 h-4" />}
              className="bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/50 dark:hover:bg-green-900/70 dark:text-green-300"
            >
              Use Free Shipping
            </Button>
          ) : (
            <p className="text-sm text-center text-muted-foreground py-2">
              {benefits.nextFreeShippingAt
                ? `Free shipping available from ${formatDateShortKR(benefits.nextFreeShippingAt)}`
                : "Free shipping will be available next month"}
            </p>
          )
        ) : (
          // Non-Ambassador: Show upgrade CTA
          <div className="text-center py-2 space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Refer 10 people to become an Ambassador!
            </p>
            <p className="text-xs text-muted-foreground/70">
              Unlock exclusive benefits with Ambassador status
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Re-export types for external use
export type { BenefitItemProps };
