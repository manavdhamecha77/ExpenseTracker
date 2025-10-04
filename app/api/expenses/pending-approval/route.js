import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      console.log('❌ Pending Approval: No session or user')
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('🔍 Pending Approval: User role =', session.user.role, '| User ID =', session.user.id)

    // Check if user is a manager or admin
    if (session.user.role !== 'MANAGER' && session.user.role !== 'ADMIN') {
      console.log('⛔ Pending Approval: Access denied for role:', session.user.role)
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
      return NextResponse.json([])
    }

    // Fetch pending expenses from employees reporting to this manager
    const pendingExpenses = await prisma.expense.findMany({
      where: {
        submittedById: {
          in: employeeIds
        },
        status: {
          in: ['PENDING', 'IN_PROGRESS']
        }
      },
      include: {
        submitter: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        approvers: {
          where: {
            approverId: managerId
          },
          include: {
            approver: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        approvals: {
          where: {
            approverId: managerId
          },
          include: {
            approver: {
              select: {
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Filter expenses where manager is in pending status
    const filteredExpenses = pendingExpenses.filter(expense => {
      const managerApprover = expense.approvers.find(a => a.approverId === managerId)
      return managerApprover && managerApprover.status === 'PENDING'
    })

    return NextResponse.json(filteredExpenses)

  } catch (error) {
    console.error('Error fetching pending expenses:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
