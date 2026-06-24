import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Zap, MessageSquare, Dumbbell, Utensils, Calculator,
  BarChart3, Droplets, CheckSquare, ArrowRight, Star,
  TrendingUp, Shield, Clock
} from 'lucide-react'
import { Button } from '@/components/ui'
import { getTodayQuote } from '@/lib/utils'

const features = [
  { icon: MessageSquare, title: 'AI Coach Chat', desc: 'Get personalized fitness advice powered by Gemini AI.', color: '#6C63FF' },
  { icon: Dumbbell, title: 'Workout Generator', desc: 'Custom workout plans based on your goals and equipment.', color: '#00FF87' },
  { icon: Utensils, title: 'Diet Planner', desc: '7-day personalized meal plans for student budgets.', color: '#FF6B6B' },
  { icon: Calculator, title: 'BMI Calculator', desc: 'Comprehensive body analysis with recommendations.', color: '#FFD93D' },
  { icon: BarChart3, title: 'Progress Dashboard', desc: 'Track your fitness journey with beautiful charts.', color: '#4ECDC4' },
  { icon: Droplets, title: 'Water Tracker', desc: 'Stay hydrated with daily water intake monitoring.', color: '#45B7D1' },
  { icon: CheckSquare, title: 'Habit Tracker', desc: 'Build consistent fitness habits day by day.', color: '#96CEB4' },
  { icon: TrendingUp, title: 'Achievement Badges', desc: 'Earn rewards as you hit your fitness milestones.', color: '#FFEAA7' },
]

const stats = [
  { value: '50+', label: 'Exercise Library' },
  { value: 'AI', label: 'Gemini Powered' },
  { value: '7-Day', label: 'Diet Plans' },
  { value: '100%', label: 'Free to Use' },
]

export default function Landing() {
  const quote = getTodayQuote()

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 gradient-dark" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00FF87]/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#6C63FF]/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[#00FF87]/30 text-sm text-[#00FF87] mb-8"
          >
            <Zap className="w-4 h-4" />
            AI-Powered Fitness for Students
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-white leading-tight mb-6"
          >
            Your Personal
            <span className="block neon-text">AI Gym Trainer</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-400 max-w-2xl mx-auto mb-10"
          >
            FitAI combines the power of Google Gemini AI with science-backed fitness principles
            to create workouts, diet plans, and coaching tailored specifically for students.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/chat">
              <Button variant="neon" size="lg" className="gap-2">
                Start Training <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/workout">
              <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                Generate Workout
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto"
          >
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="font-display font-bold text-3xl neon-text">{value}</div>
                <div className="text-gray-500 text-sm mt-1">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Star className="w-6 h-6 text-[#FFD93D] mx-auto mb-4" />
            <blockquote className="font-display text-2xl font-medium text-foreground mb-4 leading-relaxed">
              "{quote.text}"
            </blockquote>
            <cite className="text-muted-foreground">— {quote.author}</cite>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-bold text-4xl text-foreground mb-4"
          >
            Everything You Need
          </motion.h2>
          <p className="text-muted-foreground text-lg">
            A complete fitness ecosystem designed for the student lifestyle.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc, color }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-6 rounded-2xl border border-border bg-card hover:border-primary/40 card-hover group"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${color}20` }}
              >
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why FitAI */}
      <section className="py-24 bg-muted/20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display font-bold text-4xl text-foreground mb-6">
                Built for Students,
                <span className="neon-text block">By Science</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                We understand the student hustle — limited time, tight budgets, small spaces.
                FitAI generates workouts and diet plans that actually fit your lifestyle.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Clock, text: 'Workouts from 15 to 90 minutes — you choose' },
                  { icon: Shield, text: 'Safety-first AI recommendations' },
                  { icon: TrendingUp, text: 'Progressive plans that grow with you' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#00FF87]/20 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-[#00FF87]" />
                    </div>
                    <span className="text-foreground text-sm">{text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { label: 'Workouts Created', value: '∞', color: '#00FF87' },
                { label: 'Exercise Guides', value: '50+', color: '#6C63FF' },
                { label: 'Diet Templates', value: '7-Day', color: '#FF6B6B' },
                { label: 'AI Accuracy', value: 'Gemini', color: '#FFD93D' },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="p-6 rounded-2xl border border-border bg-card text-center"
                  style={{ borderColor: `${color}30` }}
                >
                  <div className="font-display font-bold text-3xl mb-2" style={{ color }}>{value}</div>
                  <div className="text-muted-foreground text-xs">{label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 max-w-3xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display font-bold text-4xl text-foreground mb-6">
            Ready to Transform?
          </h2>
          <p className="text-muted-foreground mb-8">
            Start your fitness journey today. No gym membership required.
          </p>
          <Link to="/chat">
            <Button variant="neon" size="lg">
              Chat with FitAI <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md gradient-primary flex items-center justify-center">
              <Zap className="w-3 h-3 text-gray-900" />
            </div>
            <span className="font-display font-semibold text-sm neon-text">FitAI</span>
          </div>
          <p className="text-muted-foreground text-xs">
            © 2024 FitAI — AI-powered fitness for students. Powered by Google Gemini.
          </p>
        </div>
      </footer>
    </div>
  )
}
