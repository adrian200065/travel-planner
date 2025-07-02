'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Heart, 
  Home,
  Loader2,
  Sparkles
} from 'lucide-react'

interface TravelFormData {
  destination: string
  startDate: string
  endDate: string
  numberOfPeople: number
  budgetLevel: string
  travelStyle: string[]
  accommodationPrefs: string[]
  dietaryRestrictions: string
  accessibilityNeeds: string
}

const travelStyles = [
  { id: 'relaxing', label: 'Relaxing' },
  { id: 'adventurous', label: 'Adventurous' },
  { id: 'cultural', label: 'Cultural' },
  { id: 'family-friendly', label: 'Family-Friendly' },
  { id: 'nightlife', label: 'Nightlife' },
  { id: 'nature', label: 'Nature & Outdoors' }
]

const accommodationTypes = [
  { id: 'hotel', label: 'Hotel' },
  { id: 'hostel', label: 'Hostel' },
  { id: 'vacation-rental', label: 'Vacation Rental' },
  { id: 'resort', label: 'Resort' },
  { id: 'boutique', label: 'Boutique Hotel' }
]

export function TravelForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<TravelFormData>({
    destination: '',
    startDate: '',
    endDate: '',
    numberOfPeople: 1,
    budgetLevel: '',
    travelStyle: [],
    accommodationPrefs: [],
    dietaryRestrictions: '',
    accessibilityNeeds: ''
  })

  const handleInputChange = (field: keyof TravelFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCheckboxChange = (field: 'travelStyle' | 'accommodationPrefs', value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.destination || !formData.startDate || !formData.endDate || !formData.budgetLevel) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast({
        title: "Invalid Dates",
        description: "End date must be after start date.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    try {
      // Generate itinerary with AI
      const response = await fetch('/api/ai/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to generate itinerary')
      }

      const aiGeneratedPlan = await response.json()

      // Save itinerary to database
      const saveResponse = await fetch('/api/itineraries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24))} Days in ${formData.destination}`,
          ...formData,
          aiGeneratedPlan,
          totalEstimatedCost: aiGeneratedPlan.totalEstimatedCost
        })
      })

      if (!saveResponse.ok) {
        throw new Error('Failed to save itinerary')
      }

      const savedItinerary = await saveResponse.json()

      toast({
        title: "Itinerary Created! ✈️",
        description: "Your personalized travel plan is ready.",
      })

      router.push(`/itinerary/${savedItinerary.id}`)

    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Something went wrong",
        description: "Please try again. If the problem persists, contact support.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          Plan Your <span className="text-primary">Perfect Trip</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Tell us about your dream destination and preferences. Our AI will create 
          a personalized itinerary just for you.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span>The Basics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination *</Label>
                  <Input
                    id="destination"
                    placeholder="e.g., Paris, France"
                    value={formData.destination}
                    onChange={(e) => handleInputChange('destination', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numberOfPeople">Number of People *</Label>
                  <Input
                    id="numberOfPeople"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.numberOfPeople}
                    onChange={(e) => handleInputChange('numberOfPeople', parseInt(e.target.value) || 1)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Budget Level *</Label>
                <Select 
                  value={formData.budgetLevel} 
                  onValueChange={(value) => handleInputChange('budgetLevel', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your budget preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Budget">Budget - Save money where possible</SelectItem>
                    <SelectItem value="Mid-Range">Mid-Range - Balance cost and comfort</SelectItem>
                    <SelectItem value="Luxury">Luxury - Premium experiences</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Travel Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-primary" />
                <span>Your Travel Style</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>What kind of experience are you looking for? (Select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {travelStyles.map((style) => (
                    <div key={style.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={style.id}
                        checked={formData.travelStyle.includes(style.id)}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('travelStyle', style.id, checked as boolean)
                        }
                      />
                      <Label htmlFor={style.id} className="text-sm font-normal">
                        {style.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Accommodation Preferences (Select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {accommodationTypes.map((type) => (
                    <div key={type.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={type.id}
                        checked={formData.accommodationPrefs.includes(type.id)}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('accommodationPrefs', type.id, checked as boolean)
                        }
                      />
                      <Label htmlFor={type.id} className="text-sm font-normal">
                        {type.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Additional Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Home className="h-5 w-5 text-primary" />
                <span>Additional Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
                  <Input
                    id="dietaryRestrictions"
                    placeholder="e.g., Vegetarian, Gluten-free, Halal"
                    value={formData.dietaryRestrictions}
                    onChange={(e) => handleInputChange('dietaryRestrictions', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accessibilityNeeds">Accessibility Needs</Label>
                  <Input
                    id="accessibilityNeeds"
                    placeholder="e.g., Wheelchair accessible, Mobility assistance"
                    value={formData.accessibilityNeeds}
                    onChange={(e) => handleInputChange('accessibilityNeeds', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                AI is planning your trip...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Generate My Itinerary
              </>
            )}
          </Button>
          
          {isLoading && (
            <p className="mt-4 text-sm text-muted-foreground">
              This may take a few moments while our AI crafts your perfect itinerary
            </p>
          )}
        </motion.div>
      </form>
    </div>
  )
}