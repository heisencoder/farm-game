import { clamp, lerp } from '@/utils/math';

describe('Math utilities', () => {
  describe('clamp', () => {
    it('should return the value when it is within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(0, 0, 10)).toBe(0);
      expect(clamp(10, 0, 10)).toBe(10);
    });

    it('should return min when value is less than min', () => {
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(-100, 0, 10)).toBe(0);
    });

    it('should return max when value is greater than max', () => {
      expect(clamp(15, 0, 10)).toBe(10);
      expect(clamp(100, 0, 10)).toBe(10);
    });

    it('should handle negative ranges', () => {
      expect(clamp(-5, -10, -1)).toBe(-5);
      expect(clamp(-15, -10, -1)).toBe(-10);
      expect(clamp(0, -10, -1)).toBe(-1);
    });
  });

  describe('lerp', () => {
    it('should return start value when t is 0', () => {
      expect(lerp(0, 100, 0)).toBe(0);
      expect(lerp(-50, 50, 0)).toBe(-50);
    });

    it('should return end value when t is 1', () => {
      expect(lerp(0, 100, 1)).toBe(100);
      expect(lerp(-50, 50, 1)).toBe(50);
    });

    it('should interpolate correctly for t = 0.5', () => {
      expect(lerp(0, 100, 0.5)).toBe(50);
      expect(lerp(-50, 50, 0.5)).toBe(0);
    });

    it('should clamp t values outside 0-1 range', () => {
      expect(lerp(0, 100, -0.5)).toBe(0);
      expect(lerp(0, 100, 1.5)).toBe(100);
    });

    it('should handle decimal interpolation', () => {
      expect(lerp(0, 10, 0.25)).toBe(2.5);
      expect(lerp(0, 10, 0.75)).toBe(7.5);
    });
  });
});
