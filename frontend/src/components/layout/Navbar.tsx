import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dumbbell, MessageSquare, Utensils, Calculator, Calendar,
  BarChart3, BookOpen, Droplets, CheckSquare, Sun, Moon,
  Menu, X, Zap
} from 'lucide-react'
import { useTheme } from '@/hooks/useLocalStorage'
import { cn } from '@/lib/utils'

const navItems = [
  { path: '/chat', label: 'AI Coach', icon: MessageSquare },
  { path: '/workout', label: 'Workout', icon: Dumbbell },
  { path: '/diet', label: 'Diet Plan', icon: Utensils },
  { path: '/bmi', label: 'BMI', icon: Calculator },
  { path: '/schedule', label: 'Schedule', icon: Calendar },
  { path: '/progress', label: 'Progress', icon: BarChart3 },
  { path: '/exercises', label: 'Exercises', icon: BookOpen },
  { path: '/water', label: 'Water', icon: Droplets },
  { path: '/habits', label: 'Habits', icon: CheckSquare },
]

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-gray-900" />
            </div>
            <span className="font-display font-bold text-xl neon-text">FitAI</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map(({ path, label, icon: Icon }) => {
              const active = location.pathname === path
              return (
                <Link
                  key={path}
                  to={path}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200',
                    active
                      ? 'bg-[#00FF87]/20 text-[#00FF87] neon-border border'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              )
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/10 bg-background/95 backdrop-blur-md"
          >
            <div className="px-4 py-3 grid grid-cols-3 gap-2">
              {navItems.map(({ path, label, icon: Icon }) => {
                const active = location.pathname === path
                return (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex flex-col items-center gap-1 px-2 py-3 rounded-xl text-xs font-medium transition-all',
                      active
                        ? 'bg-[#00FF87]/15 text-[#00FF87]'
                        : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
