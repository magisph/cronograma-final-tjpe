import { useEffect, useState, useMemo } from 'react';
import { useProgressStore } from '../store/useProgressStore';
import cronogramaData from '../data/cronograma.json';
import { DayData } from '../hooks/useCurrentDay';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { Trophy, Flame, Download } from 'lucide-react';

const cronograma = cronogramaData as DayData[];

export function DashboardView() {
  const completedTasks = useProgressStore((state) => state.completedTasks);
  
  // Calculate completed days
  const completedDaysInfo = useMemo(() => {
    let total = 0;
    const daysStatus = cronograma.map(day => {
      const dayId = day.dia.toString();
      const tasksCompleted = completedTasks[dayId] || {};
      const allTasksDone = day.disciplinas.length > 0 && 
        day.disciplinas.every((_, idx) => tasksCompleted[idx.toString()]);
      
      if (allTasksDone) total++;
      
      // percentage completion
      const completedCount = day.disciplinas.length > 0 
        ? day.disciplinas.filter((_, idx) => tasksCompleted[idx.toString()]).length 
        : 0;
        
      const percentage = day.disciplinas.length > 0 
        ? Math.round((completedCount / day.disciplinas.length) * 100)
        : 0;
        
      return {
        ...day,
        isCompleted: allTasksDone,
        percentage
      };
    });
    
    return { total, daysStatus };
  }, [completedTasks]);

  // Calculate current streak
  const streak = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Find index of today or the closest past day
    let todayIdx = cronograma.findIndex(d => {
      const parts = d.data.split('/');
      const dDate = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
      return dDate.getTime() === today.getTime();
    });
    
    if (todayIdx === -1) {
      // Find the last date that is before today
      for (let i = cronograma.length - 1; i >= 0; i--) {
        const parts = cronograma[i].data.split('/');
        const dDate = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
        if (dDate.getTime() < today.getTime()) {
          todayIdx = i;
          break;
        }
      }
    }
    
    if (todayIdx === -1) return 0;
    
    let currentStreak = 0;
    // We check from todayIdx downwards
    // If today is not completed, it's fine, we still count streak from yesterday
    let startIndex = completedDaysInfo.daysStatus[todayIdx].isCompleted ? todayIdx : todayIdx - 1;
    
    for (let i = startIndex; i >= 0; i--) {
      if (completedDaysInfo.daysStatus[i].isCompleted) {
        currentStreak++;
      } else {
        break;
      }
    }
    
    return currentStreak;
  }, [completedDaysInfo]);

  // Prepare chart data (last 7 days up to todayIdx, or just last 7 days of the schedule if over)
  const chartData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let todayIdx = cronograma.findIndex(d => {
      const parts = d.data.split('/');
      const dDate = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
      return dDate.getTime() === today.getTime();
    });
    
    if (todayIdx === -1) {
      todayIdx = cronograma.length - 1;
    }
    
    const startIdx = Math.max(0, todayIdx - 6);
    let last7Days = completedDaysInfo.daysStatus.slice(startIdx, todayIdx + 1);
    
    // If less than 7 days available (e.g. at the beginning), just show whatever we have
    return last7Days.map(day => ({
      name: `Dia ${day.dia}`,
      percent: day.percentage
    }));
  }, [completedDaysInfo]);

  // PWA Install Logic
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-purple-700 mb-1">
          Meu Progresso
        </h2>
        <p className="text-gray-600 font-medium">
          Acompanhe sua jornada de estudos
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Total Days Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 flex flex-col items-center justify-center text-center min-h-[140px]">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-3">
            <Trophy size={24} />
          </div>
          <p className="text-sm text-gray-500 font-medium mb-1">Dias Concluídos</p>
          <p className="text-3xl font-bold text-gray-800">{completedDaysInfo.total}</p>
        </div>

        {/* Streak Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 flex flex-col items-center justify-center text-center min-h-[140px]">
          <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-3">
            <Flame size={24} />
          </div>
          <p className="text-sm text-gray-500 font-medium mb-1">Ofensiva (Dias)</p>
          <p className="text-3xl font-bold text-gray-800">{streak}</p>
        </div>
      </div>

      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Últimos 7 Dias (%)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} domain={[0, 100]} />
              <Tooltip 
                cursor={{ fill: '#f3f4f6' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="percent" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.percent === 100 ? '#7C3AED' : '#c4b5fd'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {isInstallable && (
        <section className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-sm p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-1">Instale o Aplicativo</h3>
            <p className="text-purple-100 text-sm">Acesse mais rápido e estude sem distrações.</p>
          </div>
          <button 
            onClick={handleInstallClick}
            className="flex items-center gap-2 bg-white text-purple-700 font-semibold py-3 px-6 rounded-full hover:bg-purple-50 transition-colors whitespace-nowrap w-full sm:w-auto justify-center min-h-[48px]"
          >
            <Download size={20} />
            Instalar Agora
          </button>
        </section>
      )}
    </div>
  );
}
