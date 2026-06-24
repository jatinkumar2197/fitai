import { useState } from 'react'
import { motion } from 'framer-motion'
import { Dumbbell, Download } from 'lucide-react'
import { api } from '@/lib/api'
import {
  Button, Card, CardHeader, CardContent, CardTitle,
  Input, Select, Textarea, Spinner, SectionHeader, MarkdownContent
} from '@/components/ui'

const defaults = {
  fitness_goal: 'weight_loss',
  fitness_level: 'beginner',
  available_days: 3,
  equipment: 'none',
  age: 20,
  weight: 65,
  height: 170,
  health_conditions: '',
  workout_duration: 45,
}

export default function WorkoutPage() {
  const [form, setForm] = useState(defaults)
  const [plan, setPlan] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  const generate = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.generateWorkout(form)
      setPlan(res.workout_plan)
    } catch (e: any) {
      setError(e.message || 'Failed to generate workout plan')
    } finally {
      setLoading(false)
    }
  }

  const download = () => {
    const blob = new Blob([plan], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'fitai-workout-plan.txt'
    a.click()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <SectionHeader
        title="Workout Generator"
        subtitle="Get a personalized workout plan tailored to your goals and equipment."
      />

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-[#00FF87]" />
              Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              label="Fitness Goal"
              value={form.fitness_goal}
              onChange={e => set('fitness_goal', e.target.value)}
              options={[
                { value: 'weight_loss', label: 'Weight Loss' },
                { value: 'muscle_gain', label: 'Muscle Gain' },
                { value: 'endurance', label: 'Endurance / Cardio' },
                { value: 'flexibility', label: 'Flexibility' },
                { value: 'general_fitness', label: 'General Fitness' },
              ]}
            />
            <Select
              label="Fitness Level"
              value={form.fitness_level}
              onChange={e => set('fitness_level', e.target.value)}
              options={[
                { value: 'beginner', label: 'Beginner (0-6 months)' },
                { value: 'intermediate', label: 'Intermediate (6 mo – 2 yr)' },
                { value: 'advanced', label: 'Advanced (2+ years)' },
              ]}
            />
            <Select
              label="Days per Week"
              value={form.available_days.toString()}
              onChange={e => set('available_days', parseInt(e.target.value))}
              options={[1,2,3,4,5,6,7].map(d => ({ value: d.toString(), label: `${d} day${d > 1 ? 's' : ''}` }))}
            />
            <Select
              label="Equipment Available"
              value={form.equipment}
              onChange={e => set('equipment', e.target.value)}
              options={[
                { value: 'none', label: 'No Equipment (Bodyweight)' },
                { value: 'dumbbells', label: 'Dumbbells only' },
                { value: 'resistance_bands', label: 'Resistance Bands' },
                { value: 'full_gym', label: 'Full Gym Access' },
                { value: 'home_gym', label: 'Home Gym Setup' },
              ]}
            />
            <Select
              label="Session Duration"
              value={form.workout_duration.toString()}
              onChange={e => set('workout_duration', parseInt(e.target.value))}
              options={[15,20,30,45,60,75,90].map(d => ({ value: d.toString(), label: `${d} minutes` }))}
            />
            <div className="grid grid-cols-3 gap-3">
              <Input label="Age" type="number" value={form.age} min={10} max={80} onChange={e => set('age', parseInt(e.target.value))} />
              <Input label="Weight (kg)" type="number" value={form.weight} min={30} max={300} onChange={e => set('weight', parseFloat(e.target.value))} />
              <Input label="Height (cm)" type="number" value={form.height} min={100} max={250} onChange={e => set('height', parseFloat(e.target.value))} />
            </div>
            <Textarea
              label="Health Conditions (optional)"
              placeholder="Back pain, knee injury..."
              value={form.health_conditions}
              onChange={e => set('health_conditions', e.target.value)}
              rows={2}
            />

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button variant="neon" className="w-full" onClick={generate} loading={loading}>
              {loading ? 'Generating Plan...' : 'Generate Workout Plan'}
            </Button>
          </CardContent>
        </Card>

        {/* Result */}
        <div className="lg:col-span-3">
          {loading && (
            <div className="h-96 flex flex-col items-center justify-center gap-4">
              <Spinner size="lg" />
              <p className="text-muted-foreground">Creating your personalized plan...</p>
            </div>
          )}

          {!loading && !plan && (
            <div className="h-96 flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border">
              <Dumbbell className="w-12 h-12 text-muted-foreground" />
              <div className="text-center">
                <p className="font-medium text-foreground">Your workout plan appears here</p>
                <p className="text-muted-foreground text-sm">Fill in your details and click Generate</p>
              </div>
            </div>
          )}

          {plan && !loading && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Your Workout Plan</CardTitle>
                    <Button variant="outline" size="sm" onClick={download}>
                      <Download className="w-4 h-4 mr-1" /> Download
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[70vh] overflow-y-auto scrollbar-hide pr-2">
                    <MarkdownContent content={plan} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
