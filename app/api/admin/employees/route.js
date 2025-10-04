import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { hash } from 'bcryptjs'
import prisma from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// GET - Fetch all employees
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const companyId = session.user.companyId

    // Fetch all employees in the company
    const employees = await prisma.user.findMany({
      where: { companyId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        reportsTo: {
          select: {
            manager: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Get managers for the dropdown
    const managers = await prisma.user.findMany({
      where: {
        companyId,
        role: { in: ['MANAGER', 'ADMIN'] },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    // Format employee data
    const formattedEmployees = employees.map(emp => ({
      id: emp.id,
      name: emp.name,
      email: emp.email,
      role: emp.role,
      managerName: emp.reportsTo[0]?.manager?.name || null,
      managerId: emp.reportsTo[0]?.manager?.id || null,
      isActive: true, // Can be enhanced with actual status tracking
    }))

    return NextResponse.json({
      employees: formattedEmployees,
      managers,
    })
  } catch (error) {
    console.error('Fetch employees error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    )
  }
}

// POST - Add new employee
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { name, email, role, managerId } = await request.json()
    const companyId = session.user.companyId

    // Validate input
    if (!name || !email || !role) {
      return NextResponse.json(
        { error: 'Name, email, and role are required' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists in the system' },
        { status: 400 }
      )
    }

    // Create user with temporary password (will be sent via email)
    // For now, create without password - will be set when password email is sent
    const user = await prisma.user.create({
      data: {
        name,
        email,
        role,
        companyId,
        password: null, // Will be set when password is sent
      },
    })

    // If manager is assigned, create the relationship
    if (managerId) {
      await prisma.employeeManager.create({
        data: {
          employeeId: user.id,
          managerId,
        },
      })
    }

    return NextResponse.json({
      success: true,
      employee: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: 'Employee added successfully. Click "Send Password" to send login credentials.',
    })
  } catch (error) {
    console.error('Add employee error:', error)
    return NextResponse.json(
      { error: 'Failed to add employee' },
      { status: 500 }
    )
  }
}
