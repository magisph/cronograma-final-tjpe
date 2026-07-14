import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { TaskCheckbox } from './TaskCheckbox';

test('TaskCheckbox renders and updates optimistically', () => {
  const handleChange = vi.fn();
  
  const { rerender } = render(
    <TaskCheckbox checked={false} onChange={handleChange} label="Test Task" />
  );
  
  const button = screen.getByRole('checkbox', { name: /Test Task/i });
  expect(button).toHaveAttribute('aria-checked', 'false');
  
  // Click
  fireEvent.click(button);
  
  // Should update locally optimistically
  expect(button).toHaveAttribute('aria-checked', 'true');
  
  // Should call onChange with true
  expect(handleChange).toHaveBeenCalledWith(true);
  
  // Rerender with true to simulate store update
  rerender(<TaskCheckbox checked={true} onChange={handleChange} label="Test Task" />);
  expect(button).toHaveAttribute('aria-checked', 'true');
});
