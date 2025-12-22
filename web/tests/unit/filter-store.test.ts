/**
 * Filter Store Unit Tests
 * TDD: Testing Zustand filter store for TeddyBear's Room
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFilterStore } from '@/stores/filter-store';

describe('Filter Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useFilterStore.setState({
      searchQuery: '',
      selectedCategories: [],
      selectedBrands: [],
      priceRange: null,
      sortOption: 'newest',
      viewMode: 'grid',
      inStockOnly: false,
      onSaleOnly: false,
      featuredOnly: false,
      selectedTags: [],
    });
    vi.clearAllMocks();
  });

  describe('searchQuery', () => {
    it('should have empty search query by default', () => {
      const { result } = renderHook(() => useFilterStore());
      expect(result.current.searchQuery).toBe('');
    });

    it('should update search query', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setSearchQuery('teddy bear');
      });

      expect(result.current.searchQuery).toBe('teddy bear');
    });

    it('should clear search query', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setSearchQuery('test');
        result.current.setSearchQuery('');
      });

      expect(result.current.searchQuery).toBe('');
    });
  });

  describe('categories', () => {
    it('should have empty categories by default', () => {
      const { result } = renderHook(() => useFilterStore());
      expect(result.current.selectedCategories).toEqual([]);
    });

    it('should add a category', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.toggleCategory('plush');
      });

      expect(result.current.selectedCategories).toContain('plush');
    });

    it('should remove a category when toggled again', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.toggleCategory('plush');
        result.current.toggleCategory('plush');
      });

      expect(result.current.selectedCategories).not.toContain('plush');
    });

    it('should handle multiple categories', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.toggleCategory('plush');
        result.current.toggleCategory('accessories');
        result.current.toggleCategory('clothing');
      });

      expect(result.current.selectedCategories).toHaveLength(3);
      expect(result.current.selectedCategories).toContain('plush');
      expect(result.current.selectedCategories).toContain('accessories');
      expect(result.current.selectedCategories).toContain('clothing');
    });

    it('should set categories directly', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setSelectedCategories(['cat1', 'cat2']);
      });

      expect(result.current.selectedCategories).toEqual(['cat1', 'cat2']);
    });

    it('should clear all categories by setting empty array', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.toggleCategory('plush');
        result.current.toggleCategory('accessories');
        result.current.setSelectedCategories([]);
      });

      expect(result.current.selectedCategories).toEqual([]);
    });
  });

  describe('brands', () => {
    it('should have empty brands by default', () => {
      const { result } = renderHook(() => useFilterStore());
      expect(result.current.selectedBrands).toEqual([]);
    });

    it('should toggle a brand', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.toggleBrand('brand1');
      });

      expect(result.current.selectedBrands).toContain('brand1');

      act(() => {
        result.current.toggleBrand('brand1');
      });

      expect(result.current.selectedBrands).not.toContain('brand1');
    });
  });

  describe('priceRange', () => {
    it('should have null price range by default', () => {
      const { result } = renderHook(() => useFilterStore());
      expect(result.current.priceRange).toBeNull();
    });

    it('should update price range', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setPriceRange({ min: 10000, max: 50000 });
      });

      expect(result.current.priceRange?.min).toBe(10000);
      expect(result.current.priceRange?.max).toBe(50000);
    });

    it('should clear price range', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setPriceRange({ min: 1000, max: 5000 });
        result.current.setPriceRange(null);
      });

      expect(result.current.priceRange).toBeNull();
    });
  });

  describe('sortOption', () => {
    it('should have default sort option', () => {
      const { result } = renderHook(() => useFilterStore());
      expect(result.current.sortOption).toBe('newest');
    });

    it('should update sort option', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setSortOption('price-low');
      });

      expect(result.current.sortOption).toBe('price-low');
    });

    it('should handle all sort options', () => {
      const { result } = renderHook(() => useFilterStore());
      const sortOptions = ['newest', 'oldest', 'price-low', 'price-high', 'name-asc', 'name-desc'];

      sortOptions.forEach((option) => {
        act(() => {
          result.current.setSortOption(option);
        });
        expect(result.current.sortOption).toBe(option);
      });
    });

    it('should return sort params correctly', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setSortOption('price-low');
      });

      const params = result.current.getSortParams();
      expect(params.sortBy).toBe('price');
      expect(params.sortOrder).toBe('asc');
    });
  });

  describe('viewMode', () => {
    it('should have grid view by default', () => {
      const { result } = renderHook(() => useFilterStore());
      expect(result.current.viewMode).toBe('grid');
    });

    it('should switch to list view', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setViewMode('list');
      });

      expect(result.current.viewMode).toBe('list');
    });
  });

  describe('inStockOnly', () => {
    it('should be false by default', () => {
      const { result } = renderHook(() => useFilterStore());
      expect(result.current.inStockOnly).toBe(false);
    });

    it('should update in-stock filter', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setInStockOnly(true);
      });

      expect(result.current.inStockOnly).toBe(true);
    });

    it('should toggle back to false', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setInStockOnly(true);
        result.current.setInStockOnly(false);
      });

      expect(result.current.inStockOnly).toBe(false);
    });
  });

  describe('special filters', () => {
    it('should handle onSaleOnly', () => {
      const { result } = renderHook(() => useFilterStore());

      expect(result.current.onSaleOnly).toBe(false);

      act(() => {
        result.current.setOnSaleOnly(true);
      });

      expect(result.current.onSaleOnly).toBe(true);
    });

    it('should handle featuredOnly', () => {
      const { result } = renderHook(() => useFilterStore());

      expect(result.current.featuredOnly).toBe(false);

      act(() => {
        result.current.setFeaturedOnly(true);
      });

      expect(result.current.featuredOnly).toBe(true);
    });
  });

  describe('tags', () => {
    it('should have empty tags by default', () => {
      const { result } = renderHook(() => useFilterStore());
      expect(result.current.selectedTags).toEqual([]);
    });

    it('should add a tag', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.toggleTag('new');
      });

      expect(result.current.selectedTags).toContain('new');
    });

    it('should remove a tag when toggled again', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.toggleTag('new');
        result.current.toggleTag('new');
      });

      expect(result.current.selectedTags).not.toContain('new');
    });

    it('should set tags directly', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setSelectedTags(['tag1', 'tag2', 'tag3']);
      });

      expect(result.current.selectedTags).toEqual(['tag1', 'tag2', 'tag3']);
    });
  });

  describe('clearAllFilters', () => {
    it('should reset all filters to default', () => {
      const { result } = renderHook(() => useFilterStore());

      // Set various filters
      act(() => {
        result.current.setSearchQuery('test');
        result.current.toggleCategory('plush');
        result.current.toggleBrand('brand1');
        result.current.setPriceRange({ min: 1000, max: 5000 });
        result.current.setInStockOnly(true);
        result.current.setOnSaleOnly(true);
        result.current.setFeaturedOnly(true);
        result.current.toggleTag('sale');
      });

      // Clear all filters
      act(() => {
        result.current.clearAllFilters();
      });

      expect(result.current.searchQuery).toBe('');
      expect(result.current.selectedCategories).toEqual([]);
      expect(result.current.selectedBrands).toEqual([]);
      expect(result.current.priceRange).toBeNull();
      expect(result.current.inStockOnly).toBe(false);
      expect(result.current.onSaleOnly).toBe(false);
      expect(result.current.featuredOnly).toBe(false);
      expect(result.current.selectedTags).toEqual([]);
    });

    it('should not reset sortOption and viewMode', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setSortOption('price-high');
        result.current.setViewMode('list');
        result.current.setSearchQuery('test');
        result.current.clearAllFilters();
      });

      // sortOption and viewMode should be preserved (as per implementation)
      expect(result.current.sortOption).toBe('price-high');
      expect(result.current.viewMode).toBe('list');
    });
  });

  describe('hasActiveFilters', () => {
    it('should return false when no filters are active', () => {
      const { result } = renderHook(() => useFilterStore());
      expect(result.current.hasActiveFilters()).toBe(false);
    });

    it('should return true when search query is set', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setSearchQuery('test');
      });

      expect(result.current.hasActiveFilters()).toBe(true);
    });

    it('should return true when category is selected', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.toggleCategory('plush');
      });

      expect(result.current.hasActiveFilters()).toBe(true);
    });

    it('should return true when inStockOnly is enabled', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setInStockOnly(true);
      });

      expect(result.current.hasActiveFilters()).toBe(true);
    });

    it('should return true when priceRange is set', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setPriceRange({ min: 1000, max: 5000 });
      });

      expect(result.current.hasActiveFilters()).toBe(true);
    });
  });

  describe('getActiveFilterCount', () => {
    it('should return 0 when no filters are active', () => {
      const { result } = renderHook(() => useFilterStore());
      expect(result.current.getActiveFilterCount()).toBe(0);
    });

    it('should count active filters correctly', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setSearchQuery('test'); // +1
        result.current.toggleCategory('cat1'); // +1
        result.current.toggleCategory('cat2'); // +1
        result.current.setPriceRange({ min: 0, max: 1000 }); // +1
        result.current.setInStockOnly(true); // +1
      });

      expect(result.current.getActiveFilterCount()).toBe(5);
    });
  });
});
