# Manager Approval Toggle Feature

## Overview
This feature allows employees to control whether their expense requests require manager approval by checking or unchecking the "Requires Manager Approval" checkbox when submitting an expense.

## How It Works

### 1. **Expense Submission (Employee Side)**

When an employee submits an expense, they see a checkbox labeled **"Requires Manager Approval"**:

- **✅ CHECKED (isManager = true)**
  - The expense will be sent to the employee's manager first
  - After manager approval, it proceeds to other approvers (Finance, Director, etc.)
  - This is the standard approval workflow
  
- **❌ UNCHECKED (isManager = false)**
  - The expense **skips** manager approval entirely
  - Goes directly to other approvers (Finance, Director, etc.)
  - Useful for urgent expenses or when manager approval is not needed

### 2. **Approval Workflow Logic**

The approval workflow in `lib/approval-workflow.js` checks the `isManager` flag:

```javascript
// Only add manager to approval chain if isManager is true
if ((workflow?.requireManager || !workflow) && expense.isManager) {
  const manager = submitter.reportsTo[0]?.manager;
  if (manager) {
    approvers.push({
      expenseId: expense.id,
      approverId: manager.id,
      sequenceOrder: sequenceOrder++,
      isManager: true,
      isRequired: true,
      status: 'PENDING',
      isActive: true
    });
  }
}
```

### 3. **Database Schema**

The `Expense` model includes the `isManager` field:

```prisma
model Expense {
  id              String       @id @default(cuid())
  companyId       String
  submittedById   String
  amount          Float
  currency        String
  category        String
  description     String?
  date            DateTime
  status          ExpenseStatus @default(PENDING)
  isManager       Boolean      @default(false) // ← Controls manager approval
  // ... other fields
}
```

## User Interface

### **Employee Expense Submission Form**

Location: `components/ExpenseSubmissionForm.js`

```
┌─────────────────────────────────────────────────┐
│ ☑️ Requires Manager Approval                    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ 📋 Approval workflow:                           │
│ ✓ This expense will be sent to your manager    │
│   for approval first, then proceed to other    │
│   approvers (Finance, Director, etc.)          │
└─────────────────────────────────────────────────┘
```

OR (when unchecked):

```
┌─────────────────────────────────────────────────┐
│ ☐ Requires Manager Approval                    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ 📋 Approval workflow:                           │
│ ⚠️ This expense will skip manager approval    │
│   and go directly to other approvers           │
│   (Finance, Director, etc.)                    │
└─────────────────────────────────────────────────┘
```

## Implementation Files

### Modified/Created Files:
1. **`components/ExpenseSubmissionForm.js`** - Added checkbox UI with visual feedback
2. **`app/api/expenses/submit/route.js`** - Handles `isManager` field in POST request
3. **`lib/approval-workflow.js`** - Contains logic to check `isManager` flag
4. **`prisma/schema.prisma`** - Defines `isManager` field in Expense model

## Use Cases

### When to CHECK "Requires Manager Approval" ✅
- Regular expense submissions
- Large amounts that need manager oversight
- Following company policy for hierarchical approval
- When you want your manager to be aware of the expense

### When to UNCHECK "Requires Manager Approval" ❌
- Urgent expenses that need quick approval
- Small amounts under a certain threshold
- When manager is unavailable (vacation, sick leave)
- Pre-approved expenses that don't need manager review
- Direct submissions to Finance/Director

## Admin Controls (Future Enhancement)

Potential admin settings that could be added:

1. **Force Manager Approval for Amounts > X**
   - Automatically require manager approval for expenses above a threshold
   
2. **Default Behavior Setting**
   - Set whether checkbox is checked or unchecked by default
   
3. **Role-Based Rules**
   - Different rules for EMPLOYEE vs MANAGER vs DIRECTOR
   
4. **Category-Based Rules**
   - Certain categories always require manager approval

## Testing

### Test Scenario 1: With Manager Approval
1. Employee submits expense with checkbox **CHECKED**
2. Expense status: `PENDING`
3. Manager sees expense in `/dashboard/manager`
4. Manager approves/rejects
5. If approved, expense moves to next approver

### Test Scenario 2: Without Manager Approval
1. Employee submits expense with checkbox **UNCHECKED**
2. Expense status: `PENDING`
3. Manager **DOES NOT** see expense in `/dashboard/manager`
4. Expense goes directly to Finance/Director
5. Finance/Director approves/rejects

## Security Considerations

- ✅ Employee controls their own approval workflow
- ✅ Backend validates all submissions
- ✅ Audit trail maintained in `ApprovalHistory`
- ✅ Managers can still view all expenses (read-only)
- ⚠️ Consider adding admin override capability

## Future Enhancements

1. **Smart Defaults**
   - Auto-check based on amount, category, or history
   
2. **Approval Rules Engine**
   - Admin-defined rules that override employee choice
   
3. **Notification System**
   - Alert manager when they're bypassed
   
4. **Analytics**
   - Track how often manager approval is skipped
   - Identify patterns and potential issues

## Summary

The `isManager` flag provides flexibility in the approval workflow:
- **TRUE** = Standard workflow with manager approval
- **FALSE** = Skip manager, go to other approvers

This gives employees control while maintaining audit trails and approval integrity.
