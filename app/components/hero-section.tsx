'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="relative h-full w-full bg-muted">
          <Image
            src="https://thumbs.dreamstime.com/b/mesmerizing-aerial-view-maldives-island-s-tropical-beach-its-crystal-clear-turquoise-waters-white-sand-palm-tree-278062469.jpg"
            alt="Beautiful travel destination"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-hero-gradient" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center mb-6"
          >
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <Sparkles className="h-4 w-4 text-warning" />
              <span className="text-sm font-medium">AI-Powered Planning</span>
            </div>
          </motion.div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Craft your next adventure,{' '}
            <motion.span
              className="text-warning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              instantly
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed max-w-3xl mx-auto"
          >
            Tell us your travel dreams, and our AI will build a personalized, 
            day-by-day itinerary just for you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/planner">
              <Button 
                size="lg"
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4 h-auto shadow-2xl hover:shadow-xl transition-all duration-200 group"
              >
                Start Planning for Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Link href="/login">
              <Button 
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4 h-auto backdrop-blur-sm"
              >
                Already have an account?
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-12 text-white/70"
          >
            <p className="text-sm">
              No credit card required • Create unlimited itineraries
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float">
        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20" />
      </div>
      <div className="absolute bottom-32 right-12 animate-float" style={{ animationDelay: '2s' }}>
        <div className="w-12 h-12 rounded-full bg-warning/20 backdrop-blur-sm border border-warning/30" />
      </div>
      <div className="absolute top-1/3 right-20 animate-float" style={{ animationDelay: '4s' }}>
        <div className="w-8 h-8 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30" />
      </div>
    </section>
  )
}