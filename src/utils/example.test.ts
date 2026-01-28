import { describe, it, expect } from 'vitest';

// 示例工具函数
export function add(a: number, b: number): number {
  return a + b;
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// 测试示例
describe('工具函数测试', () => {
  it('应该正确相加两个数字', () => {
    expect(add(1, 2)).toBe(3);
    expect(add(-1, 1)).toBe(0);
    expect(add(0, 0)).toBe(0);
  });

  it('应该正确格式化日期', () => {
    const date = new Date('2024-01-01');
    expect(formatDate(date)).toBe('2024-01-01');
  });
});

