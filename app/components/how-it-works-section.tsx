
'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { 
  MessageSquare, 
  Sparkles, 
  MapPin,
  ArrowRight
} from 'lucide-react'

const steps = [
  {
    icon: MessageSquare,
    number: 1,
    title: 'Describe Your Trip',
    description: 'Tell us where you want to go, your travel dates, budget, and preferences. Our AI listens to every detail.'
  },
  {
    icon: Sparkles,
    number: 2,
    title: 'AI Crafts Your Plan',
    description: 'Our intelligent system creates a personalized day-by-day itinerary with activities, restaurants, and transportation.'
  },
  {
    icon: MapPin,
    number: 3,
    title: 'Explore Your Itinerary',
    description: 'Review your custom itinerary, see estimated costs, and save it for your upcoming adventure.'
  }
]

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Planning made <span className="text-primary">simple</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three easy steps to your perfect trip. No complexity, just results.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Lines - Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20 -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.2,
                  ease: "easeOut"
                }}
                viewport={{ once: true }}
                className="relative"
              >
                <Card className="text-center border-2 hover:border-primary/50 transition-all duration-300 bg-card/80 backdrop-blur-sm hover:shadow-xl">
                  <CardContent className="p-8">
                    {/* Step Number */}
                    <div className="relative mx-auto mb-6">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold mx-auto shadow-lg">
                        {step.number}
                      </div>
                      <div className="absolute -inset-2 rounded-full bg-primary/20 animate-pulse" />
                    </div>

                    {/* Icon */}
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <step.icon className="h-6 w-6 text-primary" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold mb-4 text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Arrow - Desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-20">
                    <ArrowRight className="h-6 w-6 text-primary animate-pulse" />
                  </div>
                )}

                {/* Arrow - Mobile */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center py-4">
                    <ArrowRight className="h-6 w-6 text-primary animate-pulse rotate-90" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
