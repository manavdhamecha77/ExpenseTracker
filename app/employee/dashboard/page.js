'use client'

import { useSession, SessionProvider } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ExpenseSubmissionForm from '@/components/ExpenseSubmissionForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Calendar, Settings, MessageSquare, CheckCircle2, XCircle } from 'lucide-react'

function EmployeeDashboardClient() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [recentExpenses, setRecentExpenses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    if (status === 'authenticated' && session?.user?.role) {
      // Allow ADMIN and EMPLOYEE to access this dashboard
      if (session.user.role !== 'EMPLOYEE' && session.user.role !== 'ADMIN') {
        // Redirect other roles to their appropriate dashboard
        if (session.user.role === 'MANAGER') {
          router.push('/dashboard/manager')
        } else {
          router.push('/dashboard')
        }
        return
      }

      // Fetch recent expenses
      const fetchRecentExpenses = async () => {
        try {
          const response = await fetch('/api/expenses/recent')
          if (response.ok) {
            const data = await response.json()
            setRecentExpenses(data)
          }
        } catch (error) {
          console.error('Failed to fetch recent expenses:', error)
        } finally {
          setLoading(false)
        }
      }

      fetchRecentExpenses()
    }
  }, [status, session?.user?.role, router])

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header - match existing dashboard styling */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {session.user?.name || 'Employee'}!
          </h1>
          <p className="text-muted-foreground mt-2">
            Here’s what’s happening with your expenses today.
          </p>
        </div>

        {/* Info cards - same grid and components as dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{session.user?.name || 'Employee'}</div>
              <p className="text-xs text-muted-foreground">{session.user?.email}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Status</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Active</div>
              <p className="text-xs text-muted-foreground">Email verified</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Member Since</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Today</div>
              <p className="text-xs text-muted-foreground">Welcome to the platform!</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions - same look */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                <Settings className="h-8 w-8 mb-2" />
                <span>Settings</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                <Calendar className="h-8 w-8 mb-2" />
                <span>View Calendar</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                <Mail className="h-8 w-8 mb-2" />
                <span>Messages</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center" onClick={() => alert('Messages feature coming soon!')}>
                <Mail className="h-8 w-8 mb-2" />
                <span>Messages</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Submit Expense - embeds existing form component */}
        <div className="mb-8">
          <ExpenseSubmissionForm />
        </div>

        {/* Recent Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>Your latest submissions and approval feedback</CardDescription>
          </CardHeader>
          <CardContent>
            {recentExpenses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No expenses submitted yet.</p>
            ) : (
              <div className="space-y-4">
                {recentExpenses.map((expense) => (
                  <div key={expense.id} className="border rounded-lg p-4 hover:border-primary/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-base">{expense.category}</h3>
                          <Badge 
                            variant={
                              expense.status === 'APPROVED' ? 'default' : 
                              expense.status === 'REJECTED' ? 'destructive' : 
                              'secondary'
                            }
                            className={
                              expense.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                              expense.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {expense.status}
                          </Badge>
                        </div>
                        {expense.description && (
                          <p className="text-sm text-muted-foreground">{expense.description}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">
                          {expense.currency} {Number(expense.amount).toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(expense.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Manager Feedback */}
                    {expense.approvals && expense.approvals.length > 0 && (
                      <div className="mt-3 pt-3 border-t space-y-2">
                        <p className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                          <MessageSquare className="h-4 w-4" />
                          Manager Feedback
                        </p>
                        {expense.approvals.map((approval, idx) => (
                          <div 
                            key={idx} 
                            className={`text-sm p-3 rounded-md ${
                              approval.decision === 'APPROVE' 
                                ? 'bg-green-50 border border-green-200' 
                                : 'bg-red-50 border border-red-200'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              {approval.decision === 'APPROVE' ? (
                                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                              )}
                              <div className="flex-1">
                                <p className="font-medium text-foreground">
                                  {approval.approver?.name || 'Manager'}
                                </p>
                                {approval.comment && (
                                  <p className="text-muted-foreground mt-1">{approval.comment}</p>
                                )}
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(approval.decisionAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function EmployeeDashboard() {
  return (
    <SessionProvider basePath="/api/auth">
      <EmployeeDashboardClient />
    </SessionProvider>
  )
}
