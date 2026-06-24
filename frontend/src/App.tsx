import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Landing from '@/pages/Landing'
import ChatPage from '@/pages/Chat'
import WorkoutPage from '@/pages/Workout'
import DietPage from '@/pages/Diet'
import BMIPage from '@/pages/BMI'
import SchedulePage from '@/pages/Schedule'
import ProgressPage from '@/pages/Progress'
import ExercisesPage from '@/pages/Exercises'
import WaterPage from '@/pages/Water'
import HabitsPage from '@/pages/Habits'
import { useTheme } from '@/hooks/useLocalStorage'

function AppShell() {
  const { theme } = useTheme()

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [theme])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/workout" element={<WorkoutPage />} />
          <Route path="/diet" element={<DietPage />} />
          <Route path="/bmi" element={<BMIPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/exercises" element={<ExercisesPage />} />
          <Route path="/water" element={<WaterPage />} />
          <Route path="/habits" element={<HabitsPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
