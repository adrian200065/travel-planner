
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

export const dynamic = "force-dynamic";

interface TravelRequest {
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

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const travelRequest: TravelRequest = await request.json()
    
    // Calculate duration
    const startDate = new Date(travelRequest.startDate)
    const endDate = new Date(travelRequest.endDate)
    const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    // Create AI prompt
    const prompt = `You are an expert travel planner. Create a detailed ${duration}-day itinerary for ${travelRequest.destination} for ${travelRequest.numberOfPeople} people.

Travel Details:
- Destination: ${travelRequest.destination}
- Duration: ${duration} days (${travelRequest.startDate} to ${travelRequest.endDate})
- Number of people: ${travelRequest.numberOfPeople}
- Budget level: ${travelRequest.budgetLevel}
- Travel style: ${travelRequest.travelStyle.join(', ')}
- Accommodation preferences: ${travelRequest.accommodationPrefs.join(', ')}
${travelRequest.dietaryRestrictions ? `- Dietary restrictions: ${travelRequest.dietaryRestrictions}` : ''}
${travelRequest.accessibilityNeeds ? `- Accessibility needs: ${travelRequest.accessibilityNeeds}` : ''}

Please provide a comprehensive day-by-day itinerary including:
1. A brief summary of the trip
2. For each day, provide 3-6 activities with:
   - Time slots (e.g., "9:00 AM - 11:00 AM")
   - Activity title and description
   - Type (Sightseeing, Restaurant, Museum, etc.)
   - Estimated cost per person in USD
   - Transportation suggestions
3. Total estimated cost for the entire trip

Format your response as valid JSON with this structure:
{
  "summary": "Brief trip overview",
  "totalEstimatedCost": number,
  "days": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "title": "Day title",
      "activities": [
        {
          "time": "9:00 AM - 11:00 AM",
          "title": "Activity name",
          "description": "Activity description",
          "type": "Activity type",
          "estimatedCost": number,
          "transportation": "How to get there"
        }
      ]
    }
  ]
}

Respond with raw JSON only. Do not include code blocks, markdown, or any other formatting.`

    // Call Gemini AI API
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      }),
    })

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`)
    }

    const aiResponse = await response.json()
    let itineraryData

    try {
      // Clean and parse the JSON response
      let jsonString = aiResponse.choices?.[0]?.message?.content || ''
      
      // Remove any markdown code blocks if present
      jsonString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '')
      
      // Remove any leading/trailing whitespace
      jsonString = jsonString.trim()
      
      // Parse the JSON
      itineraryData = JSON.parse(jsonString)
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError)
      console.error('AI Response content:', aiResponse.choices?.[0]?.message?.content)
      
      // Fallback: create a basic itinerary structure
      itineraryData = {
        summary: `A wonderful ${duration}-day adventure in ${travelRequest.destination}`,
        totalEstimatedCost: duration * 150 * travelRequest.numberOfPeople,
        days: Array.from({ length: duration }, (_, index) => ({
          day: index + 1,
          date: new Date(startDate.getTime() + index * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          title: `Day ${index + 1} in ${travelRequest.destination}`,
          activities: [
            {
              time: "9:00 AM - 12:00 PM",
              title: "Morning Exploration",
              description: `Explore the highlights of ${travelRequest.destination}`,
              type: "Sightseeing",
              estimatedCost: 30,
              transportation: "Walking or local transport"
            },
            {
              time: "12:00 PM - 2:00 PM",
              title: "Local Lunch",
              description: "Enjoy authentic local cuisine",
              type: "Restaurant",
              estimatedCost: 25,
              transportation: "Short walk"
            },
            {
              time: "3:00 PM - 6:00 PM",
              title: "Afternoon Activity",
              description: "Continue discovering local attractions",
              type: "Sightseeing",
              estimatedCost: 40,
              transportation: "Public transport"
            }
          ]
        }))
      }
    }

    return NextResponse.json(itineraryData)

  } catch (error) {
    console.error('Error generating itinerary:', error)
    return NextResponse.json(
      { error: 'Failed to generate itinerary. Please try again.' },
      { status: 500 }
    )
  }
}
