
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Header } from '@/components/header'
import { ItineraryDisplay } from '@/components/itinerary-display'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
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
  aiGeneratedPlan: any
}

export default function ItineraryPage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const { toast } = useToast()
  const [itinerary, setItinerary] = useState<Itinerary | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/login')
    }
  }, [status])

  useEffect(() => {
    if (session && params.id) {
      fetchItinerary()
    }
  }, [session, params.id])

  const fetchItinerary = async () => {
    try {
      const response = await fetch(`/api/itineraries/${params.id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          toast({
            title: "Itinerary not found",
            description: "The requested itinerary could not be found.",
            variant: "destructive"
          })
          redirect('/my-itineraries')
          return
        }
        throw new Error('Failed to fetch itinerary')
      }

      const data = await response.json()
      setItinerary(data)
    } catch (error) {
      console.error('Error fetching itinerary:', error)
      toast({
        title: "Error loading itinerary",
        description: "Please try again later.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-primary/5">
        <Header />
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading your itinerary...</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!itinerary) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-primary/5">
        <Header />
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">
              Itinerary not found
            </h1>
            <p className="text-muted-foreground mt-2">
              The requested itinerary could not be found.
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-primary/5">
      <Header />
      <ItineraryDisplay itinerary={itinerary} />
    </main>
  )
}
