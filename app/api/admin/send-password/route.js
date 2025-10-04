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

    // 🔑 LOG PASSWORD FOR DEBUGGING (Remove in production)
    console.log('═══════════════════════════════════════════════════════')
    console.log('🔐 PASSWORD GENERATED FOR:', employee.name, `(${email})`)
    console.log('📧 Email:', email)
    console.log('🔑 Password:', randomPassword)
    console.log('🆔 Employee ID:', employeeId)
    console.log('🏢 Company ID:', employee.company.id)
    console.log('═══════════════════════════════════════════════════════')

    // Update employee with hashed password
    await prisma.user.update({
      where: { id: employeeId },
      data: { password: hashedPassword },
    })

    // Send password email (may fail if email not configured)
    try {
      await sendEmployeePasswordEmail(
        email,
        employee.name || 'User',
        randomPassword,
        employee.company.id
      )
      console.log('✅ Email sent successfully to:', email)
    } catch (emailError) {
      console.log('⚠️ Email sending failed (check SMTP config):', emailError.message)
      console.log('💡 Password is still saved and logged above!')
    }

    return NextResponse.json({
      success: true,
      message: `Password generated and saved! Check console for password.`,
      password: randomPassword, // Temporary: included in response for debugging
    })
  } catch (error) {
    console.error('❌ Send password error:', error)
    return NextResponse.json(
      { error: 'Failed to generate password. Please try again.' },
      { status: 500 }
    )
  }
}
