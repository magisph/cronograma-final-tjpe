import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { AppLayout } from './AppLayout';

test('AppLayout renders children and navigation', () => {
  const onChangeTab = vi.fn();
  
  render(
    <AppLayout currentTab="daily" onChangeTab={onChangeTab}>
      <div data-testid="child-content">Main Content</div>
    </AppLayout>
  );
  
  expect(screen.getByTestId('child-content')).toBeInTheDocument();
  
  // It should render navigation links
  expect(screen.getByText('Hoje')).toBeInTheDocument();
  expect(screen.getByText('Progresso')).toBeInTheDocument();
});
