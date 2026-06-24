import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Droplets, Plus, Minus, RotateCcw } from 'lucide-react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { Button, Card, CardHeader, CardContent, CardTitle, SectionHeader, ProgressBar } from '@/components/ui'
import { getTodayString } from '@/lib/utils'

interface DayLog { date: string; glasses: number; goal: number }

const GLASS_ML = 250

export default function WaterPage() {
  const [logs, setLogs] = useLocalStorage<DayLog[]>('fitai-water', [])
  const [goal, setGoal] = useLocalStorage<number>('fitai-water-goal', 8)

  const today = getTodayString()
  const todayLog = logs.find(l => l.date === today)
  const glasses = todayLog?.glasses ?? 0

  const update = (delta: number) => {
    const newVal = Math.max(0, glasses + delta)
    const updated = logs.filter(l => l.date !== today)
    setLogs([...updated, { date: today, glasses: newVal, goal }])
  }

  const reset = () => {
    const updated = logs.filter(l => l.date !== today)
    setLogs([...updated, { date: today, glasses: 0, goal }])
  }

  const pct = Math.min(100, (glasses / goal) * 100)
  const ml = glasses * GLASS_ML
  const goalMl = goal * GLASS_ML

  // Last 7 days
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const ds = d.toISOString().split('T')[0]
    const log = logs.find(l => l.date === ds)
    return {
      day: d.toLocaleDateString('en', { weekday: 'short' }),
      glasses: log?.glasses ?? 0,
      goal: log?.goal ?? goal,
      met: (log?.glasses ?? 0) >= (log?.goal ?? goal),
    }
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <SectionHeader
        title="Water Tracker"
        subtitle="Stay hydrated. Aim for 8 glasses a day."
      />

      <div className="grid sm:grid-cols-2 gap-6">
        {/* Main tracker */}
        <Card className="text-center p-8">
          {/* Water animation */}
          <div className="relative w-36 h-36 mx-auto mb-6">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
              <motion.circle
                cx="50" cy="50" r="40"
                fill="none"
                stroke="#45B7D1"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 40}`}
                animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - pct / 100) }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Droplets className="w-6 h-6 text-[#45B7D1] mb-1" />
              <div className="font-display font-bold text-2xl text-foreground">{glasses}</div>
              <div className="text-xs text-muted-foreground">/ {goal} glasses</div>
            </div>
          </div>

          <div className="font-display font-bold text-3xl text-[#45B7D1] mb-1">{ml} ml</div>
          <div className="text-muted-foreground text-sm mb-6">of {goalMl} ml daily goal</div>

          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={() => update(-1)}
              disabled={glasses === 0}
              className="w-12 h-12 rounded-full border border-border hover:bg-muted flex items-center justify-center disabled:opacity-30 transition-colors"
            >
              <Minus className="w-5 h-5" />
            </button>
            <button
              onClick={() => update(1)}
              className="w-16 h-16 rounded-full bg-[#45B7D1] hover:bg-[#45B7D1]/90 flex items-center justify-center shadow-lg transition-colors"
            >
              <Plus className="w-7 h-7 text-white" />
            </button>
            <button
              onClick={reset}
              className="w-12 h-12 rounded-full border border-border hover:bg-muted flex items-center justify-center transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {pct >= 100 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-4 py-2 rounded-xl bg-[#45B7D1]/20 text-[#45B7D1] text-sm font-medium"
            >
              🎉 Daily goal achieved!
            </motion.div>
          )}
        </Card>

        {/* Settings + History */}
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold text-sm mb-3">Daily Goal</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setGoal(g => Math.max(1, g - 1))}
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted"
              >
                <Minus className="w-3 h-3" />
              </button>
              <div className="flex-1 text-center">
                <div className="font-display font-bold text-2xl">{goal}</div>
                <div className="text-xs text-muted-foreground">glasses ({goal * 250} ml)</div>
              </div>
              <button
                onClick={() => setGoal(g => Math.min(20, g + 1))}
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold text-sm mb-3">Last 7 Days</h3>
            <div className="space-y-2">
              {last7.map(({ day, glasses: g, goal: gl, met }) => (
                <div key={day} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-8">{day}</span>
                  <div className="flex-1">
                    <ProgressBar value={g} max={gl} color="#45B7D1" />
                  </div>
                  <span className={`text-xs font-medium w-8 text-right ${met ? 'text-[#45B7D1]' : 'text-muted-foreground'}`}>
                    {g}/{gl}
                  </span>
                  {met && <span className="text-xs">✓</span>}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 bg-[#45B7D1]/5 border-[#45B7D1]/20">
            <h4 className="font-semibold text-sm mb-2 text-[#45B7D1]">Hydration Tips</h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Drink a glass of water when you wake up</li>
              <li>• Carry a reusable water bottle to class</li>
              <li>• Set reminders every 2 hours</li>
              <li>• Drink before, during, and after workouts</li>
              <li>• Herbal teas and infused water count!</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
