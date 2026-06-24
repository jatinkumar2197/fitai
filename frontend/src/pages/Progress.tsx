import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Plus, TrendingUp, TrendingDown } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import {
  Button, Card, CardHeader, CardContent, CardTitle,
  Input, SectionHeader, EmptyState
} from '@/components/ui'
import { getTodayString } from '@/lib/utils'
import type { ProgressEntry, WorkoutLog } from '@/types'

export default function ProgressPage() {
  const [entries, setEntries] = useLocalStorage<ProgressEntry[]>('fitai-progress', [])
  const [workouts] = useLocalStorage<WorkoutLog[]>('fitai-workout-log', [])
  const [weight, setWeight] = useState('')
  const [error, setError] = useState('')

  const logWeight = () => {
    const w = parseFloat(weight)
    if (isNaN(w) || w < 20 || w > 500) {
      setError('Enter a valid weight (20–500 kg)')
      return
    }
    const today = getTodayString()
    const updated = entries.filter(e => e.date !== today)
    setEntries([...updated, { date: today, weight: w }].sort((a, b) => a.date.localeCompare(b.date)))
    setWeight('')
    setError('')
  }

  const chartData = entries.slice(-30).map(e => ({
    date: new Date(e.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    weight: e.weight,
  }))

  const latest = entries[entries.length - 1]
  const prev = entries[entries.length - 2]
  const diff = latest && prev ? (latest.weight - prev.weight).toFixed(1) : null

  // Workout frequency last 7 days
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const ds = d.toISOString().split('T')[0]
    const count = workouts.filter(w => w.date === ds).length
    return {
      day: d.toLocaleDateString('en', { weekday: 'short' }),
      workouts: count,
    }
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <SectionHeader
        title="Progress Dashboard"
        subtitle="Track your weight, workouts, and fitness journey."
      />

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: 'Current Weight',
            value: latest ? `${latest.weight} kg` : '—',
            sub: diff ? `${Number(diff) > 0 ? '+' : ''}${diff} kg from last` : 'Log your weight',
            icon: diff && Number(diff) < 0 ? TrendingDown : TrendingUp,
            color: diff && Number(diff) < 0 ? '#00FF87' : '#FF6B6B',
          },
          {
            label: 'Weigh-ins',
            value: entries.length,
            sub: 'Total logged',
            icon: BarChart3,
            color: '#6C63FF',
          },
          {
            label: 'Workouts',
            value: workouts.length,
            sub: 'Total logged',
            icon: BarChart3,
            color: '#FFD93D',
          },
          {
            label: 'This Week',
            value: last7.reduce((s, d) => s + d.workouts, 0),
            sub: 'Sessions completed',
            icon: TrendingUp,
            color: '#4ECDC4',
          },
        ].map(({ label, value, sub, icon: Icon, color }) => (
          <Card key={label} className="p-4">
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs text-muted-foreground">{label}</span>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <div className="font-display font-bold text-2xl text-foreground">{value}</div>
            <div className="text-xs text-muted-foreground mt-1">{sub}</div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Log Weight */}
        <Card>
          <CardHeader>
            <CardTitle>Log Weight</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Today's Weight (kg)"
              type="number"
              value={weight}
              placeholder="e.g. 72.5"
              min={20}
              max={500}
              step={0.1}
              onChange={e => setWeight(e.target.value)}
              error={error}
            />
            <Button variant="neon" className="w-full" onClick={logWeight}>
              <Plus className="w-4 h-4 mr-1" /> Log Weight
            </Button>

            {/* Recent entries */}
            <div className="space-y-2 mt-2">
              <p className="text-xs font-medium text-muted-foreground">Recent</p>
              {entries.slice(-5).reverse().map(e => (
                <div key={e.date} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {new Date(e.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                  </span>
                  <span className="font-medium">{e.weight} kg</span>
                </div>
              ))}
              {entries.length === 0 && (
                <p className="text-xs text-muted-foreground">No entries yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Weight Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weight Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length < 2 ? (
              <EmptyState
                icon={BarChart3}
                title="Not enough data"
                description="Log your weight for at least 2 days to see the chart."
              />
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00FF87" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00FF87" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                  <YAxis
                    tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                    domain={['dataMin - 2', 'dataMax + 2']}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Area type="monotone" dataKey="weight" stroke="#00FF87" fill="url(#wGrad)" strokeWidth={2} dot={{ fill: '#00FF87', r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Workout Frequency */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Workout Frequency (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-32">
            {last7.map(({ day, workouts: w }) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-2">
                <div className="flex-1 flex items-end w-full">
                  <motion.div
                    className="w-full rounded-t-lg bg-[#6C63FF]/60"
                    initial={{ height: 0 }}
                    animate={{ height: w > 0 ? `${w * 40}px` : '4px' }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    style={{ minHeight: '4px', maxHeight: '80px' }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{day}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
