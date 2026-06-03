import { TeamMember, Client, Service, Task, Meeting, Transaction, EmployeeReport, ChatMessage } from './types';

export const INITIAL_TEAM: TeamMember[] = [
  { 
    id: 'tm1', 
    name: 'Hasib Rahman', 
    email: 'hasib@innovix.com', 
    role: 'Admin', 
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', 
    joinedDate: '2025-01-10',
    salaryAmount: 95000,
    paymentsPaid: [
      { month: 'April 2026', amount: 95000, paidDate: '2026-04-30', txId: 'TX-PAY-011' },
      { month: 'May 2026', amount: 95005, paidDate: '2026-05-31', txId: 'TX-PAY-025' }
    ],
    phone: '+8801755123456',
    skills: ['Project Governance', 'Financial Control', 'Resource Staffing']
  },
  { 
    id: 'tm2', 
    name: 'Tasnim Jahan', 
    email: 'tasnim@innovix.com', 
    role: 'Project Manager', 
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', 
    joinedDate: '2025-02-15',
    salaryAmount: 72000,
    paymentsPaid: [
      { month: 'April 2026', amount: 72000, paidDate: '2026-04-30', txId: 'TX-PAY-012' },
      { month: 'May 2026', amount: 72000, paidDate: '2026-05-31', txId: 'TX-PAY-026' }
    ],
    phone: '+8801822883344',
    skills: ['Figma UX Design', 'Agile Product Management', 'Client Engagement']
  },
  { 
    id: 'tm3', 
    name: 'Tanvir Hossain', 
    email: 'tanvir@innovix.com', 
    role: 'Developer', 
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', 
    joinedDate: '2025-03-01',
    salaryAmount: 60000,
    paymentsPaid: [
      { month: 'April 2026', amount: 60000, paidDate: '2026-04-30', txId: 'TX-PAY-013' },
      { month: 'May 2026', amount: 60000, paidDate: '2026-05-31', txId: 'TX-PAY-027' }
    ],
    phone: '+8801933774422',
    skills: ['React Native', 'Vite', 'NodeJS Express API', 'TypeScript Mastery']
  },
  { 
    id: 'tm4', 
    name: 'Fariha Kabir', 
    email: 'fariha@innovix.com', 
    role: 'Designer', 
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150', 
    joinedDate: '2025-04-12',
    salaryAmount: 50000,
    paymentsPaid: [
      { month: 'April 2026', amount: 50000, paidDate: '2026-04-30', txId: 'TX-PAY-014' },
      { month: 'May 2026', amount: 50000, paidDate: '2026-05-31', txId: 'TX-PAY-028' }
    ],
    phone: '+8801544662288',
    skills: ['Adobe Illustrator', 'Interface Systems', 'Component Prototyping']
  },
  { 
    id: 'tm5', 
    name: 'Sadman Sakib', 
    email: 'sadman@innovix.com', 
    role: 'QA Tester', 
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150', 
    joinedDate: '2025-05-18',
    salaryAmount: 42000,
    paymentsPaid: [
      { month: 'April 2026', amount: 42000, paidDate: '2026-04-30', txId: 'TX-PAY-015' },
      { month: 'May 2026', amount: 42000, paidDate: '2026-05-31', txId: 'TX-PAY-029' }
    ],
    phone: '+8801688554433',
    skills: ['Manual Execution', 'Security Controls Audit', 'Jest Unit Cases']
  },
];

export const INITIAL_CLIENTS: Client[] = [
  { id: 'cl1', name: 'Rahat Chowdhury', companyName: 'Dhaka Agro Foods Ltd', email: 'rahat@agrofoods.bd', phone: '+8801712345678', projectName: 'E-Commerce Platform & Delivery App', totalBudget: 4500, paidAmount: 2500, dueAmount: 2000, status: 'Active', notes: 'Requires full automated payment SMS integration' },
  { id: 'cl2', name: 'Sarah Miller', companyName: 'Apex Apex Global Inc', email: 'smiller@apexglobal.com', phone: '+15550198273', projectName: 'SaaS HR Dashboard', totalBudget: 7500, paidAmount: 7500, dueAmount: 0, status: 'Completed', notes: 'Phase 2 proposal sent for AI integration' },
  { id: 'cl3', name: 'Imtiaz Ahmed', companyName: 'Dacca Cargo Services', email: 'imtiaz@daccacargo.com', phone: '+8801911998877', projectName: 'Vehicle Tracking System ERP', totalBudget: 5000, paidAmount: 1500, dueAmount: 3500, status: 'Active', notes: 'API documentation pending review' },
];

export const INITIAL_SERVICES: Service[] = [
  { id: 'sv1', name: 'Custom ERP and Billing Software', description: 'Business resource planning with custom secure dashboards and invoice triggers.', category: 'Development', basePrice: 3500, duration: '4-8 Weeks' },
  { id: 'sv2', name: 'Superstar E-Commerce Solution', description: 'Modern, fluid storefronts built with React, headless checkout, and real-time carts.', category: 'Development', basePrice: 2000, duration: '3-5 Weeks' },
  { id: 'sv3', name: 'Premium Corporate Brand Design', description: 'Vector logos, fully scalable UI design systems, custom prototypes, and marketing assets.', category: 'Design', basePrice: 1200, duration: '2 Weeks' },
  { id: 'sv4', name: 'IT Infrastructure & Cyber Audit', description: 'Penetration testing, source code audit, Cloud hosting setup and optimization.', category: 'Consulting', basePrice: 1500, duration: '1-3 Weeks' },
];

export const INITIAL_TASKS: Task[] = [
  { id: 'tk1', title: 'Design E-Commerce Home Page', description: 'Create responsive home page structure and product landing sections in Figma.', assignedToId: 'tm4', dueDate: '2026-06-10', priority: 'High', status: 'In Progress', createdAt: '2026-06-01' },
  { id: 'tk2', title: 'Implement Stripe Checkout API', description: 'Integrate multi-currency checkout routes with local fallback bank links.', assignedToId: 'tm3', dueDate: '2026-06-05', priority: 'High', status: 'Submitted', submissionNote: 'Finished integrating the local payment hooks. Ready to review.', createdAt: '2026-06-01' },
  { id: 'tk3', title: 'Write Security Test Scenarios', description: 'Prepare test payloads validating multi-user role access controls.', assignedToId: 'tm5', dueDate: '2026-06-15', priority: 'Medium', status: 'Pending', createdAt: '2026-06-02' },
];

export const INITIAL_MEETINGS: Meeting[] = [
  { id: 'mt1', title: 'Weekly Company Alignment', dateTime: '2026-06-03T11:00', duration: 45, agenda: 'Discuss progress of Dacca Cargo ERP and next roadmap milestones.', participants: ['tm1', 'tm2', 'tm3', 'tm4'], isCompleted: false },
  { id: 'mt2', title: 'Client Feedback Session - Agro Foods', dateTime: '2026-06-01T15:00', duration: 30, agenda: 'Present interface mockups to Rahat Chowdhury and finalize API requirements.', participants: ['tm1', 'tm2', 'tm4'], isCompleted: true, summary: 'Client approved the orange themed dashboard. Demanded direct integration of bkash/Nagad options.', notes: 'Need to review services costs for custom integrations.' }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 'tr1', clientId: 'cl1', type: 'Income', category: 'Milestone Payment', amount: 2500, date: '2026-05-20', description: 'Agro Foods - Project sign-off advance' },
  { id: 'tr2', clientId: 'cl2', type: 'Income', category: 'Project Completion', amount: 7500, date: '2026-05-28', description: 'Apex Global SaaS build full signoff settlement' },
  { id: 'tr3', type: 'Expense', category: 'Office Rent & Server Hosting', amount: 800, date: '2026-06-01', description: 'Server infrastructure bills (AWS/Cloud).' }
];

export const INITIAL_REPORTS: EmployeeReport[] = [
  { 
    id: 'rep1', 
    employeeId: 'tm3', 
    employeeName: 'Tanvir Hossain', 
    title: 'Status Update: Secure Redirection', 
    content: 'Completed DBBL Card API and sandbox webhook. Successfully registered transaction inflow in BizFlow ledger. Response latency is below 80ms.', 
    date: '2026-06-02', 
    type: 'Daily', 
    status: 'Approved' 
  },
  { 
    id: 'rep2', 
    employeeId: 'tm4', 
    employeeName: 'Fariha Kabir', 
    title: 'Visual Core Architecture Assets', 
    content: 'Designed and updated corporate dashboard schemes to high-contrast deep indigo. Exported scalable SVG vector logos for client invoice previewing.', 
    date: '2026-06-01', 
    type: 'Weekly', 
    status: 'Reviewed' 
  }
];

export const INITIAL_CHATS: ChatMessage[] = [
  { id: 'msg1', senderId: 'admin', senderName: 'Zakir Hasan', senderRole: 'Admin', receiverId: 'tm3', message: 'Hi Tanvir! How is the payment gateway integration for Dhaka Agro Foods coming along?', timestamp: '2026-06-02T10:15:00Z' },
  { id: 'msg2', senderId: 'tm3', senderName: 'Tanvir Hossain', senderRole: 'Employee', receiverId: 'admin', message: 'Hello Admin! Deployed the sandboxes and verified callbacks. Real-time logging operates smoothly.', timestamp: '2026-06-02T10:19:30Z' },
  { id: 'msg3', senderId: 'admin', senderName: 'Zakir Hasan', senderRole: 'Admin', receiverId: 'cl1', message: 'Hello Rahat Chowdhury, the initial delivery preview is uploaded to your custom Client dashboard. Let us know if you find it correct.', timestamp: '2026-06-01T14:00:00Z' },
  { id: 'msg4', senderId: 'cl1', senderName: 'Rahat Chowdhury', senderRole: 'Client', receiverId: 'admin', message: 'Excellent progress Zakir! The dashboard shows all our payment milestones and billing receipts clearly. Quick-print works flawlessly as well.', timestamp: '2026-06-01T14:45:00Z' }
];

