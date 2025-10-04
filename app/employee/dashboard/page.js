import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import ExpenseSubmissionForm from '@/components/ExpenseSubmissionForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Calendar, Settings } from 'lucide-react'

export default async function EmployeeDashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/login')
  }

  // If not an employee, send to existing dashboard
  if (session.user?.role && session.user.role !== 'EMPLOYEE') {
    redirect('/dashboard')
  }

  const userId = session.user.id
  const company = session.user.company

  // Fetch recent expenses for the employee
  const recentExpenses = await prisma.expense.findMany({
    where: { submittedById: userId },
    orderBy: { date: 'desc' },
    take: 10,
    select: {
      id: true,
      amount: true,
      currency: true,
      category: true,
      description: true,
      date: true,
      status: true,
    },
  })

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
                <User className="h-8 w-8 mb-2" />
                <span>Profile</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center" onClick={() => {}}>
                <Calendar className="h-8 w-8 mb-2" />
                <span>View Calendar</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center" onClick={() => {}}>
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
            <CardDescription>Your latest submissions</CardDescription>
          </CardHeader>
          <CardContent>
            {recentExpenses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No expenses submitted yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-2 pr-4">Date</th>
                      <th className="py-2 pr-4">Category</th>
                      <th className="py-2 pr-4">Amount</th>
                      <th className="py-2 pr-4">Description</th>
                      <th className="py-2 pr-0">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentExpenses.map((e) => (
                      <tr key={e.id} className="border-b last:border-b-0">
                        <td className="py-2 pr-4">{new Date(e.date).toLocaleDateString()}</td>
                        <td className="py-2 pr-4">{e.category}</td>
                        <td className="py-2 pr-4 font-medium">{e.currency} {Number(e.amount).toFixed(2)}</td>
                        <td className="py-2 pr-4 truncate max-w-[24ch]" title={e.description || ''}>{e.description || '—'}</td>
                        <td className="py-2 pr-0">
                          <Badge variant={e.status === 'APPROVED' ? 'default' : e.status === 'REJECTED' ? 'destructive' : 'secondary'}>
                            {e.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}