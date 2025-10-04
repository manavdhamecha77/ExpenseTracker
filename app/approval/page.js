'use client'

import { useState, useEffect } from 'react'
import { Check, X, Clock, User, Calendar, DollarSign } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function ApprovalDashboard() {
  const [drafts, setDrafts] = useState([])
  const [approvers, setApprovers] = useState([])
  const [isHierarchical, setIsHierarchical] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedDraft, setSelectedDraft] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate API call to get drafts
    setTimeout(() => {
      setDrafts([
        {
          id: 1,
          title: 'Q4 Marketing Campaign',
          description: 'Budget allocation for social media advertising and content creation',
          amount: 25000,
          submitter: 'John Doe',
          submittedAt: '2024-01-15T10:30:00Z',
          status: 'pending',
          category: 'Marketing',
          approvals: [
            { approverId: 1, status: 'approved', timestamp: '2024-01-15T11:00:00Z' },
            { approverId: 2, status: 'pending', timestamp: null },
            { approverId: 3, status: 'pending', timestamp: null }
          ]
        },
        {
          id: 2,
          title: 'Office Equipment Purchase',
          description: 'New laptops and monitors for development team',
          amount: 15000,
          submitter: 'Jane Smith',
          submittedAt: '2024-01-14T14:20:00Z',
          status: 'pending',
          category: 'IT Equipment',
          approvals: [
            { approverId: 1, status: 'approved', timestamp: '2024-01-14T15:00:00Z' },
            { approverId: 2, status: 'approved', timestamp: '2024-01-14T16:30:00Z' },
            { approverId: 3, status: 'pending', timestamp: null }
          ]
        },
        {
          id: 3,
          title: 'Team Building Event',
          description: 'Annual company retreat and team building activities',
          amount: 8000,
          submitter: 'Mike Johnson',
          submittedAt: '2024-01-13T09:15:00Z',
          status: 'pending',
          category: 'HR',
          approvals: [
            { approverId: 1, status: 'rejected', timestamp: '2024-01-13T10:00:00Z' },
            { approverId: 2, status: 'pending', timestamp: null },
            { approverId: 3, status: 'pending', timestamp: null }
          ]
        }
      ])

      setApprovers([
        { id: 1, name: 'Sarah Wilson', role: 'Finance Manager', level: 1 },
        { id: 2, name: 'David Brown', role: 'Department Head', level: 2 },
        { id: 3, name: 'Lisa Chen', role: 'CEO', level: 3 }
      ])

      setCurrentUser({ id: 1, name: 'Sarah Wilson', role: 'Finance Manager' })
      setLoading(false)
    }, 1000)
  }, [])

  const handleApprove = async (draftId, approverId) => {
    try {
      setDrafts(prev => prev.map(draft => {
        if (draft.id === draftId) {
          const updatedApprovals = draft.approvals.map(approval => 
            approval.approverId === approverId 
              ? { ...approval, status: 'approved', timestamp: new Date().toISOString() }
              : approval
          )
          return { ...draft, approvals: updatedApprovals }
        }
        return draft
      }))
      
      toast.success('Draft approved successfully!')
      checkDraftStatus(draftId)
    } catch (error) {
      toast.error('Failed to approve draft')
    }
  }

  const handleReject = async (draftId, approverId) => {
    try {
      setDrafts(prev => prev.map(draft => {
        if (draft.id === draftId) {
          const updatedApprovals = draft.approvals.map(approval => 
            approval.approverId === approverId 
              ? { ...approval, status: 'rejected', timestamp: new Date().toISOString() }
              : approval
          )
          return { ...draft, approvals: updatedApprovals, status: 'rejected' }
        }
        return draft
      }))
      
      toast.success('Draft rejected successfully!')
    } catch (error) {
      toast.error('Failed to reject draft')
    }
  }

  const checkDraftStatus = (draftId) => {
    const draft = drafts.find(d => d.id === draftId)
    if (!draft) return

    if (isHierarchical) {
      // Hierarchical approval - must be approved in order by level
      const sortedApprovers = approvers.sort((a, b) => a.level - b.level)
      let allPreviousApproved = true
      
      for (const approver of sortedApprovers) {
        const approval = draft.approvals.find(a => a.approverId === approver.id)
        if (approval?.status === 'rejected') {
          return // Already rejected
        }
        if (approval?.status !== 'approved') {
          allPreviousApproved = false
          break
        }
      }
      
      if (allPreviousApproved) {
        setDrafts(prev => prev.map(d => 
          d.id === draftId ? { ...d, status: 'approved' } : d
        ))
        toast.success('Draft fully approved!')
      }
    } else {
      // 60% approval required
      const totalApprovers = draft.approvals.length
      const approvedCount = draft.approvals.filter(a => a.status === 'approved').length
      const rejectedCount = draft.approvals.filter(a => a.status === 'rejected').length
      
      const approvalPercentage = (approvedCount / totalApprovers) * 100
      const rejectionPercentage = (rejectedCount / totalApprovers) * 100
      
      if (approvalPercentage >= 60) {
        setDrafts(prev => prev.map(d => 
          d.id === draftId ? { ...d, status: 'approved' } : d
        ))
        toast.success('Draft approved! (60% threshold met)')
      } else if (rejectionPercentage > 40) {
        setDrafts(prev => prev.map(d => 
          d.id === draftId ? { ...d, status: 'rejected' } : d
        ))
        toast.error('Draft rejected! (Rejection threshold exceeded)')
      }
    }
  }

  const getApprovalStatus = (draft) => {
    const totalApprovers = draft.approvals.length
    const approvedCount = draft.approvals.filter(a => a.status === 'approved').length
    const rejectedCount = draft.approvals.filter(a => a.status === 'rejected').length
    const pendingCount = draft.approvals.filter(a => a.status === 'pending').length

    return { totalApprovers, approvedCount, rejectedCount, pendingCount }
  }

  const canUserApprove = (draft, userId) => {
    const userApproval = draft.approvals.find(a => a.approverId === userId)
    if (!userApproval || userApproval.status !== 'pending') return false

    if (isHierarchical) {
      // Check if all previous levels have approved
      const currentUserLevel = approvers.find(a => a.id === userId)?.level || 0
      const previousLevels = approvers.filter(a => a.level < currentUserLevel)
      
      return previousLevels.every(approver => {
        const approval = draft.approvals.find(a => a.approverId === approver.id)
        return approval?.status === 'approved'
      })
    }

    return true // Non-hierarchical, can approve anytime
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Approval Dashboard</h1>
          <p className="text-gray-600 mt-2">Review and approve pending expense drafts</p>
        </div>

        {/* Approval Mode Toggle */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Approval Mode</h2>
              <p className="text-sm text-gray-600 mt-1">
                {isHierarchical 
                  ? 'Hierarchical approval is enabled - approvals must be done in order by level'
                  : 'Percentage-based approval is enabled - minimum 60% approval required'
                }
              </p>
            </div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isHierarchical}
                onChange={(e) => setIsHierarchical(e.target.checked)}
                className="sr-only"
              />
              <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isHierarchical ? 'bg-blue-600' : 'bg-gray-200'
              }`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isHierarchical ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </div>
              <span className="ml-3 text-sm font-medium text-gray-700">
                Hierarchical Approval
              </span>
            </label>
          </div>
        </div>

        {/* Approvers List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Approvers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {approvers.map((approver) => (
              <div key={approver.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="text-blue-600" size={16} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{approver.name}</p>
                  <p className="text-sm text-gray-600">{approver.role}</p>
                  {isHierarchical && (
                    <p className="text-xs text-gray-500">Level {approver.level}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Drafts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {drafts.map((draft) => {
            const status = getApprovalStatus(draft)
            const canApprove = canUserApprove(draft, currentUser?.id)
            
            return (
              <div key={draft.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  {/* Draft Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{draft.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{draft.description}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      draft.status === 'approved' ? 'bg-green-100 text-green-800' :
                      draft.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {draft.status.charAt(0).toUpperCase() + draft.status.slice(1)}
                    </div>
                  </div>

                  {/* Draft Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <DollarSign className="text-green-600" size={16} />
                      <span className="font-medium text-gray-900">${draft.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <User size={16} />
                      <span>Submitted by {draft.submitter}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar size={16} />
                      <span>{new Date(draft.submittedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 inline-block">
                      {draft.category}
                    </div>
                  </div>

                  {/* Approval Status */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Approval Progress</span>
                      <span className="text-sm text-gray-600">
                        {status.approvedCount}/{status.totalApprovers} approved
                        {!isHierarchical && ` (${Math.round((status.approvedCount/status.totalApprovers)*100)}%)`}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(status.approvedCount/status.totalApprovers)*100}%` }}
                      ></div>
                    </div>
                    {!isHierarchical && status.approvedCount > 0 && (
                      <p className="text-xs text-gray-600 mt-1">
                        {Math.round((status.approvedCount/status.totalApprovers)*100) >= 60 ? 
                          '✓ 60% threshold met' : 
                          `${60 - Math.round((status.approvedCount/status.totalApprovers)*100)}% more needed`
                        }
                      </p>
                    )}
                  </div>

                  {/* Individual Approvals */}
                  <div className="space-y-3 mb-6">
                    {draft.approvals.map((approval) => {
                      const approver = approvers.find(a => a.id === approval.approverId)
                      return (
                        <div key={approval.approverId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 flex items-center justify-center">
                              {approval.status === 'approved' && <Check className="text-green-600" size={16} />}
                              {approval.status === 'rejected' && <X className="text-red-600" size={16} />}
                              {approval.status === 'pending' && <Clock className="text-yellow-600" size={16} />}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{approver?.name}</p>
                              <p className="text-xs text-gray-600">{approver?.role}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`px-2 py-1 rounded text-xs font-medium ${
                              approval.status === 'approved' ? 'bg-green-100 text-green-800' :
                              approval.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}
                            </div>
                            {approval.timestamp && (
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(approval.timestamp).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Action Buttons */}
                  {draft.status === 'pending' && canApprove && (
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleApprove(draft.id, currentUser.id)}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Check size={16} />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleReject(draft.id, currentUser.id)}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <X size={16} />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                  
                  {draft.status === 'pending' && !canApprove && (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">
                        {isHierarchical ? 
                          'Waiting for higher level approvals to be completed first' :
                          'You have already provided your approval decision'
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {drafts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No drafts pending approval</p>
          </div>
        )}
      </div>
    </div>
  )
}
