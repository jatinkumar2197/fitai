import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Search, Dumbbell } from 'lucide-react'
import { Input, Card, SectionHeader, Badge } from '@/components/ui'
import { EXERCISES_LIBRARY } from '@/lib/utils'

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced']
const MUSCLES = ['All', 'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Quads', 'Glutes', 'Core', 'Full Body', 'Cardio']

const levelVariant: Record<string, 'success' | 'warning' | 'error'> = {
  Beginner: 'success',
  Intermediate: 'warning',
  Advanced: 'error',
}

export default function ExercisesPage() {
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState('All')
  const [muscle, setMuscle] = useState('All')
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = useMemo(() =>
    EXERCISES_LIBRARY.filter(e => {
      const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.muscle.toLowerCase().includes(search.toLowerCase())
      const matchLevel = level === 'All' || e.level === level
      const matchMuscle = muscle === 'All' || e.muscle.includes(muscle)
      return matchSearch && matchLevel && matchMuscle
    }),
    [search, level, muscle]
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <SectionHeader
        title="Exercise Library"
        subtitle="Browse exercises with instructions, sets, reps, and muscle groups."
      />

      {/* Filters */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search exercises or muscle groups..."
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground self-center">Level:</span>
          {LEVELS.map(l => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                level === l
                  ? 'bg-[#00FF87] text-gray-900'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground self-center">Muscle:</span>
          {MUSCLES.map(m => (
            <button
              key={m}
              onClick={() => setMuscle(m)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                muscle === m
                  ? 'bg-[#6C63FF] text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{filtered.length} exercise{filtered.length !== 1 ? 's' : ''} found</p>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((ex, i) => (
          <motion.div
            key={ex.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Card
              className="p-4 cursor-pointer card-hover"
              onClick={() => setExpanded(expanded === ex.name ? null : ex.name)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#00FF87]/10 flex items-center justify-center">
                  <Dumbbell className="w-4 h-4 text-[#00FF87]" />
                </div>
                <Badge variant={levelVariant[ex.level]}>{ex.level}</Badge>
              </div>

              <h3 className="font-display font-semibold text-foreground mb-1">{ex.name}</h3>
              <p className="text-xs text-muted-foreground mb-3">{ex.muscle}</p>

              <div className="flex gap-3 text-xs">
                <div className="text-center">
                  <div className="font-bold text-foreground">{ex.sets}</div>
                  <div className="text-muted-foreground">Sets</div>
                </div>
                <div className="w-px bg-border" />
                <div className="text-center">
                  <div className="font-bold text-foreground">{ex.reps}</div>
                  <div className="text-muted-foreground">Reps</div>
                </div>
                <div className="w-px bg-border" />
                <div className="text-center">
                  <div className="font-bold text-foreground text-xs">{ex.equipment}</div>
                  <div className="text-muted-foreground">Equipment</div>
                </div>
              </div>

              {expanded === ex.name && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 pt-3 border-t border-border"
                >
                  <p className="text-sm text-muted-foreground leading-relaxed">{ex.description}</p>
                </motion.div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No exercises match your filters.</p>
        </div>
      )}
    </div>
  )
}
