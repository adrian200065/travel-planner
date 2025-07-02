// NextAuth type extensions
import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
    } & DefaultSession['user']
  }

  interface User {
    id: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
  }
}

// Travel Planner Types
export interface TravelFormData {
  destination: string
  startDate: string
  endDate: string
  numberOfPeople: number
  budgetLevel: string
  travelStyle: string[]
  accommodationPrefs: string[]
  dietaryRestrictions?: string
  accessibilityNeeds?: string
}

export interface Activity {
  time: string
  title: string
  description: string
  type: string
  estimatedCost: number
  transportation: string
}

export interface ItineraryDay {
  day: number
  date: string
  title: string
  activities: Activity[]
}

export interface ItineraryData {
  summary: string
  totalEstimatedCost?: number
  days: ItineraryDay[]
}