import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, Info } from 'lucide-react'
import { api } from '@/lib/api'
import {
  Button, Card, CardHeader, CardContent, CardTitle,
  Input, Select, SectionHeader, ProgressBar, Badge
} from '@/components/ui'
import type { BMIResult } from '@/types'

const BMI_ZONES = [
  { label: 'Underweight', range: '< 18.5', color: '#45B7D1', min: 0, max: 18.5 },
  { label: 'Normal', range: '18.5 – 24.9', color: '#00FF87', min: 18.5, max: 25 },
  { label: 'Overweight', range: '25 – 29.9', color: '#FFD93D', min: 25, max: 30 },
  { label: 'Obese', range: '≥ 30', color: '#FF6B6B', min: 30, max: 40 },
]

export default function BMIPage() {
  const [form, setForm] = useState({ weight: 65, height: 170, age: 20, gender: 'male' })
  const [result, setResult] = useState<BMIResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  const calculate = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.calculateBMI(form)
      setResult(res)
    } catch (e: any) {
      setError(e.message || 'Calculation failed')
    } finally {
      setLoading(false)
    }
  }

  const getBMIColor = (category: string) => {
    const map: Record<string, string> = {
      Underweight: '#45B7D1',
      'Normal weight': '#00FF87',
      Overweight: '#FFD93D',
      Obese: '#FF6B6B',
    }
    return map[category] || '#00FF87'
  }

  const getBMIPercent = (bmi: number) => Math.min(100, Math.max(0, ((bmi - 10) / 30) * 100))

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <SectionHeader
        title="BMI Calculator"
        subtitle="Analyze your body composition and get personalized health recommendations."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#FFD93D]" />
              Body Measurements
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
              ]}
            />
            <Input
              label="Age (years)"
              type="number"
              value={form.age}
              min={10}
              max={100}
              onChange={e => set('age', parseInt(e.target.value))}
            />
            <Input
              label="Weight (kg)"
              type="number"
              value={form.weight}
              min={20}
              max={500}
              step={0.1}
              onChange={e => set('weight', parseFloat(e.target.value))}
            />
            <Input
              label="Height (cm)"
              type="number"
              value={form.height}
              min={100}
              max={250}
              step={0.1}
              onChange={e => set('height', parseFloat(e.target.value))}
            />

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button variant="neon" className="w-full" onClick={calculate} loading={loading}>
              Calculate BMI
            </Button>
          </CardContent>
        </Card>

        {/* Result */}
        <div className="space-y-4">
          {result ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              {/* BMI Score */}
              <Card className="text-center p-8" style={{ borderColor: `${getBMIColor(result.category)}40` }}>
                <div
                  className="text-7xl font-display font-bold mb-2"
                  style={{ color: getBMIColor(result.category) }}
                >
                  {result.bmi}
                </div>
                <Badge
                  className="text-sm px-4 py-1"
                  style={{
                    backgroundColor: `${getBMIColor(result.category)}20`,
                    color: getBMIColor(result.category),
                  }}
                >
                  {result.category}
                </Badge>

                {/* BMI Scale */}
                <div className="mt-6">
                  <div className="flex h-3 rounded-full overflow-hidden mb-2">
                    {BMI_ZONES.map(z => (
                      <div
                        key={z.label}
                        className="flex-1 transition-all"
                        style={{ backgroundColor: z.color + '60' }}
                      />
                    ))}
                  </div>
                  <div
                    className="relative"
                    style={{ marginLeft: `${getBMIPercent(result.bmi)}%`, transform: 'translateX(-50%)' }}
                  >
                    <div className="w-0.5 h-4 mx-auto" style={{ backgroundColor: getBMIColor(result.category) }} />
                    <div
                      className="text-xs font-bold"
                      style={{ color: getBMIColor(result.category) }}
                    >
                      {result.bmi}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <Card className="p-4 text-center">
                  <div className="text-xs text-muted-foreground mb-1">Ideal Weight Range</div>
                  <div className="font-display font-bold text-foreground">
                    {result.ideal_weight_range.min}–{result.ideal_weight_range.max} kg
                  </div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-xs text-muted-foreground mb-1">Body Fat (est.)</div>
                  <div className="font-display font-bold text-foreground">
                    ~{result.estimated_body_fat}%
                  </div>
                </Card>
              </div>

              {/* Advice */}
              <Card className="p-4">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 shrink-0 mt-0.5" style={{ color: getBMIColor(result.category) }} />
                  <p className="text-sm text-muted-foreground leading-relaxed">{result.advice}</p>
                </div>
              </Card>

              {/* BMI Zones */}
              <Card className="p-4">
                <h4 className="font-semibold text-sm mb-3">BMI Classification</h4>
                <div className="space-y-2">
                  {BMI_ZONES.map(z => (
                    <div key={z.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: z.color }} />
                        <span className="text-sm">{z.label}</span>
                      </div>
                      <span className="text-xs text-muted-foreground font-mono">{z.range}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border">
              <Calculator className="w-12 h-12 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">Enter measurements and calculate</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
