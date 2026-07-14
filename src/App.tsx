import { useEffect } from 'react'
import { useProgressStore } from './store/useProgressStore'
import { AppLayout } from './components/layout/AppLayout'
import { DailyView } from './pages/DailyView'

function App() {
  const initializeFirebaseSync = useProgressStore((state) => state.initializeFirebaseSync)

  useEffect(() => {
    initializeFirebaseSync()
  }, [initializeFirebaseSync])

  return (
    <AppLayout>
      <DailyView />
    </AppLayout>
  )
}

export default App
