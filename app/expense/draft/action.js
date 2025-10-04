'use server';

import { prisma } from '@/lib/prisma'; // This will be created later

export async function processDraftExpenses(expenses) {
  try {
    if (!Array.isArray(expenses) || expenses.length === 0) {
      return {
        success: false,
        message: 'No expenses provided'
      };
    }

    // TODO: Replace with actual Prisma createMany operation
    const createdExpenses = await prisma.expense.createMany({
      data: expenses.map(expense => ({
        transactionDate: expense.transaction_date,
        totalAmount: expense.total_amount,
        category: expense.category || 'General',
        lineItems: expense.line_items || [],
        status: 'DRAFT'
      }))
    });

    return {
      success: true,
      message: `Successfully processed ${expenses.length} draft expenses`,
      expenses: createdExpenses
    };

  } catch (error) {
    console.error('Error processing draft expenses:', error);
    return {
      success: false,
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
  }
}
