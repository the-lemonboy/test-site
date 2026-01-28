import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// 示例按钮组件
function Button({
  children,
  onClick,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

// 测试示例
describe('Button 组件测试', () => {
  it('应该正确渲染按钮文本', () => {
    render(<Button>点击我</Button>);
    expect(screen.getByText('点击我')).toBeInTheDocument();
  });

  it('应该在点击时调用 onClick 回调', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>点击我</Button>);
    
    await user.click(screen.getByText('点击我'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('应该在 disabled 时禁用按钮', () => {
    render(<Button disabled>禁用按钮</Button>);
    expect(screen.getByText('禁用按钮')).toBeDisabled();
  });
});

