import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category: string;
  isNew?: boolean;
  isBest?: boolean;
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  imageUrl: _imageUrl,
  category,
  isNew,
  isBest,
}: ProductCardProps) {
  void _imageUrl; // Reserved for future use with actual product images
  const discountPercent = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <Card className="group overflow-hidden rounded-2xl border-border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link href={`/products/${id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          {/* Placeholder for product image */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
            <span className="text-6xl">🧸</span>
          </div>

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1">
            {isNew && (
              <span className="rounded-lg bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                NEW
              </span>
            )}
            {isBest && (
              <span className="rounded-lg bg-accent px-2 py-1 text-xs font-medium text-accent-foreground">
                BEST
              </span>
            )}
            {discountPercent > 0 && (
              <span className="rounded-lg bg-destructive px-2 py-1 text-xs font-medium text-white">
                {discountPercent}%
              </span>
            )}
          </div>

          {/* Quick view button */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/20 group-hover:opacity-100">
            <Button
              variant="secondary"
              className="rounded-xl bg-white/90 text-foreground hover:bg-white"
            >
              자세히 보기
            </Button>
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground">{category}</p>
        <Link href={`/products/${id}`}>
          <h3 className="mt-1 font-medium text-foreground line-clamp-2 hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>
      </CardContent>

      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">
            {price.toLocaleString()}원
          </span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {originalPrice.toLocaleString()}원
            </span>
          )}
        </div>
        <Button
          size="sm"
          className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          담기
        </Button>
      </CardFooter>
    </Card>
  );
}
