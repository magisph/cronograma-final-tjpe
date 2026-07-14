import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DashboardView } from './DashboardView';
import { useProgressStore } from '../store/useProgressStore';
import cronogramaData from '../data/cronograma.json';

// Mock recharts because ResponsiveContainer needs DOM layout which jsdom lacks
vi.mock('recharts', async () => {
  const Actual = (await vi.importActual('recharts')) as any;
  return {
    ...Actual,
    ResponsiveContainer: ({ children }: any) => (
      <div style={{ width: '800px', height: '600px' }}>{children}</div>
    )
  };
});

describe('DashboardView', () => {
  beforeEach(() => {
    // Reset store before each test
    useProgressStore.setState({ completedTasks: {}, syncError: null, userId: null });
  });

  it('renders DashboardView correctly with initial state', () => {
    render(<DashboardView />);
    expect(screen.getByText('Meu Progresso')).toBeDefined();
    
    // Total days completed should be 0
    expect(screen.getByText('Dias Concluídos')).toBeDefined();
  });

  it('calculates total completed days correctly', () => {
    // Complete the first day
    const firstDay = cronogramaData[0];
    const dayId = firstDay.dia.toString();
    
    const completedTasks: Record<string, Record<string, boolean>> = {
      [dayId]: {}
    };
    
    // Check all tasks for the first day
    firstDay.disciplinas.forEach((_, idx) => {
      completedTasks[dayId][idx.toString()] = true;
    });

    useProgressStore.setState({ completedTasks });

    render(<DashboardView />);
    
    // There should be a "1" in the document for the completed day
    const numberOne = screen.getAllByText('1');
    expect(numberOne.length).toBeGreaterThan(0);
  });
});
