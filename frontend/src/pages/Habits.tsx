import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckSquare, Plus, Trash2, Flame, X } from 'lucide-react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { Button, Card, Input, SectionHeader, EmptyState, ProgressBar } from '@/components/ui'
import { getTodayString } from '@/lib/utils'
import type { HabitEntry } from '@/types'

const PRESET_HABITS = [
  { name: 'Morning Workout', icon: '🏋️', color: '#00FF87' },
  { name: 'Drink 8 Glasses', icon: '💧', color: '#45B7D1' },
  { name: 'Sleep 8 Hours', icon: '😴', color: '#6C63FF' },
  { name: 'No Junk Food', icon: '🥗', color: '#96CEB4' },
  { name: 'Stretch / Yoga', icon: '🧘', color: '#FFD93D' },
  { name: 'Protein Goal', icon: '💪', color: '#FF6B6B' },
]

export default function HabitsPage() {
  const [habits, setHabits] = useLocalStorage<HabitEntry[]>('fitai-habits', [])
  const [showForm, setShowForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newIcon, setNewIcon] = useState('⭐')
  const [newColor, setNewColor] = useState('#00FF87')

  const today = getTodayString()

  const addHabit = (name: string, icon: string, color: string) => {
    if (!name.trim()) return
    const h: HabitEntry = {
      id: Date.now().toString(),
      name: name.trim(),
      icon,
      color,
      completedDates: [],
      createdAt: today,
    }
    setHabits(prev => [...prev, h])
    setNewName('')
    setShowForm(false)
  }

  const toggleToday = (id: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h
      const done = h.completedDates.includes(today)
      return {
        ...h,
        completedDates: done
          ? h.completedDates.filter(d => d !== today)
          : [...h.completedDates, today],
      }
    }))
  }

  const removeHabit = (id: string) => setHabits(prev => prev.filter(h => h.id !== id))

  const getStreak = (h: HabitEntry) => {
    let streak = 0
    const d = new Date()
    while (true) {
      const ds = d.toISOString().split('T')[0]
      if (h.completedDates.includes(ds)) {
        streak++
        d.setDate(d.getDate() - 1)
      } else {
        break
      }
    }
    return streak
  }

  const getWeekData = (h: HabitEntry) => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      const ds = d.toISOString().split('T')[0]
      return {
        day: d.toLocaleDateString('en', { weekday: 'short' }).slice(0, 1),
        done: h.completedDates.includes(ds),
      }
    })
  }

  const completedToday = habits.filter(h => h.completedDates.includes(today)).length

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <SectionHeader
          title="Habit Tracker"
          subtitle="Build consistent fitness habits, one day at a time."
        />
        <Button variant="neon" size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-1" /> Add Habit
        </Button>
      </div>

      {/* Progress */}
      {habits.length > 0 && (
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Today's Progress</span>
            <span className="text-sm font-bold text-[#00FF87]">{completedToday}/{habits.length}</span>
          </div>
          <ProgressBar value={completedToday} max={habits.length} />
          {completedToday === habits.length && habits.length > 0 && (
            <p className="text-xs text-[#00FF87] mt-2">🎉 All habits completed today!</p>
          )}
        </Card>
      )}

      {/* Add Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Add Custom Habit</h3>
              <div className="flex gap-2 mb-3">
                <Input
                  placeholder="Habit name..."
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="flex-1"
                />
                <input
                  type="text"
                  value={newIcon}
                  onChange={e => setNewIcon(e.target.value.slice(-2))}
                  className="w-16 text-center text-2xl rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <input
                  type="color"
                  value={newColor}
                  onChange={e => setNewColor(e.target.value)}
                  className="w-10 h-10 rounded-xl border border-input cursor-pointer"
                />
              </div>

              <p className="text-xs text-muted-foreground mb-2">Or pick a preset:</p>
              <div className="flex gap-2 flex-wrap mb-3">
                {PRESET_HABITS.map(p => (
                  <button
                    key={p.name}
                    onClick={() => addHabit(p.name, p.icon, p.color)}
                    className="px-3 py-1.5 rounded-lg border border-border hover:border-primary/40 text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <span>{p.icon}</span> {p.name}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <Button variant="neon" size="sm" onClick={() => addHabit(newName, newIcon, newColor)}>
                  Add Habit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {habits.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No habits tracked yet"
          description="Add habits to start building your fitness routine."
        />
      ) : (
        <div className="space-y-3">
          {habits.map((h, i) => {
            const isDoneToday = h.completedDates.includes(today)
            const streak = getStreak(h)
            const week = getWeekData(h)

            return (
              <motion.div
                key={h.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className={`p-4 transition-all ${isDoneToday ? 'border-opacity-60' : ''}`}
                  style={{ borderColor: isDoneToday ? `${h.color}40` : undefined }}
                >
                  <div className="flex items-center gap-4">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleToday(h.id)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all shrink-0 ${
                        isDoneToday
                          ? 'scale-110'
                          : 'bg-muted hover:scale-105'
                      }`}
                      style={isDoneToday ? { backgroundColor: `${h.color}30` } : {}}
                    >
                      {isDoneToday ? '✅' : h.icon}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium text-sm ${isDoneToday ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {h.name}
                        </span>
                        {streak > 0 && (
                          <span className="flex items-center gap-0.5 text-xs text-orange-500">
                            <Flame className="w-3 h-3" /> {streak}
                          </span>
                        )}
                      </div>
                      {/* Week dots */}
                      <div className="flex gap-1 mt-2">
                        {week.map(({ day, done }, idx) => (
                          <div key={idx} className="flex flex-col items-center gap-0.5">
                            <div
                              className={`w-4 h-4 rounded-full transition-all ${done ? '' : 'bg-muted'}`}
                              style={done ? { backgroundColor: h.color } : {}}
                            />
                            <span className="text-xs text-muted-foreground">{day}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => removeHabit(h.id)}
                      className="p-1.5 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
