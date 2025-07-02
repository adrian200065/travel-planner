
'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  Clock, 
  Utensils, 
  Camera, 
  Building,
  Share,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'

interface Activity {
  time: string
  title: string
  description: string
  type: string
  estimatedCost: number
  transportation: string
}

interface Day {
  day: number
  date: string
  title: string
  activities: Activity[]
}

interface ItineraryDisplayProps {
  itinerary: {
    id: string
    title: string
    destination: string
    startDate: string
    endDate: string
    numberOfPeople: number
    budgetLevel: string
    totalEstimatedCost?: number
    aiGeneratedPlan: {
      summary: string
      totalEstimatedCost?: number
      days: Day[]
    }
  }
}

const getActivityIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'restaurant':
    case 'dining':
      return Utensils
    case 'sightseeing':
    case 'museum':
    case 'attraction':
      return Camera
    case 'accommodation':
    case 'hotel':
      return Building
    default:
      return MapPin
  }
}

export function ItineraryDisplay({ itinerary }: ItineraryDisplayProps) {
  const { toast } = useToast()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDuration = () => {
    const start = new Date(itinerary.startDate)
    const end = new Date(itinerary.endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: itinerary.title,
          text: `Check out my ${getDuration()}-day itinerary for ${itinerary.destination}!`,
          url: window.location.href,
        })
        toast({
          title: "Shared successfully!",
          description: "Your itinerary has been shared.",
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link copied!",
          description: "Itinerary link has been copied to your clipboard.",
        })
      } catch (error) {
        toast({
          title: "Unable to share",
          description: "Please copy the URL manually to share this itinerary.",
        })
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <Link href="/my-itineraries">
            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to My Itineraries</span>
            </Button>
          </Link>
          
          <Button onClick={handleShare} variant="outline" size="sm" className="flex items-center space-x-2">
            <Share className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          {itinerary.title}
        </h1>
        
        <p className="text-xl text-muted-foreground mb-6">
          {itinerary.aiGeneratedPlan?.summary}
        </p>

        {/* Trip Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{itinerary.destination}</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{getDuration()} days</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{itinerary.numberOfPeople} {itinerary.numberOfPeople > 1 ? 'people' : 'person'}</span>
          </div>
          {(itinerary.totalEstimatedCost || itinerary.aiGeneratedPlan?.totalEstimatedCost) && (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>${(itinerary.totalEstimatedCost || itinerary.aiGeneratedPlan?.totalEstimatedCost)?.toLocaleString()}</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Itinerary Days */}
      <div className="space-y-8">
        {itinerary.aiGeneratedPlan?.days?.map((day, dayIndex) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: dayIndex * 0.1 }}
          >
            <Card className="overflow-hidden border-l-4 border-l-primary">
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                    {day.day}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{day.title}</h3>
                    <p className="text-sm text-muted-foreground font-normal">
                      {formatDate(day.date)}
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="space-y-6">
                  {day.activities?.map((activity, activityIndex) => {
                    const IconComponent = getActivityIcon(activity.type)
                    
                    return (
                      <motion.div
                        key={activityIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: (dayIndex * 0.1) + (activityIndex * 0.05) }}
                        className="flex space-x-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors duration-200"
                      >
                        {/* Time & Icon */}
                        <div className="flex-shrink-0 text-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                          <div className="text-xs text-muted-foreground font-medium">
                            {activity.time?.split(' - ')[0]}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-grow">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-foreground">{activity.title}</h4>
                            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                              <DollarSign className="h-3 w-3" />
                              <span>${activity.estimatedCost}</span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                            {activity.description}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-1 text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{activity.time}</span>
                            </div>
                            
                            {activity.transportation && (
                              <div className="text-muted-foreground">
                                🚗 {activity.transportation}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Summary Footer */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-12 text-center"
      >
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4">Ready for your adventure?</h3>
            <p className="text-muted-foreground mb-6">
              Your personalized itinerary is ready. Don't forget to check local guidelines and book your accommodations in advance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/planner">
                <Button variant="outline">Plan Another Trip</Button>
              </Link>
              <Button onClick={handleShare}>Share This Itinerary</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
