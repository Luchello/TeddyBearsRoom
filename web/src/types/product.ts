/**
 * Product Types for TeddyBear's Room
 * Based on Prisma schema definitions
 */

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  price: number;
  compareAtPrice: number | null;
  sku: string | null;
  barcode: string | null;
  trackQuantity: boolean;
  quantity: number;
  allowBackorder: boolean;
  weight: number | null;
  weightUnit: string | null;
  status: ProductStatus;
  visibility: ProductVisibility;
  categoryId: string | null;
  brandId: string | null;
  featuredImageId: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;

  // Relations
  category?: Category | null;
  brand?: Brand | null;
  images?: ProductImage[];
  variants?: ProductVariant[];
  sizeRecommendations?: SizeRecommendation[];
}

export type ProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";
export type ProductVisibility = "VISIBLE" | "HIDDEN" | "FEATURED";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  parentId: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  parent?: Category | null;
  children?: Category[];
  products?: Product[];
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  websiteUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  products?: Product[];
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  altText: string | null;
  sortOrder: number;
  createdAt: Date;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string | null;
  price: number | null;
  compareAtPrice: number | null;
  quantity: number;
  sortOrder: number;
  options: VariantOption[];
  createdAt: Date;
  updatedAt: Date;
}

export interface VariantOption {
  name: string;
  value: string;
}

export interface SizeRecommendation {
  id: string;
  productId: string;
  sizeLabel: string;
  minMeasurement: number;
  maxMeasurement: number;
  measurementType: MeasurementType;
  fitDescription: string | null;
  createdAt: Date;
}

export type MeasurementType = "LENGTH" | "GIRTH" | "DEPTH" | "WIDTH";

// API Response Types
export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProductFilters {
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: ProductStatus;
  visibility?: ProductVisibility;
  search?: string;
  tags?: string[];
  sortBy?: ProductSortBy;
  sortOrder?: "asc" | "desc";
}

export type ProductSortBy = "price" | "name" | "createdAt" | "updatedAt";

// Product Card Display Type
export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  imageUrl: string | null;
  imageAlt: string | null;
  category: string | null;
  brand: string | null;
  isNew: boolean;
  isSale: boolean;
  isFeatured: boolean;
  isSoldOut?: boolean;
  innerCirclePrice?: number;
  rating?: number;
  reviewCount?: number;
}

// Product Detail Page Type (extended Product)
export interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  price: number;
  compareAtPrice: number | null;
  sku: string | null;
  barcode: string | null;
  inventory: number;
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  categoryId: string | null;
  brandId: string | null;
  images: ProductDetailImage[];
  variants: ProductDetailVariant[];
  category: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    parentId: string | null;
    position: number;
    isActive: boolean;
  } | null;
  brand: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    logoUrl: string | null;
    isActive: boolean;
  } | null;
  sizeRecommendations: SizeRecommendation[];
  reviews: ProductReview[];
  averageRating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductDetailImage {
  id: string;
  url: string;
  alt: string | null;
  position: number;
  productId: string;
}

export interface ProductDetailVariant {
  id: string;
  productId: string;
  name: string;
  sku: string | null;
  price: number;
  inventory: number;
  position: number;
  options: Record<string, string>;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title: string | null;
  content: string | null;
  createdAt: Date;
}
