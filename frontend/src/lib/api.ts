const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function apiRequest<T>(endpoint: string, body: object): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.detail || `Request failed: ${response.status}`)
  }
  return response.json()
}

export const api = {
  chat: (message: string, history: object[], userProfile?: object) =>
    apiRequest<{ response: string }>('/api/chat', { message, history, user_profile: userProfile }),

  generateWorkout: (data: object) =>
    apiRequest<{ workout_plan: string }>('/api/workout', data),

  generateDiet: (data: object) =>
    apiRequest<{ diet_plan: string; nutrition_profile: object }>('/api/diet', data),

  calculateBMI: (data: object) =>
    apiRequest<{
      bmi: number
      category: string
      color: string
      advice: string
      ideal_weight_range: { min: number; max: number }
      estimated_body_fat: number
    }>('/api/bmi', data),
}
