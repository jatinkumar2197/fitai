export interface UserProfile {
  name: string
  age: number
  weight: number
  height: number
  gender: 'male' | 'female' | 'other'
  goal: string
  level: 'beginner' | 'intermediate' | 'advanced'
  activityLevel: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface WorkoutLog {
  id: string
  date: string
  type: string
  duration: number
  exercises: string[]
  calories: number
  notes?: string
}

export interface WaterLog {
  date: string
  glasses: number
  goal: number
}

export interface HabitEntry {
  id: string
  name: string
  icon: string
  color: string
  completedDates: string[]
  createdAt: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: string
  condition: string
}

export interface ScheduledWorkout {
  id: string
  dayOfWeek: number
  type: string
  time: string
  duration: number
  notes?: string
}

export interface BMIResult {
  bmi: number
  category: string
  color: string
  advice: string
  ideal_weight_range: { min: number; max: number }
  estimated_body_fat: number
}

export interface ProgressEntry {
  date: string
  weight: number
  bmi?: number
}
