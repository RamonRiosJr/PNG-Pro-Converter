import { describe, it, expect } from 'vitest';
import { formatBytes } from './fileUtils';

describe('formatBytes', () => {
    it('returns "0 Bytes" when given 0', () => {
        expect(formatBytes(0)).toBe('0 Bytes');
    });

    it('formats bytes correctly', () => {
        expect(formatBytes(500)).toBe('500 Bytes');
    });

    it('formats kilobytes correctly', () => {
        expect(formatBytes(1024)).toBe('1 KB');
        expect(formatBytes(1536)).toBe('1.5 KB');
    });

    it('formats megabytes correctly', () => {
        expect(formatBytes(1048576)).toBe('1 MB');
        expect(formatBytes(1572864)).toBe('1.5 MB');
    });

    it('formats gigabytes correctly', () => {
        expect(formatBytes(1073741824)).toBe('1 GB');
    });

    it('handles negative decimals by forcing 0 decimals', () => {
        expect(formatBytes(1536, -1)).toBe('2 KB');
    });

    it('returns "Too big" if index exceeds sizes array', () => {
        // Just past Terabytes into Petabytes (1024 ** 5)
        expect(formatBytes(Math.pow(1024, 5))).toBe('Too big');
    });
});
