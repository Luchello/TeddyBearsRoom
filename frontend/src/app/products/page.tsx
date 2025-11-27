import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { allProducts, productCategories } from "@/lib/data";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground lg:text-4xl">
            전체 상품
          </h1>
          <p className="mt-2 text-muted-foreground">
            TeddyBear&apos;s Room의 파스텔 감성 아이템들을 만나보세요
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {/* Filters */}
          <div className="mb-8 flex flex-wrap gap-2">
            {productCategories.map((category) => (
              <Button
                key={category}
                variant={category === "전체" ? "default" : "outline"}
                className={`rounded-xl ${
                  category === "전체"
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                    : "border-border hover:bg-muted"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Sort */}
          <div className="mb-8 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              총 <span className="font-medium text-foreground">{allProducts.length}</span>개의 상품
            </p>
            <select className="rounded-xl border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option>최신순</option>
              <option>인기순</option>
              <option>낮은 가격순</option>
              <option>높은 가격순</option>
            </select>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {allProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          {/* Load More */}
          <div className="mt-12 text-center">
            <Button
              variant="outline"
              className="rounded-xl border-primary text-primary hover:bg-primary/10"
            >
              더 보기
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
