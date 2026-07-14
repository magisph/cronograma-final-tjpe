import { ReactNode } from 'react';
import { Home, History, Settings } from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-gray-50 text-gray-900 overflow-hidden">
      {/* Content Area */}
      <main className="flex-1 overflow-y-auto w-full md:pb-0 pb-16 overscroll-y-contain">
        {children}
      </main>

      {/* Bottom Nav (Mobile) & Sidebar (Tablet+) */}
      <nav className="
        fixed bottom-0 left-0 w-full h-16 bg-white border-t border-gray-200 
        md:relative md:h-full md:w-64 md:border-t-0 md:border-r 
        flex md:flex-col md:justify-start justify-around items-center md:items-stretch
        z-50 md:order-first
      ">
        <div className="hidden md:flex items-center justify-center h-16 border-b border-gray-200 p-4">
          <h1 className="font-bold text-lg text-purple-700">TJ-PE 75D</h1>
        </div>

        <div className="flex md:flex-col justify-around md:justify-start w-full md:w-auto h-full md:p-4 gap-2">
          {/* Active Link Example */}
          <a href="#" className="flex flex-col md:flex-row items-center gap-1 md:gap-3 p-2 md:p-3 text-purple-600 bg-purple-50 md:rounded-lg rounded-none w-full justify-center md:justify-start">
            <Home size={24} />
            <span className="text-xs md:text-sm font-medium">Home</span>
          </a>

          {/* Inactive Links */}
          <a href="#" className="flex flex-col md:flex-row items-center gap-1 md:gap-3 p-2 md:p-3 text-gray-500 hover:text-purple-600 hover:bg-purple-50 md:rounded-lg rounded-none w-full justify-center md:justify-start transition-colors">
            <History size={24} />
            <span className="text-xs md:text-sm font-medium">Histórico</span>
          </a>

          <a href="#" className="flex flex-col md:flex-row items-center gap-1 md:gap-3 p-2 md:p-3 text-gray-500 hover:text-purple-600 hover:bg-purple-50 md:rounded-lg rounded-none w-full justify-center md:justify-start transition-colors">
            <Settings size={24} />
            <span className="text-xs md:text-sm font-medium">Ajustes</span>
          </a>
        </div>
      </nav>
    </div>
  );
}
