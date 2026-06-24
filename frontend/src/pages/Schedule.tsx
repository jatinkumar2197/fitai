import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Plus, Trash2, Clock } from 'lucide-react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import {
  Button, Card, CardHeader, CardContent, CardTitle,
  Input, Select, Textarea, SectionHeader, EmptyState, Badge
} from '@/components/ui'
import { DAYS_OF_WEEK, getTodayString } from '@/lib/utils'
import type { ScheduledWorkout } from '@/types'

const WORKOUT_TYPES = [
  'Push (Chest/Shoulders/Triceps)',
  'Pull (Back/Biceps)',
  'Legs (Quads/Hamstrings/Glutes)',
  'Upper Body',
  'Lower Body',
  'Full Body',
  'Cardio (Running)',
  'Cardio (Cycling)',
  'HIIT',
  'Core & Abs',
  'Yoga / Flexibility',
  'Rest / Active Recovery',
]

export default function SchedulePage() {
  const [schedule, setSchedule] = useLocalStorage<ScheduledWorkout[]>('fitai-schedule', [])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    dayOfWeek: 1,
    type: WORKOUT_TYPES[0],
    time: '07:00',
    duration: 45,
    notes: '',
  })

  const set = (k: string, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  const add = () => {
    const entry: ScheduledWorkout = {
      id: Date.now().toString(),
      ...form,
    }
    setSchedule(prev => [...prev, entry])
    setShowForm(false)
    setForm({ dayOfWeek: 1, type: WORKOUT_TYPES[0], time: '07:00', duration: 45, notes: '' })
  }

  const remove = (id: string) => setSchedule(prev => prev.filter(s => s.id !== id))

  const today = new Date().getDay()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <SectionHeader
          title="Workout Schedule"
          subtitle="Plan your weekly training calendar."
        />
        <Button variant="neon" size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-1" /> Add Workout
        </Button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Schedule a Workout</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Select
                    label="Day of Week"
                    value={form.dayOfWeek.toString()}
                    onChange={e => set('dayOfWeek', parseInt(e.target.value))}
                    options={DAYS_OF_WEEK.map((d, i) => ({ value: i.toString(), label: d }))}
                  />
                  <Select
                    label="Workout Type"
                    value={form.type}
                    onChange={e => set('type', e.target.value)}
                    options={WORKOUT_TYPES.map(t => ({ value: t, label: t }))}
                  />
                  <Input
                    label="Time"
                    type="time"
                    value={form.time}
                    onChange={e => set('time', e.target.value)}
                  />
                  <Select
                    label="Duration"
                    value={form.duration.toString()}
                    onChange={e => set('duration', parseInt(e.target.value))}
                    options={[15,20,30,45,60,75,90].map(d => ({ value: d.toString(), label: `${d} minutes` }))}
                  />
                </div>
                <Textarea
                  label="Notes (optional)"
                  placeholder="Focus areas, reminders..."
                  value={form.notes}
                  onChange={e => set('notes', e.target.value)}
                  rows={2}
                />
                <div className="flex gap-3">
                  <Button variant="neon" onClick={add}>Save to Schedule</Button>
                  <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Weekly Grid */}
      {schedule.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No workouts scheduled"
          description="Add workouts to your weekly plan to stay consistent."
        />
      ) : (
        <div className="space-y-4">
          {DAYS_OF_WEEK.map((day, dayIdx) => {
            const dayWorkouts = schedule.filter(s => s.dayOfWeek === dayIdx)
            const isToday = dayIdx === today
            return (
              <motion.div
                key={day}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: dayIdx * 0.05 }}
              >
                <div className={`rounded-2xl border p-4 ${
                  isToday
                    ? 'border-[#00FF87]/40 bg-[#00FF87]/5'
                    : 'border-border bg-card'
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                      isToday ? 'bg-[#00FF87] text-gray-900' : 'bg-muted text-muted-foreground'
                    }`}>
                      {day.slice(0, 2)}
                    </div>
                    <span className={`font-display font-semibold ${isToday ? 'text-[#00FF87]' : 'text-foreground'}`}>
                      {day} {isToday && <Badge variant="success" className="ml-2 text-xs">Today</Badge>}
                    </span>
                  </div>

                  {dayWorkouts.length === 0 ? (
                    <p className="text-muted-foreground text-sm pl-11">Rest day</p>
                  ) : (
                    <div className="space-y-2 pl-11">
                      {dayWorkouts.map(w => (
                        <div
                          key={w.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-muted/50 group"
                        >
                          <div>
                            <div className="font-medium text-sm text-foreground">{w.type}</div>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {w.time}
                              </span>
                              <span className="text-xs text-muted-foreground">{w.duration} min</span>
                            </div>
                            {w.notes && <div className="text-xs text-muted-foreground mt-1">{w.notes}</div>}
                          </div>
                          <button
                            onClick={() => remove(w.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
