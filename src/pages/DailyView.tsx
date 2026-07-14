import { useEffect, useState } from 'react';
import { useCurrentDay } from '../hooks/useCurrentDay';
import { useProgressStore } from '../store/useProgressStore';
import { TaskCheckbox } from '../components/ui/TaskCheckbox';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export function DailyView() {
  const { currentDay, nextDay, prevDay, canGoBack, canGoForward } = useCurrentDay();
  const { completedTasks, toggleTask } = useProgressStore();

  const dayId = currentDay.dia.toString();
  const dayTasks = completedTasks[dayId] || {};

  const totalTasks = currentDay.disciplinas.length;
  const completedCount = currentDay.disciplinas.filter((_, idx) => dayTasks[idx.toString()]).length;

  const [prevCompletedCount, setPrevCompletedCount] = useState(completedCount);

  // Confetti effect when completing the last task
  useEffect(() => {
    if (completedCount === totalTasks && totalTasks > 0 && prevCompletedCount === totalTasks - 1) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    setPrevCompletedCount(completedCount);
  }, [completedCount, totalTasks, prevCompletedCount]);

  // Update prev count if day changes without triggering confetti
  useEffect(() => {
    setPrevCompletedCount(completedCount);
  }, [dayId, completedCount]);

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-purple-700 mb-1">
            DIA {currentDay.dia}
          </h2>
          <p className="text-gray-600 font-medium">
            {currentDay.dia_semana}, {currentDay.data}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={prevDay}
            disabled={!canGoBack}
            className={`p-2 rounded-full border transition-colors flex items-center justify-center min-w-[48px] min-h-[48px] ${
              canGoBack ? 'bg-white hover:bg-gray-100 text-purple-700 border-purple-200' : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
            }`}
            aria-label="Dia Anterior"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextDay}
            disabled={!canGoForward}
            className={`p-2 rounded-full border transition-colors flex items-center justify-center min-w-[48px] min-h-[48px] ${
              canGoForward ? 'bg-white hover:bg-gray-100 text-purple-700 border-purple-200' : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
            }`}
            aria-label="Próximo Dia"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </header>

      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Metas de Hoje</h3>
          <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
            {completedCount} / {totalTasks}
          </span>
        </div>
        
        <div className="flex flex-col gap-3">
          {currentDay.disciplinas.map((disciplina, idx) => {
            const taskId = idx.toString();
            const isChecked = !!dayTasks[taskId];
            const label = `${disciplina.nome} - ${disciplina.assunto} (${disciplina.minutos}m)`;

            return (
              <TaskCheckbox
                key={taskId}
                checked={isChecked}
                onChange={(checked) => toggleTask(dayId, taskId, checked)}
                label={label}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
