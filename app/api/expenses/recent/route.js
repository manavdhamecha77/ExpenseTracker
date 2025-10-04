import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Fetch recent expenses for the employee
    const recentExpenses = await prisma.expense.findMany({
      where: { submittedById: userId },
      orderBy: { date: 'desc' },
      take: 10,
      select: {
        id: true,
        amount: true,
        currency: true,
        category: true,
        description: true,
        date: true,
        status: true,
      },
    })

    return Response.json(recentExpenses)
  } catch (error) {
    console.error('Failed to fetch recent expenses:', error)
    return Response.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    )
  }
}