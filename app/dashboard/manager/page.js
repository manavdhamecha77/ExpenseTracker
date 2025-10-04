'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  DollarSign, 
  Calendar, 
  User,
  FileText,
  MessageSquare,
  TrendingUp,
  AlertCircle
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function ManagerDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  
  const [pendingExpenses, setPendingExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedExpense, setSelectedExpense] = useState(null)
  const [actionType, setActionType] = useState(null) // 'approve' or 'reject'
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    totalAmount: 0
  })

  useEffect(() => {
    if (status === 'loading') return
    
    if (status === 'unauthenticated' || !session) {
      console.log('⚠️ Manager Dashboard: User not authenticated')
      return
    }

    // Allow ADMIN and MANAGER to access this dashboard
    if (session.user?.role && session.user.role !== 'MANAGER' && session.user.role !== 'ADMIN') {
      // Redirect other roles to their appropriate dashboard
      if (session.user.role === 'EMPLOYEE') {
        router.push('/employee/dashboard')
      } else {
        router.push('/dashboard')
      }
      return
    }

    fetchPendingExpenses()
    fetchStats()
  }, [session, status, router])

  const fetchPendingExpenses = async () => {
    try {
      const response = await fetch('/api/expenses/pending-approval')
      if (response.ok) {
        const data = await response.json()
        setPendingExpenses(data)
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch pending expenses'
        })
      }
    } catch (error) {
      console.error('Error fetching expenses:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred while fetching expenses'
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/expenses/manager-stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const openActionDialog = (expense, type) => {
    setSelectedExpense(expense)
    setActionType(type)
    setComment('')
  }

  const closeActionDialog = () => {
    setSelectedExpense(null)
    setActionType(null)
    setComment('')
  }

  const handleSubmitDecision = async () => {
    if (!selectedExpense || !actionType) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/expenses/approve-reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expenseId: selectedExpense.id,
          decision: actionType.toUpperCase(),
          comment: comment.trim() || undefined
        })
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Expense ${actionType}d successfully`
        })
        
        // Refresh data
        fetchPendingExpenses()
        fetchStats()
        closeActionDialog()
      } else {
        const error = await response.json()
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error.message || `Failed to ${actionType} expense`
        })
      }
    } catch (error) {
      console.error('Error submitting decision:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred while processing your request'
      })
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      PENDING: 'default',
      IN_PROGRESS: 'secondary',
      APPROVED: 'default',
      REJECTED: 'destructive',
      ESCALATED: 'secondary'
    }

    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
      IN_PROGRESS: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
      APPROVED: 'bg-green-100 text-green-800 hover:bg-green-100',
      REJECTED: 'bg-red-100 text-red-800 hover:bg-red-100',
      ESCALATED: 'bg-purple-100 text-purple-800 hover:bg-purple-100'
    }

    return (
      <Badge className={colors[status] || colors.PENDING}>
        {status?.replace('_', ' ')}
      </Badge>
    )
  }

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Manager Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Review and approve expense requests from your team
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting your review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.totalAmount?.toLocaleString() || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Pending expenses
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Expenses List */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Expense Requests</CardTitle>
            <CardDescription>
              Review and take action on expense submissions from your team members
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingExpenses.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No pending expense requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="border rounded-lg p-6 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Expense Details */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg text-foreground">
                              {expense.category}
                            </h3>
                            {expense.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {expense.description}
                              </p>
                            )}
                          </div>
                          {getStatusBadge(expense.status)}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <div>
                              <p className="text-muted-foreground">Amount</p>
                              <p className="font-semibold">
                                {expense.currency} {expense.amount?.toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-600" />
                            <div>
                              <p className="text-muted-foreground">Submitted by</p>
                              <p className="font-semibold">
                                {expense.submitter?.name || 'Unknown'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-purple-600" />
                            <div>
                              <p className="text-muted-foreground">Date</p>
                              <p className="font-semibold">
                                {new Date(expense.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-orange-600" />
                            <div>
                              <p className="text-muted-foreground">Receipt</p>
                              <p className="font-semibold">
                                {expense.receiptId ? 'Yes' : 'No'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Previous Comments */}
                        {expense.approvals && expense.approvals.length > 0 && (
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-sm font-medium mb-2 flex items-center gap-2">
                              <MessageSquare className="h-4 w-4" />
                              Previous Comments
                            </p>
                            {expense.approvals.map((approval, idx) => (
                              approval.comment && (
                                <div key={idx} className="text-sm bg-muted p-3 rounded-md mb-2">
                                  <p className="font-medium">{approval.approver?.name}:</p>
                                  <p className="text-muted-foreground">{approval.comment}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(approval.decisionAt).toLocaleString()}
                                  </p>
                                </div>
                              )
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 lg:w-48">
                        <Button
                          onClick={() => openActionDialog(expense, 'approve')}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => openActionDialog(expense, 'reject')}
                          variant="destructive"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Dialog */}
        <Dialog open={!!selectedExpense} onOpenChange={closeActionDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {actionType === 'approve' ? 'Approve' : 'Reject'} Expense
              </DialogTitle>
              <DialogDescription>
                {actionType === 'approve' 
                  ? 'Approve this expense request and add an optional comment for the employee.'
                  : 'Reject this expense request and provide a reason for rejection.'
                }
              </DialogDescription>
            </DialogHeader>
            
            {selectedExpense && (
              <div className="space-y-4 py-4">
                {/* Expense Summary */}
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Category:</span>
                    <span className="text-sm">{selectedExpense.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Amount:</span>
                    <span className="text-sm font-semibold">
                      {selectedExpense.currency} {selectedExpense.amount?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Submitted by:</span>
                    <span className="text-sm">{selectedExpense.submitter?.name}</span>
                  </div>
                </div>

                {/* Comment Input */}
                <div className="space-y-2">
                  <Label htmlFor="comment">
                    Comment {actionType === 'reject' && '(Required)'}
                  </Label>
                  <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={
                      actionType === 'approve'
                        ? 'Add an optional comment for the employee...'
                        : 'Please provide a reason for rejection...'
                    }
                    className="w-full min-h-[100px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required={actionType === 'reject'}
                  />
                  <p className="text-xs text-muted-foreground">
                    This comment will be visible to the employee on their dashboard
                  </p>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={closeActionDialog}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitDecision}
                disabled={submitting || (actionType === 'reject' && !comment.trim())}
                className={
                  actionType === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }
              >
                {submitting ? 'Processing...' : `Confirm ${actionType === 'approve' ? 'Approval' : 'Rejection'}`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
