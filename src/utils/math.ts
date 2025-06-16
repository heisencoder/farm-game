/**
 * Clamp a value between a minimum and maximum.
 * @param value - The value to clamp.
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @returns The clamped value.
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Linear interpolation between two values.
 * @param start - The starting value.
 * @param end - The ending value.
 * @param t - The interpolation factor (0-1).
 * @returns The interpolated value.
 */
export const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * clamp(t, 0, 1);
};
