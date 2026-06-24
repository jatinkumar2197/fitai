import { useState } from 'react'
import { motion } from 'framer-motion'
import { Utensils, Download, TrendingUp } from 'lucide-react'
import { api } from '@/lib/api'
import {
  Button, Card, CardHeader, CardContent, CardTitle,
  Input, Select, Textarea, Spinner, SectionHeader, MarkdownContent, Badge
} from '@/components/ui'

const defaults = {
  age: 20,
  weight: 65,
  height: 170,
  gender: 'male',
  activity_level: 'moderately_active',
  diet_goal: 'maintenance',
  dietary_restrictions: '',
  allergies: '',
}

export default function DietPage() {
  const [form, setForm] = useState(defaults)
  const [plan, setPlan] = useState('')
  const [nutrition, setNutrition] = useState<{ bmr: number; tdee: number; target_calories: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  const generate = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.generateDiet(form)
      setPlan(res.diet_plan)
      setNutrition(res.nutrition_profile as { bmr: number; tdee: number; target_calories: number })
    } catch (e: any) {
      setError(e.message || 'Failed to generate diet plan')
    } finally {
      setLoading(false)
    }
  }

  const download = () => {
    const blob = new Blob([plan], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'fitai-diet-plan.txt'
    a.click()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <SectionHeader
        title="AI Diet Planner"
        subtitle="Get a science-based 7-day meal plan tailored to your body and goals."
      />

      <div className="grid lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="w-5 h-5 text-[#FF6B6B]" />
              Your Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              label="Gender"
              value={form.gender}
              onChange={e => set('gender', e.target.value)}
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' },
              ]}
            />
            <div className="grid grid-cols-3 gap-3">
              <Input label="Age" type="number" value={form.age} min={10} max={100} onChange={e => set('age', parseInt(e.target.value))} />
              <Input label="Weight (kg)" type="number" value={form.weight} onChange={e => set('weight', parseFloat(e.target.value))} />
              <Input label="Height (cm)" type="number" value={form.height} onChange={e => set('height', parseFloat(e.target.value))} />
            </div>
            <Select
              label="Activity Level"
              value={form.activity_level}
              onChange={e => set('activity_level', e.target.value)}
              options={[
                { value: 'sedentary', label: 'Sedentary (desk job)' },
                { value: 'lightly_active', label: 'Lightly active (1-3 days/wk)' },
                { value: 'moderately_active', label: 'Moderately active (3-5 days)' },
                { value: 'very_active', label: 'Very active (6-7 days)' },
                { value: 'extra_active', label: 'Athlete (2x/day training)' },
              ]}
            />
            <Select
              label="Diet Goal"
              value={form.diet_goal}
              onChange={e => set('diet_goal', e.target.value)}
              options={[
                { value: 'weight_loss', label: 'Weight Loss (deficit)' },
                { value: 'maintenance', label: 'Maintenance' },
                { value: 'muscle_gain', label: 'Muscle Gain (surplus)' },
              ]}
            />
            <Textarea
              label="Dietary Restrictions"
              placeholder="Vegetarian, vegan, halal..."
              value={form.dietary_restrictions}
              onChange={e => set('dietary_restrictions', e.target.value)}
              rows={2}
            />
            <Textarea
              label="Allergies"
              placeholder="Nuts, dairy, gluten..."
              value={form.allergies}
              onChange={e => set('allergies', e.target.value)}
              rows={2}
            />

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button variant="neon" className="w-full" onClick={generate} loading={loading}>
              {loading ? 'Generating Plan...' : 'Generate 7-Day Meal Plan'}
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-4">
          {/* Nutrition Stats */}
          {nutrition && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-3 gap-3"
            >
              {[
                { label: 'BMR', value: `${nutrition.bmr} kcal`, desc: 'Base metabolic rate' },
                { label: 'TDEE', value: `${nutrition.tdee} kcal`, desc: 'Total daily energy' },
                { label: 'Target', value: `${nutrition.target_calories} kcal`, desc: 'Your daily goal' },
              ].map(({ label, value, desc }) => (
                <Card key={label} className="p-4 text-center border-[#00FF87]/20">
                  <div className="text-xs text-muted-foreground mb-1">{desc}</div>
                  <div className="font-display font-bold text-lg text-[#00FF87]">{value}</div>
                  <div className="text-xs font-medium text-foreground mt-1">{label}</div>
                </Card>
              ))}
            </motion.div>
          )}

          {loading && (
            <div className="h-80 flex flex-col items-center justify-center gap-4">
              <Spinner size="lg" />
              <p className="text-muted-foreground">Creating your personalized meal plan...</p>
            </div>
          )}

          {!loading && !plan && (
            <div className="h-96 flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border">
              <Utensils className="w-12 h-12 text-muted-foreground" />
              <div className="text-center">
                <p className="font-medium text-foreground">Your meal plan appears here</p>
                <p className="text-muted-foreground text-sm">Fill in your details and click Generate</p>
              </div>
            </div>
          )}

          {plan && !loading && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Your 7-Day Meal Plan</CardTitle>
                    <Button variant="outline" size="sm" onClick={download}>
                      <Download className="w-4 h-4 mr-1" /> Download
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[65vh] overflow-y-auto scrollbar-hide pr-2">
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
