import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const expenses = await prisma.expense.findMany({
      where: { submittedById: session.user.id },
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

    return NextResponse.json(expenses, { status: 200 })
  } catch (err) {
    console.error('Recent expenses error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
