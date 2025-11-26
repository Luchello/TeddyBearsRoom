import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

// Mock product data
const products = [
  {
    id: "1",
    name: "파스텔 드림 컬렉션 - 소프트 터치",
    price: 39000,
    originalPrice: 49000,
    imageUrl: "/placeholder.jpg",
    category: "토이",
    isNew: true,
    isBest: true,
  },
  {
    id: "2",
    name: "코지 나이트 아로마 캔들 세트",
    price: 28000,
    imageUrl: "/placeholder.jpg",
    category: "무드",
    isNew: true,
  },
  {
    id: "3",
    name: "실크 터치 마사지 오일",
    price: 32000,
    originalPrice: 38000,
    imageUrl: "/placeholder.jpg",
    category: "케어",
    isBest: true,
  },
  {
    id: "4",
    name: "베어 허그 쿠션 세트",
    price: 45000,
    imageUrl: "/placeholder.jpg",
    category: "라이프",
  },
  {
    id: "5",
    name: "스윗 드림 슬립 마스크",
    price: 18000,
    imageUrl: "/placeholder.jpg",
    category: "라이프",
    isNew: true,
  },
  {
    id: "6",
    name: "버블 베어 바스 솔트",
    price: 22000,
    originalPrice: 28000,
    imageUrl: "/placeholder.jpg",
    category: "케어",
  },
  {
    id: "7",
    name: "로맨틱 무드등 세트",
    price: 35000,
    imageUrl: "/placeholder.jpg",
    category: "무드",
    isBest: true,
  },
  {
    id: "8",
    name: "허니 베어 립밤 세트",
    price: 15000,
    imageUrl: "/placeholder.jpg",
    category: "케어",
  },
];

const categories = ["전체", "토이", "케어", "무드", "라이프"];

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
            {categories.map((category) => (
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
              총 <span className="font-medium text-foreground">{products.length}</span>개의 상품
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
            {products.map((product) => (
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
