// Role definitions for Expense Management System
// Based on the requirements and Prisma schema

export const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  EMPLOYEE: 'EMPLOYEE',
  FINANCE: 'FINANCE',
  DIRECTOR: 'DIRECTOR'
};

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: {
    // Company Management
    company: {
      create: true,           // Auto-created on first signup
      manage: true,           // Full company settings control
      viewAll: true,          // View all company data
      configure: true         // Configure approval rules, settings
    },
    
    // User Management
    users: {
      create: true,           // Create Employees & Managers
      update: true,           // Update user details
      delete: true,           // Remove users
      assignRoles: true,      // Assign and change roles (Employee, Manager)
      manageHierarchy: true   // Define manager-employee relationships
    },
    
    // Expense Management
    expenses: {
      viewAll: true,          // View all company expenses
      overrideApprovals: true, // Override any approval decision
      bulkActions: true,      // Perform bulk operations
      reports: true,          // Generate company-wide reports
      auditTrail: true        // View complete audit trail
    },
    
    // Approval System
    approvals: {
      configureRules: true,   // Set up approval rules and thresholds
      bypassRules: true,      // Override approval workflows
      escalate: true,         // Handle escalated expenses
      viewPending: true       // See all pending approvals
    },
    
    // Financial Controls
    financial: {
      setCurrencyRates: true, // Manage exchange rates
      budgetControl: true,    // Set budget limits
      auditAccess: true,      // Financial audit capabilities
      complianceReports: true // Generate compliance reports
    }
  },

  [ROLES.MANAGER]: {
    // Team Management
    team: {
      viewTeamExpenses: true, // View expenses from direct reports
      manageReports: true,    // Manage direct report relationships
      teamReports: true       // Generate team expense reports
    },
    
    // Approval Authority
    approvals: {
      approveReject: true,    // Approve/reject team member expenses
      viewInCompanyCurrency: true, // Amount visible in company's default currency
      escalate: true,         // Escalate expenses as per rules
      addComments: true,      // Add approval comments
      viewApprovalHistory: true // See approval trail
    },
    
    // Expense Management
    expenses: {
      viewTeam: true,         // View team member expenses
      viewOwn: true,          // View their own expenses
      submit: true,           // Submit their own expenses
      checkStatus: true,      // Check approval status
      attachReceipts: true,   // Attach receipt documents
      editPending: true       // Edit pending expenses
    },
    
    // Reporting
    reports: {
      teamSummary: true,      // Team expense summaries
      approvalMetrics: true,  // Approval performance metrics
      budgetTracking: true    // Track team budget usage
    }
  },

  [ROLES.EMPLOYEE]: {
    // Expense Management
    expenses: {
      submit: true,           // Submit expense claims
      viewOwn: true,          // View their own expenses only
      checkStatus: true,      // Check approval status
      attachReceipts: true,   // Attach receipt documents
      editPending: true,      // Edit expenses while pending
      withdrawPending: true,  // Withdraw pending expenses
      resubmit: true         // Resubmit rejected expenses
    },
    
    // Personal Management
    profile: {
      viewProfile: true,      // View own profile
      updateBasicInfo: true,  // Update basic profile information
      changePassword: true    // Change own password
    },
    
    // Limited Reporting
    reports: {
      personalSummary: true,  // Personal expense summaries
      yearToDate: true,       // YTD expense reports
      categoryBreakdown: true // Personal category analysis
    }
  },

  [ROLES.FINANCE]: {
    // Financial Operations
    financial: {
      processPayments: true,   // Process approved expense payments
      reconcileAccounts: true, // Reconcile expense accounts
      manageBudgets: true,     // Set and manage budgets
      auditExpenses: true,     // Audit expense claims
      complianceCheck: true    // Ensure regulatory compliance
    },
    
    // Expense Management
    expenses: {
      viewAll: true,           // View all company expenses
      auditTrail: true,        // Access complete audit trail
      bulkProcessing: true,    // Process expenses in bulk
      flagSuspicious: true,    // Flag suspicious expenses
      requestDocuments: true   // Request additional documentation
    },
    
    // Reporting & Analytics
    reports: {
      financialReports: true,  // Generate financial reports
      complianceReports: true, // Regulatory compliance reports
      costAnalysis: true,      // Cost center analysis
      trendAnalysis: true,     // Expense trend analysis
      taxReports: true         // Tax-related reports
    },
    
    // System Configuration
    system: {
      configureCurrencyRates: true, // Manage exchange rates
      setPaymentMethods: true,      // Configure payment options
      manageVendors: true,          // Vendor management
      integrationSettings: true     // Third-party integrations
    }
  },

  [ROLES.DIRECTOR]: {
    // Executive Overview
    executive: {
      companyOverview: true,   // High-level company metrics
      strategicReports: true,  // Strategic financial reports
      crossDepartment: true,   // Cross-departmental analysis
      boardReports: true       // Board-level reporting
    },
    
    // High-Level Approvals
    approvals: {
      highValueApprovals: true, // Approve high-value expenses
      policyExceptions: true,   // Approve policy exceptions
      budgetOverrides: true,    // Override budget limits
      emergencyApprovals: true  // Emergency expense approvals
    },
    
    // Expense Management
    expenses: {
      viewAll: true,           // View all company expenses
      strategicAnalysis: true, // Strategic expense analysis
      benchmarking: true,      // Industry benchmarking
      forecastAccess: true     // Expense forecasting
    },
    
    // Policy & Governance
    governance: {
      setPolicies: true,       // Set expense policies
      complianceOversight: true, // Compliance oversight
      riskManagement: true,    // Risk assessment and management
      auditApproval: true      // Approve audit recommendations
    },
    
    // Advanced Reporting
    reports: {
      executiveDashboard: true, // Executive dashboard access
      predictiveAnalytics: true, // Predictive expense analytics
      performanceMetrics: true,  // Department performance metrics
      costOptimization: true    // Cost optimization recommendations
    }
  }
};

// Helper functions for role checking
export const hasPermission = (userRole, category, permission) => {
  return ROLE_PERMISSIONS[userRole]?.[category]?.[permission] || false;
};

export const canApproveExpenses = (userRole) => {
  return hasPermission(userRole, 'approvals', 'approveReject') || 
         hasPermission(userRole, 'approvals', 'highValueApprovals');
};

export const canViewAllExpenses = (userRole) => {
  return hasPermission(userRole, 'expenses', 'viewAll');
};

export const canManageUsers = (userRole) => {
  return hasPermission(userRole, 'users', 'create') && 
         hasPermission(userRole, 'users', 'assignRoles');
};

export const canOverrideApprovals = (userRole) => {
  return hasPermission(userRole, 'expenses', 'overrideApprovals') ||
         hasPermission(userRole, 'approvals', 'budgetOverrides');
};

// Role hierarchy for escalation
export const ROLE_HIERARCHY = {
  [ROLES.EMPLOYEE]: 1,
  [ROLES.MANAGER]: 2,
  [ROLES.FINANCE]: 3,
  [ROLES.ADMIN]: 4,
  [ROLES.DIRECTOR]: 5
};

// Get roles that can approve for a given role
export const getApprovalRoles = (submitterRole) => {
  const submitterLevel = ROLE_HIERARCHY[submitterRole];
  return Object.keys(ROLE_HIERARCHY).filter(role => 
    ROLE_HIERARCHY[role] > submitterLevel && canApproveExpenses(role)
  );
};

// Default role assignments based on company setup
export const DEFAULT_FIRST_USER_ROLE = ROLES.ADMIN;
export const DEFAULT_NEW_USER_ROLE = ROLES.EMPLOYEE;

// Role-based UI permissions
export const UI_PERMISSIONS = {
  [ROLES.ADMIN]: {
    showAdminPanel: true,
    showUserManagement: true,
    showCompanySettings: true,
    showAllExpenses: true,
    showApprovalRules: true
  },
  [ROLES.MANAGER]: {
    showTeamView: true,
    showApprovalQueue: true,
    showTeamReports: true,
    showOwnExpenses: true
  },
  [ROLES.EMPLOYEE]: {
    showExpenseForm: true,
    showOwnExpenses: true,
    showPersonalReports: true
  },
  [ROLES.FINANCE]: {
    showFinancialPanel: true,
    showAllExpenses: true,
    showPaymentQueue: true,
    showFinancialReports: true,
    showAuditTools: true
  },
  [ROLES.DIRECTOR]: {
    showExecutiveDashboard: true,
    showStrategicReports: true,
    showAllExpenses: true,
    showPolicyManagement: true
  }
};