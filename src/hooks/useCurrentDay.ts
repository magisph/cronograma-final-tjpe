import { useState } from 'react';
import { parse, isBefore, isAfter, startOfDay, isSameDay } from 'date-fns';
import cronogramaData from '../data/cronograma.json';

export interface Disciplina {
  nome: string;
  minutos: number;
  assunto: string;
}

export interface DayData {
  dia: number;
  data: string;
  dia_semana: string;
  tempo_total: string;
  disciplinas: Disciplina[];
}

const cronograma = cronogramaData as DayData[];

export function useCurrentDay() {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const today = new Date();
    
    // Find matching date
    const index = cronograma.findIndex(d => {
      const dayDate = parse(d.data, 'dd/MM/yyyy', new Date());
      return isSameDay(dayDate, today);
    });

    if (index !== -1) {
      return index;
    }

    // Check if before first or after last
    const firstDate = parse(cronograma[0].data, 'dd/MM/yyyy', new Date());
    const lastDate = parse(cronograma[cronograma.length - 1].data, 'dd/MM/yyyy', new Date());

    if (isBefore(today, startOfDay(firstDate))) {
      return 0;
    }

    if (isAfter(today, startOfDay(lastDate))) {
      return cronograma.length - 1;
    }

    return 0; // Fallback
  });

  const currentDay = cronograma[currentIndex];
  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < cronograma.length - 1;

  const nextDay = () => {
    if (canGoForward) setCurrentIndex(prev => prev + 1);
  };

  const prevDay = () => {
    if (canGoBack) setCurrentIndex(prev => prev - 1);
  };

  return {
    currentDay,
    nextDay,
    prevDay,
    canGoBack,
    canGoForward,
  };
}
