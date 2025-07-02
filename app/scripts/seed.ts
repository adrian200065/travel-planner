
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('johndoe123', 12);
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      name: 'John Doe',
      password: hashedPassword,
      preferences: {
        create: {
          travelStyle: ['Cultural', 'Relaxing'],
          accommodationPrefs: ['Hotel', 'Vacation Rental'],
          budgetPreference: 'Mid-Range'
        }
      }
    }
  });

  // Create sample itinerary for demo user
  await prisma.itinerary.upsert({
    where: { id: 'demo-itinerary-1' },
    update: {},
    create: {
      id: 'demo-itinerary-1',
      userId: demoUser.id,
      title: '7 Days in Paris',
      destination: 'Paris, France',
      startDate: new Date('2025-08-15'),
      endDate: new Date('2025-08-22'),
      numberOfPeople: 2,
      budgetLevel: 'Mid-Range',
      travelStyle: ['Cultural', 'Relaxing'],
      accommodationPrefs: ['Hotel'],
      totalEstimatedCost: 2800,
      aiGeneratedPlan: {
        summary: "A perfect week in Paris combining iconic sights with local culture",
        days: [
          {
            day: 1,
            date: "2025-08-15",
            title: "Arrival & Classic Paris",
            activities: [
              {
                time: "10:00 AM - 12:00 PM",
                title: "Eiffel Tower Visit",
                description: "Start your Paris adventure with the iconic Eiffel Tower",
                type: "Sightseeing",
                estimatedCost: 30,
                transportation: "Metro Line 6 to Bir-Hakeim"
              },
              {
                time: "12:30 PM - 2:00 PM",
                title: "Lunch at Café de l'Homme",
                description: "Traditional French cuisine with Eiffel Tower views",
                type: "Restaurant",
                estimatedCost: 85,
                transportation: "5-minute walk from Eiffel Tower"
              },
              {
                time: "3:00 PM - 6:00 PM",
                title: "Louvre Museum",
                description: "Explore the world's largest art museum",
                type: "Museum",
                estimatedCost: 20,
                transportation: "Metro Line 1 to Palais-Royal"
              }
            ]
          }
        ]
      }
    }
  });

  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
