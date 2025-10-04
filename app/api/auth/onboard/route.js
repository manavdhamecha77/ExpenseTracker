import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcryptjs from 'bcryptjs'
import { approvalWorkflowService } from '@/lib/approval-workflow'

export async function POST(request) {
  try {
    const data = await request.json()
    const {
      companyName,
      companyDescription,
      industry,
      adminName,
      adminEmail,
      adminPassword,
      country,
      currency,
      currencySymbol,
      companyId
    } = data

    // Check if company ID already exists
    const existingCompany = await prisma.company.findFirst({
      where: { 
        OR: [
          { id: companyId },
          { name: companyName }
        ]
      }
    })

    if (existingCompany) {
      return NextResponse.json(
        { error: 'Company name or ID already exists' },
        { status: 400 }
      )
    }

    // Check if admin email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(adminPassword, 12)

    // Create company and admin user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create company
      const company = await tx.company.create({
        data: {
          id: companyId,
          name: companyName,
          country,
          currency,
          // Add optional fields
          ...(companyDescription && { description: companyDescription }),
          ...(industry && { industry })
        }
      })

      // 2. Create company settings
      await tx.companySetting.create({
        data: {
          companyId: company.id,
          approvalRequired: true,
          managerApprovalFirst: true,
          sequentialApproval: true
        }
      })

      // 3. Create admin user
      const adminUser = await tx.user.create({
        data: {
          name: adminName,
          email: adminEmail,
          password: hashedPassword,
          role: 'ADMIN',
          companyId: company.id
        }
      })

      return { company, adminUser }
    })

    // 4. Create default approval workflows and rules (outside transaction)
    try {
      await approvalWorkflowService.createDefaultWorkflows(result.company.id)
      await approvalWorkflowService.createDefaultApprovalRules(result.company.id)
    } catch (workflowError) {
      console.warn('Failed to create default workflows:', workflowError)
      // Don't fail the entire operation if workflow creation fails
    }

    return NextResponse.json({
      success: true,
      companyId: result.company.id,
      message: 'Company and admin account created successfully'
    })

  } catch (error) {
    console.error('Onboarding error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}