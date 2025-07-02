
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/db'
import { z } from 'zod'

export const dynamic = "force-dynamic";

const createItinerarySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  destination: z.string().min(1, 'Destination is required'),
  startDate: z.string(),
  endDate: z.string(),
  numberOfPeople: z.number().min(1),
  budgetLevel: z.enum(['Budget', 'Mid-Range', 'Luxury']),
  travelStyle: z.array(z.string()),
  accommodationPrefs: z.array(z.string()),
  dietaryRestrictions: z.string().optional(),
  accessibilityNeeds: z.string().optional(),
  aiGeneratedPlan: z.any(),
  totalEstimatedCost: z.number().optional(),
})

// GET - Fetch user's itineraries
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const itineraries = await prisma.itinerary.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        destination: true,
        startDate: true,
        endDate: true,
        numberOfPeople: true,
        budgetLevel: true,
        totalEstimatedCost: true,
        createdAt: true
      }
    })

    return NextResponse.json(itineraries)
  } catch (error) {
    console.error('Error fetching itineraries:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new itinerary
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = createItinerarySchema.parse(body)

    const itinerary = await prisma.itinerary.create({
      data: {
        ...validatedData,
        startDate: new Date(validatedData.startDate),
        endDate: new Date(validatedData.endDate),
        userId: user.id,
        aiGeneratedPlan: validatedData.aiGeneratedPlan || {},
      }
    })

    return NextResponse.json(itinerary)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      )
    }

    console.error('Error creating itinerary:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
