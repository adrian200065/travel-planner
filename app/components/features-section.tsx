'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Brain, 
  Clock, 
  Heart, 
  MapPin, 
  Wallet, 
  Users 
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Intelligence',
    description: 'Our advanced AI understands your preferences and creates personalized itineraries that match your travel style perfectly.'
  },
  {
    icon: Clock,
    title: 'Save Hours of Planning',
    description: 'Get a complete day-by-day itinerary in minutes, not hours. Focus on excitement, not endless research.'
  },
  {
    icon: Heart,
    title: 'Perfectly Personalized',
    description: 'From budget preferences to dietary needs, every recommendation is tailored specifically for you.'
  },
  {
    icon: MapPin,
    title: 'Local Insights',
    description: 'Discover hidden gems and authentic experiences that only locals know about, powered by comprehensive data.'
  },
  {
    icon: Wallet,
    title: 'Budget-Aware Planning',
    description: 'Stay within your budget with cost estimates and recommendations that match your spending preferences.'
  },
  {
    icon: Users,
    title: 'Group-Friendly',
    description: 'Planning for family, friends, or solo? Our AI adapts to any group size and dynamic.'
  }
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Why choose <span className="text-primary">Waypointr</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the future of travel planning with intelligent recommendations, 
            personalized itineraries, and seamless organization.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 group border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}