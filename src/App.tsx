import { useState, useEffect } from 'react'
import { useProgressStore } from './store/useProgressStore'
import { AppLayout } from './components/layout/AppLayout'
import { TaskCheckbox } from './components/ui/TaskCheckbox'

function App() {
  const initializeFirebaseSync = useProgressStore((state) => state.initializeFirebaseSync)
  const [taskDone, setTaskDone] = useState(false);

  useEffect(() => {
    initializeFirebaseSync()
  }, [initializeFirebaseSync])

  return (
    <AppLayout>
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <header className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Cronograma de Estudos</h2>
          <p className="text-gray-600">Acompanhe seu progresso diário rumo à aprovação.</p>
        </header>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Metas de Hoje</h3>
          
          <div className="flex flex-col gap-2">
            {/* Example Task Checkboxes */}
            <TaskCheckbox 
              checked={taskDone} 
              onChange={setTaskDone} 
              label="Direito Constitucional - Direitos Fundamentais" 
            />
            
            <TaskCheckbox 
              checked={false} 
              onChange={() => {}} 
              label="Direito Administrativo - Atos Administrativos" 
            />
            
            <TaskCheckbox 
              checked={true} 
              onChange={() => {}} 
              label="Revisão de Véspera" 
            />
          </div>
        </section>
      </div>
    </AppLayout>
  )
}

export default App

