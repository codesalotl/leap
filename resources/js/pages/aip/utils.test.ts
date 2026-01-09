import { expect, test } from 'vitest';
import { generateYearRange } from '@/pages/aip/utils';

test('adds 1 + 2 to equal 3', () => {
    expect(generateYearRange(2026, 3, 3)).toEqual([
        2023, 2024, 2025, 2026, 2027, 2028, 2029,
    ]);
});
