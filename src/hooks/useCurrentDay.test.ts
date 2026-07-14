import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useCurrentDay } from './useCurrentDay';

describe('useCurrentDay', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize to day 1 if date is before the first day', () => {
    const dateBefore = new Date('2026-07-01T12:00:00'); // Before 14/07/2026
    vi.setSystemTime(dateBefore);

    const { result } = renderHook(() => useCurrentDay());

    expect(result.current.currentDay.dia).toBe(1);
    expect(result.current.canGoBack).toBe(false);
    expect(result.current.canGoForward).toBe(true);
  });

  it('should allow navigation forward and backward', () => {
    const dateBefore = new Date('2026-07-01T12:00:00');
    vi.setSystemTime(dateBefore);

    const { result } = renderHook(() => useCurrentDay());

    expect(result.current.currentDay.dia).toBe(1);

    act(() => {
      result.current.nextDay();
    });

    expect(result.current.currentDay.dia).toBe(2);
    expect(result.current.canGoBack).toBe(true);

    act(() => {
      result.current.prevDay();
    });

    expect(result.current.currentDay.dia).toBe(1);
  });
});
