
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Header } from '@/components/header'
import { ItineraryCard } from '@/components/itinerary-card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { 
  Plus, 
  Navigation, 
  Loader2,
  MapPin
} from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

interface Itinerary {
  id: string
  title: string
  destination: string
  startDate: string
  endDate: string
  numberOfPeople: number
  budgetLevel: string
  totalEstimatedCost?: number
  createdAt: string
}

export default function MyItinerariesPage() {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [itineraries, setItineraries] = useState<Itinerary[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/login')
    }
  }, [status])

  useEffect(() => {
    if (session) {
      fetchItineraries()
    }
  }, [session])

  const fetchItineraries = async () => {
    try {
      const response = await fetch('/api/itineraries')
      if (!response.ok) {
        throw new Error('Failed to fetch itineraries')
      }
      const data = await response.json()
      setItineraries(data)
    } catch (error) {
      console.error('Error fetching itineraries:', error)
      toast({
        title: "Error loading itineraries",
        description: "Please try refreshing the page.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteItinerary = async (id: string) => {
    if (!confirm('Are you sure you want to delete this itinerary? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/itineraries/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete itinerary')
      }

      setItineraries(prev => prev.filter(itinerary => itinerary.id !== id))
      toast({
        title: "Itinerary deleted",
        description: "The itinerary has been removed successfully.",
      })
    } catch (error) {
      console.error('Error deleting itinerary:', error)
      toast({
        title: "Error deleting itinerary",
        description: "Please try again later.",
        variant: "destructive"
      })
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-primary/5">
        <Header />
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading your itineraries...</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-primary/5">
      <Header />
      
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 flex items-center justify-center space-x-3">
            <Navigation className="h-8 w-8 text-primary" />
            <span>My Itineraries</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your travel adventures, organized and ready to explore.
          </p>
        </motion.div>

        {/* Content */}
        {itineraries.length === 0 ? (
          // Empty State
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <div className="mb-8">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                  <MapPin className="h-12 w-12 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-4">
                No itineraries yet
              </h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Start planning your next adventure! Our AI will create a personalized 
                itinerary based on your preferences and travel style.
              </p>
              <Link href="/planner">
                <Button size="lg" className="px-8">
                  <Plus className="mr-2 h-5 w-5" />
                  Plan Your First Trip
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : (
          // Itineraries Grid
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex justify-between items-center mb-8"
            >
              <h2 className="text-2xl font-semibold">
                {itineraries.length} {itineraries.length === 1 ? 'Itinerary' : 'Itineraries'}
              </h2>
              <Link href="/planner">
                <Button className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>New Trip</span>
                </Button>
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {itineraries.map((itinerary, index) => (
                <motion.div
                  key={itinerary.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.1 + (index * 0.1),
                    ease: "easeOut"
                  }}
                >
                  <ItineraryCard
                    itinerary={itinerary}
                    onDelete={handleDeleteItinerary}
                  />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
