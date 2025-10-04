import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      console.log('❌ Manager Stats: No session or user')
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('🔍 Manager Stats: User role =', session.user.role, '| User ID =', session.user.id)

    // Check if user is a manager or admin
    if (session.user.role !== 'MANAGER' && session.user.role !== 'ADMIN') {
      console.log('⛔ Manager Stats: Access denied for role:', session.user.role)
      return NextResponse.json(
        { message: `Access denied. Manager or Admin role required. Your role: ${session.user.role}` },
        { status: 403 }
      )
    }

    const managerId = session.user.id

    // Get all employees reporting to this manager
    const employeeRelations = await prisma.employeeManager.findMany({
      where: {
        managerId: managerId
      },
      select: {
        employeeId: true
      }
    })

    const employeeIds = employeeRelations.map(rel => rel.employeeId)

    if (employeeIds.length === 0) {
      return NextResponse.json({
        pending: 0,
        approved: 0,
        rejected: 0,
        totalAmount: 0
      })
    }

    // Get current month range
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

    // Count pending expenses
    const pendingCount = await prisma.expense.count({
      where: {
        submittedById: {
          in: employeeIds
        },
        status: {
          in: ['PENDING', 'IN_PROGRESS']
        },
        approvers: {
          some: {
            approverId: managerId,
            status: 'PENDING'
          }
        }
      }
    })

    // Count approved expenses (this month)
    const approvedCount = await prisma.approvalDecision.count({
      where: {
        approverId: managerId,
        decision: 'APPROVE',
        createdAt: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth
        }
      }
    })

    // Count rejected expenses (this month)
    const rejectedCount = await prisma.approvalDecision.count({
      where: {
        approverId: managerId,
        decision: 'REJECT',
        createdAt: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth
        }
      }
    })

    // Calculate total pending amount
    const pendingExpenses = await prisma.expense.findMany({
      where: {
        submittedById: {
          in: employeeIds
        },
        status: {
          in: ['PENDING', 'IN_PROGRESS']
        },
        approvers: {
          some: {
            approverId: managerId,
            status: 'PENDING'
          }
        }
      },
      select: {
        amount: true
      }
    })

    const totalAmount = pendingExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0)

    return NextResponse.json({
      pending: pendingCount,
      approved: approvedCount,
      rejected: rejectedCount,
      totalAmount: Math.round(totalAmount * 100) / 100
    })

  } catch (error) {
    console.error('Error fetching manager stats:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
