// 'use server';

// import { prisma } from '@/lib/prisma';

// /**
//  * Server action to save expense data to draft
//  * @param {Object} expenseData - The expense data to save
//  * @returns {Promise<Object>} - Result with success/error status
//  */
// export async function saveToDraft(expenseData) {
//   try {
//     console.log('Saving expense to draft:', expenseData);

//     // Validate required fields
//     const { date, total, currency, currencySymbol, category, lineItems } = expenseData;
    
//     if (!date || !total || !currency || !currencySymbol) {
//       return {
//         success: false,
//         message: 'Missing required fields: date, total, currency, or currencySymbol'
//       };
//     }

//     // Parse total as float to validate
//     const totalAmount = parseFloat(total);
//     if (isNaN(totalAmount)) {
//       return {
//         success: false,
//         message: 'Invalid total amount'
//       };
//     }

//     // TODO: Replace with actual Prisma create operation
//     const draftExpense = await prisma.expense.create({
//       data: {
//         date,
//         total: totalAmount,
//         currency,
//         currencySymbol,
//         category: category || 'General',
//         lineItems: lineItems || [],
//         status: 'PENDING'
//       }
//     });

//     console.log('Expense saved successfully to draft');

//     return {
//       success: true,
//       message: 'Expense saved to draft successfully!',
//       expense: draftExpense
//     };

//   } catch (error) {
//     console.error('Error saving expense to draft:', error);
//     return {
//       success: false,
//       message: 'Failed to save expense to draft. Please try again.',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     };
//   }
// }
//       success: false,
//       message: 'Failed to save expense to draft. Please try again.',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     };
//   }
// }
