import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(
    typeof date === 'string' ? new Date(date) : date
  )
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

export const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const MOTIVATIONAL_QUOTES = [
  { text: "The body achieves what the mind believes.", author: "Napoleon Hill" },
  { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" },
  { text: "Fitness is not about being better than someone else. It's about being better than you used to be.", author: "Khloe Kardashian" },
  { text: "The only bad workout is the one that didn't happen.", author: "Unknown" },
  { text: "Your body can stand almost anything. It's your mind that you have to convince.", author: "Unknown" },
  { text: "Success is usually the culmination of controlling failure.", author: "Sylvester Stallone" },
  { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
  { text: "Train insane or remain the same.", author: "Jillian Michaels" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
  { text: "Push yourself because no one else is going to do it for you.", author: "Unknown" },
]

export function getTodayQuote(): { text: string; author: string } {
  const dayIndex = new Date().getDay()
  return MOTIVATIONAL_QUOTES[dayIndex % MOTIVATIONAL_QUOTES.length]
}

export const EXERCISES_LIBRARY = [
  { name: 'Push-ups', muscle: 'Chest, Triceps, Shoulders', level: 'Beginner', equipment: 'None', sets: '3', reps: '10-15', description: 'Classic bodyweight push-up. Keep body straight, lower chest to floor.' },
  { name: 'Squats', muscle: 'Quads, Glutes, Hamstrings', level: 'Beginner', equipment: 'None', sets: '3', reps: '15-20', description: 'Stand feet shoulder-width, lower hips back and down, keep chest up.' },
  { name: 'Pull-ups', muscle: 'Back, Biceps', level: 'Intermediate', equipment: 'Pull-up bar', sets: '3', reps: '5-10', description: 'Hang from bar with overhand grip, pull chest to bar.' },
  { name: 'Plank', muscle: 'Core, Shoulders', level: 'Beginner', equipment: 'None', sets: '3', reps: '30-60s', description: 'Forearm plank — keep body in straight line from head to heels.' },
  { name: 'Burpees', muscle: 'Full Body', level: 'Intermediate', equipment: 'None', sets: '3', reps: '10-15', description: 'Drop to pushup, jump feet to hands, explosively jump up with arms overhead.' },
  { name: 'Lunges', muscle: 'Quads, Glutes, Hamstrings', level: 'Beginner', equipment: 'None', sets: '3', reps: '12 each leg', description: 'Step forward, lower back knee toward floor, keep front knee over ankle.' },
  { name: 'Dumbbell Bicep Curls', muscle: 'Biceps', level: 'Beginner', equipment: 'Dumbbells', sets: '3', reps: '12-15', description: 'Stand with dumbbells, curl up keeping elbows stationary at sides.' },
  { name: 'Tricep Dips', muscle: 'Triceps, Chest', level: 'Beginner', equipment: 'Chair/Bench', sets: '3', reps: '10-15', description: 'Hands on chair behind you, lower body by bending elbows, press back up.' },
  { name: 'Mountain Climbers', muscle: 'Core, Shoulders, Legs', level: 'Intermediate', equipment: 'None', sets: '3', reps: '30s', description: 'Plank position, alternate driving knees to chest quickly.' },
  { name: 'Jump Rope', muscle: 'Full Body, Cardio', level: 'Beginner', equipment: 'Jump rope', sets: '1', reps: '10 min', description: 'Continuous jumping. Great for cardio and coordination.' },
  { name: 'Deadlift', muscle: 'Back, Glutes, Hamstrings', level: 'Advanced', equipment: 'Barbell', sets: '4', reps: '5-8', description: 'Hip hinge movement. Keep back straight, drive through heels to stand.' },
  { name: 'Bench Press', muscle: 'Chest, Triceps, Shoulders', level: 'Intermediate', equipment: 'Barbell + Bench', sets: '4', reps: '8-12', description: 'Lie on bench, lower bar to chest, press up to full extension.' },
  { name: 'Overhead Press', muscle: 'Shoulders, Triceps', level: 'Intermediate', equipment: 'Dumbbells/Barbell', sets: '3', reps: '8-12', description: 'Press weight overhead from shoulder height to full extension.' },
  { name: 'Russian Twists', muscle: 'Obliques, Core', level: 'Beginner', equipment: 'None', sets: '3', reps: '20 total', description: 'Seated, lean back, twist side to side. Add weight for challenge.' },
  { name: 'Jumping Jacks', muscle: 'Full Body, Cardio', level: 'Beginner', equipment: 'None', sets: '1', reps: '3 min', description: 'Classic cardio warm-up. Jump with arms and legs wide.' },
]
