import { useEffect, useState } from 'react'
import { useProgressStore } from './store/useProgressStore'
import { AppLayout, type TabType } from './components/layout/AppLayout'
import { DailyView } from './pages/DailyView'
import { DashboardView } from './pages/DashboardView'

function App() {
  const initializeFirebaseSync = useProgressStore((state) => state.initializeFirebaseSync)
  const [currentTab, setCurrentTab] = useState<TabType>('daily')

  useEffect(() => {
    initializeFirebaseSync()
  }, [initializeFirebaseSync])

  return (
    <AppLayout currentTab={currentTab} onChangeTab={setCurrentTab}>
      {currentTab === 'daily' ? <DailyView /> : <DashboardView />}
    </AppLayout>
  )
}

export default App
