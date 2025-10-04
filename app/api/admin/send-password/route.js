import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { hash } from 'bcryptjs'
import prisma from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { generateRandomPassword, sendEmployeePasswordEmail } from '@/lib/email'

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { employeeId, email } = await request.json()

    // Get employee details
    const employee = await prisma.user.findUnique({
      where: { id: employeeId },
      include: {
        company: true,
      },
    })

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      )
    }

    // Generate random password
    const randomPassword = generateRandomPassword()
    const hashedPassword = await hash(randomPassword, 12)

    // Update employee with hashed password
    await prisma.user.update({
      where: { id: employeeId },
      data: { password: hashedPassword },
    })

    // Send password email
    await sendEmployeePasswordEmail(
      email,
      employee.name || 'User',
      randomPassword,
      employee.company.id
    )

    return NextResponse.json({
      success: true,
      message: `Password sent successfully to ${email}`,
    })
  } catch (error) {
    console.error('Send password error:', error)
    return NextResponse.json(
      { error: 'Failed to send password. Please try again.' },
      { status: 500 }
    )
  }
}
