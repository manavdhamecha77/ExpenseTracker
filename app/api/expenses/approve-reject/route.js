import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is a manager or admin
    if (session.user.role !== 'MANAGER' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Access denied. Manager or Admin role required.' },
        { status: 403 }
      )
    }

    const { expenseId, decision, comment } = await request.json()

    if (!expenseId || !decision) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!['APPROVE', 'REJECT'].includes(decision)) {
      return NextResponse.json(
        { message: 'Invalid decision. Must be APPROVE or REJECT' },
        { status: 400 }
      )
    }

    if (decision === 'REJECT' && !comment) {
      return NextResponse.json(
        { message: 'Comment is required for rejection' },
        { status: 400 }
      )
    }

    const managerId = session.user.id

    // Verify expense exists and manager has approval rights
    const expense = await prisma.expense.findUnique({
      where: { id: expenseId },
      include: {
        approvers: {
          where: {
            approverId: managerId
          }
        },
        submitter: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!expense) {
      return NextResponse.json(
        { message: 'Expense not found' },
        { status: 404 }
      )
    }

    const managerApprover = expense.approvers.find(a => a.approverId === managerId)
    
    if (!managerApprover) {
      return NextResponse.json(
        { message: 'You are not an approver for this expense' },
        { status: 403 }
      )
    }

    if (managerApprover.status !== 'PENDING') {
      return NextResponse.json(
        { message: 'You have already provided a decision for this expense' },
        { status: 400 }
      )
    }

    // Perform the approval/rejection in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update the approver status
      await tx.expenseApprover.update({
        where: {
          id: managerApprover.id
        },
        data: {
          status: decision === 'APPROVE' ? 'APPROVED' : 'REJECTED'
        }
      })

      // Create approval decision record
      await tx.approvalDecision.create({
        data: {
          expenseId: expenseId,
          approverId: managerId,
          decision: decision,
          comment: comment || null,
          stepNumber: managerApprover.sequenceOrder
        }
      })

      // Create approval history entry
      const newStatus = decision === 'APPROVE' ? 'IN_PROGRESS' : 'REJECTED'
      
      await tx.approvalHistory.create({
        data: {
          expenseId: expenseId,
          action: decision === 'APPROVE' ? 'APPROVED' : 'REJECTED',
          performedBy: managerId,
          fromStatus: expense.status,
          toStatus: newStatus,
          comment: comment || null
        }
      })

      // Update expense status
      let finalStatus = expense.status
      
      if (decision === 'REJECT') {
        // If rejected, mark expense as rejected
        finalStatus = 'REJECTED'
      } else if (decision === 'APPROVE') {
        // Check if all required approvers have approved
        const allApprovers = await tx.expenseApprover.findMany({
          where: {
            expenseId: expenseId,
            isRequired: true
          }
        })

        const allApproved = allApprovers.every(
          a => a.id === managerApprover.id || a.status === 'APPROVED'
        )

        if (allApproved) {
          finalStatus = 'APPROVED'
        } else {
          finalStatus = 'IN_PROGRESS'
        }
      }

      // Update the expense
      const updatedExpense = await tx.expense.update({
        where: { id: expenseId },
        data: {
          status: finalStatus
        }
      })

      return updatedExpense
    })

    return NextResponse.json({
      message: `Expense ${decision.toLowerCase()}ed successfully`,
      expense: result
    })

  } catch (error) {
    console.error('Error processing approval/rejection:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
