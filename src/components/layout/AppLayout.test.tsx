import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { AppLayout } from './AppLayout';

test('AppLayout renders children and navigation', () => {
  render(
    <AppLayout>
      <div data-testid="child-content">Main Content</div>
    </AppLayout>
  );
  
  expect(screen.getByTestId('child-content')).toBeInTheDocument();
  
  // It should render navigation links
  expect(screen.getByText('Home')).toBeInTheDocument();
  expect(screen.getByText('Histórico')).toBeInTheDocument();
  expect(screen.getByText('Ajustes')).toBeInTheDocument();
});
