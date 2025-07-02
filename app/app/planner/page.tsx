
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { TravelForm } from '@/components/travel-form'

export default async function PlannerPage() {
  const session = await getServerSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-primary/5">
      <Header />
      <TravelForm />
    </main>
  )
}
