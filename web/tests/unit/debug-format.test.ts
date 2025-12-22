import { describe, it, expect } from 'vitest';
import { formatPrice } from '@/lib/utils';

describe('Debug formatPrice', () => {
    it('should show what formatPrice returns', () => {
        const result = formatPrice(10000);
        // Verify the format includes a number
        expect(result).toMatch(/10,000/);
    });
});
