
'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  Trash2,
  Eye
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface ItineraryCardProps {
  itinerary: {
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
  onDelete: (id: string) => void
}

export function ItineraryCard({ itinerary, onDelete }: ItineraryCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getDuration = () => {
    const start = new Date(itinerary.startDate)
    const end = new Date(itinerary.endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
        {/* Image Header */}
        <div className="relative h-48 w-full bg-muted">
          <Image
            src="https://img.freepik.com/premium-vector/breathtaking-travel-destination-landscape-poster_1332471-4901.jpg"
            alt={itinerary.destination}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Delete Button */}
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-3 right-3 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            onClick={(e) => {
              e.preventDefault()
              onDelete(itinerary.id)
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          {/* Destination Badge */}
          <div className="absolute bottom-3 left-3">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-gray-900">
              {itinerary.destination}
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Title */}
            <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
              {itinerary.title}
            </h3>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{getDuration()} days</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>{itinerary.numberOfPeople} {itinerary.numberOfPeople > 1 ? 'people' : 'person'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>{itinerary.budgetLevel}</span>
              </div>
              {itinerary.totalEstimatedCost && (
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4" />
                  <span>${itinerary.totalEstimatedCost?.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Dates */}
            <div className="text-sm text-muted-foreground">
              {formatDate(itinerary.startDate)} - {formatDate(itinerary.endDate)}
            </div>

            {/* View Button */}
            <Link href={`/itinerary/${itinerary.id}`} className="block">
              <Button className="w-full group/btn">
                <Eye className="mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                View Itinerary
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
