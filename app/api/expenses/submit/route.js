import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.id || !session.user?.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const contentType = req.headers.get('content-type') || ''

    let payload = {}
    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData()
      payload = {
        amount: form.get('amount'),
        currency: form.get('currency'),
        category: form.get('category'),
        description: form.get('description') || '',
        date: form.get('date'),
        // If you later support file upload storage, you can handle 'receipt' here
      }
    } else {
      payload = await req.json()
    }

    const amount = parseFloat(payload.amount)
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const currency = String(payload.currency || '').trim()
    const category = String(payload.category || '').trim()
    const description = String(payload.description || '').trim()
    const dateInput = payload.date ? new Date(payload.date) : new Date()

    if (!currency) return NextResponse.json({ error: 'Currency is required' }, { status: 400 })
    if (!category) return NextResponse.json({ error: 'Category is required' }, { status: 400 })
    if (Number.isNaN(dateInput.getTime())) return NextResponse.json({ error: 'Invalid date' }, { status: 400 })

    // Optional line items payload from manual form
    const items = payload.items || payload.lineItems || null

    const expense = await prisma.expense.create({
      data: {
        companyId: session.user.companyId,
        submittedById: session.user.id,
        amount: amount,
        currency,
        category,
        description: description || null,
        date: dateInput,
        status: 'PENDING',
        items: items ? items : undefined,
      },
    })

    return NextResponse.json({ id: expense.id, status: expense.status }, { status: 201 })
  } catch (err) {
    console.error('Expense submit error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}