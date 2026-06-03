import React, { useState, useEffect } from 'react';
import { 
  Client, 
  Task, 
  Transaction, 
  Service, 
  Meeting, 
  TeamMember, 
  TaskStatus, 
  AppSettings, 
  BankAccount,
  EmployeeReport,
  ChatMessage,
  Agreement
} from './types';
import { 
  INITIAL_TEAM, 
  INITIAL_CLIENTS, 
  INITIAL_SERVICES, 
  INITIAL_TASKS, 
  INITIAL_MEETINGS, 
  INITIAL_TRANSACTIONS,
  INITIAL_REPORTS,
  INITIAL_CHATS
} from './mockData';

// Component imports
import DashboardView from './components/DashboardView';
import ClientsView from './components/ClientsView';
import TeamTasksView from './components/TeamTasksView';
import ServicesView from './components/ServicesView';
import MeetingsView from './components/MeetingsView';
import AiPartnerView from './components/AiPartnerView';
import AccountingView from './components/AccountingView';
import SettingsView from './components/SettingsView';
import LoginView from './components/LoginView';
import EmployeeDashboard from './components/EmployeeDashboard';
import ClientDashboard from './components/ClientDashboard';
import UserManagementView from './components/UserManagementView';
import SupportChatsView from './components/SupportChatsView';
import CompanyFileManager from './components/CompanyFileManager';
import AgreementsView from './components/AgreementsView';
import { CompanyFile } from './types';

// Icons
import { 
  LayoutDashboard, 
  Briefcase, 
  FolderGit2, 
  DollarSign, 
  Video, 
  Sparkles, 
  Clock, 
  Globe, 
  Settings, 
  TrendingUp,
  Inbox,
  User,
  Power,
  ShieldCheck,
  Building,
  Users,
  MessageSquare,
  HardDrive,
  Sun,
  Moon
} from 'lucide-react';

export default function App() {
  // 0. Theme Mode state: light or dark (monochrome defaults)
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('bizflow_theme_mode') as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('bizflow_theme_mode', themeMode);
  }, [themeMode]);

  // 1. AppSettings Configuration with localStorage Sync
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('bizflow_settings');
    const defaults = {
      agencyName: 'Innovix BD Ltd',
      agencyLogoInitials: 'IX',
      contactPerson: 'Zakir Hasan',
      email: 'zakir@innovix-bd.com',
      phone: '+880 1712-345678',
      address: 'Plaza 12, Sector 11, Uttara Model Town, Dhaka 1230, Bangladesh',
      currency: 'BDT' as const,
      paymentDetails: 'Bank Account: Dutch Bangla Bank Ltd (DBBL)\nA/C Name: Innovix BD Ltd\nA/C No: 120-101-98765\nBkash Merchant: 01712345678',
      showCustomLoginSim: true,
      expenseCategories: [
        'Employee Salaries (কর্মকর্তাদের বেতন)',
        'Server Hosting & Software (ক্লাউড হোস্টিং)',
        'Office Rent & Utilities (অফিস ও বিদ্যুৎ বিল)',
        'Snacks & Entertainment (আপ্যায়ন খরচ)',
        'QA, Devices & Gear (ডিভাইস ও যন্ত্রপাতি)',
        'Business Marketing & Ads (মার্কেটিং)',
        'Others (অন্যান্য বিবিধ)'
      ],
      incomeCategories: [
        'Milestone Payment (কাজের কিস্তি পেমেন্ট)',
        'Support & AMC / Maintenance (বার্ষিক রক্ষণাবেক্ষণ)',
        'Software Development Contract (সফটওয়্যার উন্নয়ন)',
        'Google AdSense / Youtube Revenues (বিজ্ঞাপন থেকে আয়)',
        'IT Operations Consulting (পরামর্শ ফি)',
        'Other Inflow Revenues (অন্যান্য বিবিধ আয়)'
      ]
    };
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...defaults,
        ...parsed,
        expenseCategories: parsed.expenseCategories || defaults.expenseCategories,
        incomeCategories: parsed.incomeCategories || defaults.incomeCategories
      };
    }
    return defaults;
  });

  // 2. Bank Accounts Ledger state
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(() => {
    const saved = localStorage.getItem('bizflow_bank_accounts');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'b1', accountName: 'Dutch Bangla Bank Ltd (DBBL)', accountType: 'Bank', accountNumber: '120-101-98765', branchName: 'Uttara Branch', balance: 500000 },
      { id: 'b2', accountName: 'bKash Merchant Account', accountType: 'Mobile Banking', accountNumber: '01712345678', balance: 135000 },
      { id: 'b3', accountName: 'Corporate Cash Hand Drawer', accountType: 'Cash', balance: 45000 }
    ];
  });

  // 3. Simple Login Simulation Session
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const savedSetting = localStorage.getItem('bizflow_is_logged_in');
    return savedSetting === 'true';
  });

  // Core CRM & Project data states
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('bizflow_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('bizflow_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('bizflow_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('bizflow_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [meetings, setMeetings] = useState<Meeting[]>(() => {
    const saved = localStorage.getItem('bizflow_meetings');
    return saved ? JSON.parse(saved) : INITIAL_MEETINGS;
  });

  const [team, setTeam] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('bizflow_team');
    return saved ? JSON.parse(saved) : INITIAL_TEAM;
  });

  const [reports, setReports] = useState<EmployeeReport[]>(() => {
    const saved = localStorage.getItem('bizflow_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [chats, setChats] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('bizflow_chats');
    return saved ? JSON.parse(saved) : INITIAL_CHATS;
  });

  const [companyFiles, setCompanyFiles] = useState<CompanyFile[]>(() => {
    const saved = localStorage.getItem('bizflow_company_files');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'file1',
        name: 'innovix-erp-v2.0-source.zip',
        category: 'Software Systems',
        uploadedBy: 'Zakir Hasan',
        uploadedAt: '2026-05-15T12:00:00Z',
        size: '42.8 MB',
        url: '#',
        type: 'zip',
        description: 'Innovix Corporate ERP Core Engine production release source bundle.',
        isLocked: true
      },
      {
        id: 'file2',
        name: 'e-commerce_responsive_template.zip',
        category: 'Websites',
        uploadedBy: 'Zakir Hasan',
        uploadedAt: '2026-05-20T10:30:00Z',
        size: '12.4 MB',
        url: '#',
        type: 'zip',
        description: 'Ready-to-deploy multi-vendor e-commerce NextJS template.',
        isLocked: false
      },
      {
        id: 'file3',
        name: 'agency_portfolio_wireframes.pdf',
        category: 'Documentation',
        uploadedBy: 'Shahruk Ahmed',
        uploadedAt: '2026-05-25T14:15:00Z',
        size: '3.6 MB',
        url: '#',
        type: 'pdf',
        description: 'Complete user flow & wireframes for agency portfolio project.',
        isLocked: false
      },
      {
        id: 'file4',
        name: 'brand_identity_guidelines.pdf',
        category: 'Assets',
        uploadedBy: 'Jannat Ul Firdous',
        uploadedAt: '2026-05-28T09:00:00Z',
        size: '8.2 MB',
        url: '#',
        type: 'pdf',
        description: 'Corporate colors, logo vectors and typography standards packet.',
        isLocked: false
      }
    ];
  });

  const [agreements, setAgreements] = useState<Agreement[]>(() => {
    const saved = localStorage.getItem('bizflow_agreements');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'ag-default-1',
        companyName: 'Innovix BD Ltd',
        employeeId: 'tm3',
        employeeName: 'Tanvir Hossain',
        employeeRole: 'Developer',
        projectName: 'Innovix Corporate ERP',
        projectDescription: 'Building dynamic inventory ledgers, tax integrations, and multi-currency system backups.',
        agreementText: `# WORK AGREEMENT: INNOVIX CORPORATE ERP DEVELOPMENT\n\nThis Work Agreement ("Agreement") is signed into effect on **2026-05-15** by and between:\n\n1. **Innovix BD Ltd** (the "Company")\n2. **Tanvir Hossain** (the "Employee" or "Developer")\n\n### 1. SCOPES OF REMOTE SERVICE\nThe Developer shall develop and integrate custom dynamic tax engines, multi-currency ledger engines, and transactional backup protocols inside the Core ERP platform.\n\n### 2. INTELLECTUAL PROPERTY & NDA\nAll source code, database structures, documentation, and logic built during this project remain the absolute, exclusive intellectual property of the Company.\n\n### 3. RESPONSIBILITY & LIABILITIES\n- Must write clean React Native / TypeScript code aligned with corporate security rules.\n- Any malicious injection or sharing of source code outside the authorized dev servers constitutes breech of trust and legal liability of up to BDT 5,00,000.`,
        createdAt: '2026-05-15T12:00:00Z',
        status: 'Signed',
        employeeSignature: 'Signed Digitally by Tanvir Hossain [Verified Token: EM-tm3-8835]',
        adminSignature: 'Signed Digitally by Zakir Hasan [CEO/Admin, Innovix BD Ltd]',
        signedAt: '2026-05-15T14:30:00Z'
      }
    ];
  });

  const [currentUser, setCurrentUser] = useState<{ role: 'Admin' | 'Employee' | 'Client'; id: string; name: string; email: string }>(() => {
    const saved = localStorage.getItem('bizflow_current_user');
    return saved ? JSON.parse(saved) : { role: 'Admin', id: 'admin', name: 'Zakir Hasan', email: 'zakir@innovix-bd.com' };
  });

  const [activeTab, setActiveTab] = useState<string>(() => {
    const savedUser = localStorage.getItem('bizflow_current_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      if (parsed.role === 'Employee') return 'employee-dashboard';
      if (parsed.role === 'Client') return 'client-dashboard';
    }
    return 'dashboard';
  });

  const [language, setLanguage] = useState<'en' | 'bn'>('bn'); // Default to Bengali as requested

  // Local Time tracking (UTC display as secondary layout highlight)
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('bizflow_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('bizflow_bank_accounts', JSON.stringify(bankAccounts));
  }, [bankAccounts]);

  useEffect(() => {
    localStorage.setItem('bizflow_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('bizflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('bizflow_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('bizflow_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('bizflow_meetings', JSON.stringify(meetings));
  }, [meetings]);

  useEffect(() => {
    localStorage.setItem('bizflow_team', JSON.stringify(team));
  }, [team]);

  useEffect(() => {
    localStorage.setItem('bizflow_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('bizflow_chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem('bizflow_company_files', JSON.stringify(companyFiles));
  }, [companyFiles]);

  useEffect(() => {
    localStorage.setItem('bizflow_agreements', JSON.stringify(agreements));
  }, [agreements]);

  useEffect(() => {
    localStorage.setItem('bizflow_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Auth helpers
  const handleLoginSuccess = (session: { role: 'Admin' | 'Employee' | 'Client'; id: string; name: string; email: string }) => {
    setIsLoggedIn(true);
    setCurrentUser(session);
    localStorage.setItem('bizflow_is_logged_in', 'true');
    localStorage.setItem('bizflow_current_user', JSON.stringify(session));

    // Redirect active tab based on role automatically!
    if (session.role === 'Employee') {
      setActiveTab('employee-dashboard');
    } else if (session.role === 'Client') {
      setActiveTab('client-dashboard');
    } else {
      setActiveTab('dashboard'); // Admin default
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('bizflow_is_logged_in', 'false');
    localStorage.removeItem('bizflow_current_user');
  };

  // Staff registry & disbursements helpers
  const handleAddEmployee = (newEmpData: Omit<TeamMember, 'id' | 'paymentsPaid'>) => {
    const newId = `tm${team.length + 1}`;
    const newEmp: TeamMember = {
      ...newEmpData,
      id: newId,
      paymentsPaid: []
    };
    setTeam(prev => [...prev, newEmp]);
  };

  const handleDisburseSalary = (employeeId: string, month: string, amount: number) => {
    // 1. Appends payment stub to team registry database
    setTeam(prev => prev.map(emp => {
      if (emp.id === employeeId) {
        return {
          ...emp,
          paymentsPaid: [
            ...emp.paymentsPaid,
            {
              month,
              amount,
              paidDate: new Date().toISOString().split('T')[0],
              txId: `TX-PAY-${Math.floor(100 + Math.random() * 900)}`
            }
          ]
        };
      }
      return emp;
    }));

    // 2. Debit core corporate bank accounts (Dutch Bangla Bank b1)
    const bankId = 'b1';
    setBankAccounts(prev => prev.map(acc => {
      if (acc.id === bankId) {
        return { ...acc, balance: acc.balance - amount };
      }
      return acc;
    }));

    // 3. Record an automatic central Expense transaction 
    const targetEmp = team.find(e => e.id === employeeId);
    const newTx: Transaction = {
      id: `tr${transactions.length + 1}`,
      type: 'Expense',
      category: 'Payroll & Salaries',
      amount,
      date: new Date().toISOString().split('T')[0],
      description: `Salary payout to ${targetEmp ? targetEmp.name : 'Staff'} for ${month}`,
      bankAccountId: bankId,
      paymentMethod: 'Bank Transfer'
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const handleDeleteEmployee = (id: string) => {
    setTeam(prev => prev.filter(emp => emp.id !== id));
  };

  const handleDeleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
  };

  // Chat message support dispatcher
  const handleSendChatMessage = (receiverId: string, message: string, attachments?: { name: string; url: string; type: string }[]) => {
    const newMsg: ChatMessage = {
      id: `msg${chats.length + 1}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      receiverId,
      message,
      timestamp: new Date().toISOString(),
      attachments
    };
    setChats(prev => [...prev, newMsg]);
  };

  // Employee progress submission
  const handleSubmitReport = (newRepData: Omit<EmployeeReport, 'id' | 'employeeId' | 'employeeName' | 'status'>) => {
    const newId = `rep${reports.length + 1}`;
    const newReport: EmployeeReport = {
      ...newRepData,
      id: newId,
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      status: 'Pending'
    };
    setReports(prev => [newReport, ...prev]);
  };

  // State Callbacks & Handlers
  const handleAddClient = (newClientData: Omit<Client, 'id' | 'dueAmount'>) => {
    const newId = `cl${clients.length + 1}`;
    const newClient: Client = {
      ...newClientData,
      id: newId,
      dueAmount: newClientData.totalBudget - newClientData.paidAmount
    };
    setClients(prev => [...prev, newClient]);
  };

  const handleAddCompanyFile = (newFileData: Omit<CompanyFile, 'id' | 'uploadedBy' | 'uploadedAt'>) => {
    const newId = `file${Date.now()}`;
    const newFile: CompanyFile = {
      ...newFileData,
      id: newId,
      uploadedBy: currentUser.name || 'Admin',
      uploadedAt: new Date().toISOString()
    };
    setCompanyFiles(prev => [newFile, ...prev]);
  };

  const handleDeleteCompanyFile = (id: string) => {
    if (confirm(language === 'en' ? 'Are you sure you want to delete this company asset backup?' : 'আপনি কি সত্যিই এই কোম্পানি প্রজেক্ট ফাইলটি চিরতরে মুছে ফেলতে চান?')) {
      setCompanyFiles(prev => prev.filter(f => f.id !== id));
    }
  };

  const handleToggleLockFile = (id: string) => {
    setCompanyFiles(prev => prev.map(f => {
      if (f.id === id) {
        return { ...f, isLocked: !f.isLocked };
      }
      return f;
    }));
  };

  const handleRecordPayment = (clientId: string, amount: number, note: string, category?: string, bankAccountId?: string) => {
    // 1. Update client totals
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        const updatedPaid = c.paidAmount + amount;
        return {
          ...c,
          paidAmount: updatedPaid,
          dueAmount: c.totalBudget - updatedPaid
        };
      }
      return c;
    }));

    // 2. Record dynamic ledger transaction inside target bank account as standard inflow method
    const targetAccountId = bankAccountId || 'b1';
    setBankAccounts(prev => prev.map(acc => {
      if (acc.id === targetAccountId) {
        return { ...acc, balance: acc.balance + amount };
      }
      return acc;
    }));

    // 3. Add transaction logging entry with account references
    const newTx: Transaction = {
      id: `tr${transactions.length + 1}`,
      clientId,
      type: 'Income',
      category: category || 'Milestone Payment (কাজের কিস্তি পেমেন্ট)',
      amount,
      date: new Date().toISOString().split('T')[0],
      description: note || `Received client milestone payment.`,
      bankAccountId: targetAccountId,
      paymentMethod: 'Bank Transfer'
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const handleAddBankAccount = (newAcc: Omit<BankAccount, 'id'>) => {
    const newId = `ba${bankAccounts.length + 1}`;
    setBankAccounts(prev => [...prev, { ...newAcc, id: newId }]);
  };

  const handleRecordExpense = (expenseData: Omit<Transaction, 'id' | 'type'>) => {
    const newId = `tr${transactions.length + 1}`;
    const newExpense: Transaction = {
      ...expenseData,
      id: newId,
      type: 'Expense'
    };
    setTransactions(prev => [newExpense, ...prev]);

    if (expenseData.bankAccountId) {
      setBankAccounts(prev => prev.map(acc => {
        if (acc.id === expenseData.bankAccountId) {
          return { ...acc, balance: acc.balance - expenseData.amount };
        }
        return acc;
      }));
    }
  };

  const handleTransferFunds = (fromId: string, toId: string, amount: number, note: string) => {
    setBankAccounts(prev => prev.map(acc => {
      if (acc.id === fromId) {
        return { ...acc, balance: acc.balance - amount };
      }
      if (acc.id === toId) {
        return { ...acc, balance: acc.balance + amount };
      }
      return acc;
    }));

    const newId1 = `tr${transactions.length + 1}`;
    const newId2 = `tr${transactions.length + 2}`;
    const dateStr = new Date().toISOString().split('T')[0];

    const txFrom: Transaction = {
      id: newId1,
      type: 'Expense',
      category: 'Fund Transfer',
      amount,
      date: dateStr,
      description: note || `Transfer: Funds sent to secondary account.`,
      bankAccountId: fromId,
      paymentMethod: 'Internal Transfer'
    };

    const txTo: Transaction = {
      id: newId2,
      type: 'Income',
      category: 'Fund Transfer',
      amount,
      date: dateStr,
      description: note || `Transfer: Funds received from source.`,
      bankAccountId: toId,
      paymentMethod: 'Internal Transfer'
    };

    setTransactions(prev => [txTo, txFrom, ...prev]);
  };

  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newId = `tk${tasks.length + 1}`;
    const newTask: Task = {
      ...newTaskData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const handleUpdateTaskStatus = (taskId: string, status: TaskStatus, note?: string, attachments?: { name: string; url: string; type: string }[]) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status,
          submissionNote: note !== undefined ? note : t.submissionNote,
          attachments: attachments !== undefined ? attachments : t.attachments
        };
      }
      return t;
    }));
  };

  const handleAddService = (newServiceData: Omit<Service, 'id'>) => {
    const newId = `sv${services.length + 1}`;
    const newService: Service = {
      ...newServiceData,
      id: newId
    };
    setServices(prev => [...prev, newService]);
  };

  const handleAddMeeting = (newMeetingData: Omit<Meeting, 'id' | 'isCompleted'>) => {
    const newId = `mt${meetings.length + 1}`;
    const newMeeting: Meeting = {
      ...newMeetingData,
      id: newId,
      isCompleted: false
    };
    setMeetings(prev => [newMeeting, ...prev]);
  };

  const handleAddAgreement = (newAg: Agreement) => {
    setAgreements(prev => [newAg, ...prev]);
  };

  const handleUpdateAgreement = (updated: Agreement) => {
    setAgreements(prev => prev.map(a => a.id === updated.id ? updated : a));
  };

  const handleDeleteAgreement = (id: string) => {
    setAgreements(prev => prev.filter(a => a.id !== id));
  };

  // Convert Gemini suggested action points to real items
  const handleAutoAddGeneratedTasks = (suggestedTasks: Omit<Task, 'id' | 'createdAt'>[]) => {
    const newMapped = suggestedTasks.map((st, idx) => ({
      ...st,
      id: `tk${tasks.length + idx + 1}`,
      createdAt: new Date().toISOString().split('T')[0]
    }));
    setTasks(prev => [...newMapped, ...prev]);
  };

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'bn' : 'en'));
  };

  // Render Login view if configuration simulated portal is enabled
  if (settings.showCustomLoginSim && !isLoggedIn) {
    return (
      <LoginView 
        settings={settings}
        language={language}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  return (
    <div className={`min-h-screen bg-theme-bg text-theme-text-main flex flex-col md:flex-row relative overflow-x-hidden font-sans antialiased text-xs transition-colors duration-300 ${themeMode}`}>
      
      {/* Background Glow Mesh Gradients */}
      <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none z-0"></div>
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-theme-sidebar backdrop-blur-xl border-b md:border-b-0 md:border-r border-theme-border text-slate-200 flex flex-col shrink-0 print:hidden relative z-10 transition-colors duration-300">
        
        {/* Brand Header */}
        <div className="p-6 border-b border-theme-border flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-neutral-800 to-neutral-900 rounded-xl flex items-center justify-center font-black text-white shadow-lg shrink-0 text-base border border-white/10">
                {settings.agencyLogoInitials || 'IX'}
              </div>
              <div className="truncate">
                <h1 className="text-sm font-black tracking-wider uppercase flex items-center gap-2 text-theme-text-main truncate max-w-[130px]">
                  <span>{settings.agencyName || 'Innovix BD'}</span>
                </h1>
                <p className="text-[9px] text-theme-text-muted font-mono tracking-widest mt-0.5 uppercase">ERP Nodes Portal</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 w-full">
            {/* Dark / Light Toggle Pill */}
            <button 
              onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
              className="flex-1 p-2 rounded-xl bg-white/5 hover:bg-white/10 dark:hover:bg-zinc-800/40 text-theme-text-sub hover:text-theme-text-main transition flex items-center justify-center gap-2 cursor-pointer font-mono text-[9px] border border-theme-border shadow-xs"
              title={themeMode === 'light' ? 'Switch to Dark Mode (ডার্ক মোড সচল করুন)' : 'Switch to Light Mode (লাইট মোড সচল করুন)'}
            >
              {themeMode === 'light' ? (
                <>
                  <Moon className="h-3.5 w-3.5 text-indigo-500 animate-pulse" />
                  <span className="font-bold">Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-500" />
                  <span className="font-bold">Light Mode</span>
                </>
              )}
            </button>

            {/* Language Toggle Pill */}
            <button 
              onClick={toggleLanguage}
              className="px-3 py-2 bg-white/5 hover:bg-white/10 dark:hover:bg-zinc-800/40 border border-theme-border text-[9px] rounded-xl text-theme-text-sub hover:text-theme-text-main transition font-bold shrink-0 cursor-pointer font-mono flex items-center justify-center gap-1.5"
            >
              <Globe className="h-3.5 w-3.5 text-teal-500" />
              <span>{language === 'en' ? 'বাংলা' : 'EN'}</span>
            </button>
          </div>
        </div>

        {/* Live Clock / System Metadata Indicator */}
        <div className="px-6 py-2.5 bg-black/25 border-b border-white/5 flex items-center gap-2 text-[9px] font-mono text-slate-400">
          <Clock className="h-3.5 w-3.5 text-indigo-400" />
          <span className="truncate">{currentTime || 'Timeline Syncing...'}</span>
        </div>

        {/* Tab Links */}
        <nav className="flex-grow p-4 space-y-1">
          {currentUser.role === 'Admin' ? (
            <>
              {/* Dashboard */}
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition font-sans cursor-pointer ${
                  activeTab === 'dashboard' 
                    ? 'bg-white/15 text-white border border-white/10 shadow-lg' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
                }`}
              >
                <LayoutDashboard className="h-4.5 w-4.5" />
                <span>{language === 'en' ? 'Dashboard' : 'ড্যাশবোর্ড'}</span>
              </button>

              {/* User management and registry */}
              <button
                onClick={() => setActiveTab('user-management')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition font-sans cursor-pointer ${
                  activeTab === 'user-management' 
                    ? 'bg-white/15 text-white border border-white/10 shadow-lg' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
                }`}
              >
                <Users className="h-4.5 w-4.5 text-indigo-400" />
                <span>{language === 'en' ? 'User Roles Hub' : 'ইউজার রোলস কন্ট্রোল'}</span>
              </button>

              {/* CRM Accounts */}
              <button
                onClick={() => setActiveTab('clients')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition font-sans cursor-pointer ${
                  activeTab === 'clients' 
                    ? 'bg-white/15 text-white border border-white/10 shadow-lg' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
                }`}
              >
                <Briefcase className="h-4.5 w-4.5" />
                <span>{language === 'en' ? 'Clients CRM & Bills' : 'ক্লায়েন্ট সিআরএম ও বিল'}</span>
              </button>

              {/* Team / Tasks */}
              <button
                onClick={() => setActiveTab('tasks')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition font-sans cursor-pointer ${
                  activeTab === 'tasks' 
                    ? 'bg-white/15 text-white border border-white/10 shadow-lg' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
                }`}
              >
                <FolderGit2 className="h-4.5 w-4.5" />
                <span>{language === 'en' ? 'Team Tasks' : 'টিম মেম্বার ও কাজ'}</span>
              </button>

              {/* Service Packages */}
              <button
                onClick={() => setActiveTab('services')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition font-sans cursor-pointer ${
                  activeTab === 'services' 
                    ? 'bg-white/15 text-white border border-white/10 shadow-lg' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
                }`}
              >
                <DollarSign className="h-4.5 w-4.5" />
                <span>{language === 'en' ? 'Service Packages' : 'সার্ভিস প্যাকেজসমূহ'}</span>
              </button>

              {/* Live Meetings */}
              <button
                onClick={() => setActiveTab('meetings')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition font-sans cursor-pointer ${
                  activeTab === 'meetings' 
                    ? 'bg-white/15 text-white border border-white/10 shadow-lg' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
                }`}
              >
                <Video className="h-4.5 w-4.5" />
                <span>{language === 'en' ? 'Meeting Boardroom' : 'ভার্চুয়াল মিটিং রুম'}</span>
              </button>

              {/* Accounting Ledger */}
              <button
                onClick={() => setActiveTab('accounting')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition font-sans cursor-pointer ${
                  activeTab === 'accounting' 
                    ? 'bg-white/15 text-white border border-white/10 shadow-lg' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
                }`}
              >
                <TrendingUp className="h-4.5 w-4.5" />
                <span>{language === 'en' ? 'Accounts Ledger' : 'কোম্পানি হিসাবখাতা'}</span>
              </button>

              {/* CRM Support Chats Hub */}
              <button
                onClick={() => setActiveTab('support-chats')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition font-sans cursor-pointer ${
                  activeTab === 'support-chats' 
                    ? 'bg-indigo-550/20 text-indigo-300 border border-indigo-500/20 shadow-lg' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
                }`}
              >
                <MessageSquare className="h-4.5 w-4.5 text-indigo-400" />
                <span>{language === 'en' ? 'Support Chats Hub' : 'গ্রাহক ও টিম চ্যাট হাব'}</span>
              </button>

              {/* File Manager Vault */}
              <button
                onClick={() => setActiveTab('file-manager')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition font-sans cursor-pointer ${
                  activeTab === 'file-manager' 
                    ? 'bg-white/15 text-white border border-white/10 shadow-lg' 
                    : 'text-slate-400 hover:text-slate-105 hover:bg-white/5 border border-transparent'
                }`}
              >
                <HardDrive className="h-4.5 w-4.5 text-emerald-400" />
                <span>{language === 'en' ? 'Company File Vault' : 'ফাইল ম্যানেজার সিস্টেম'}</span>
              </button>

              {/* Employee Agreements Hub */}
              <button
                onClick={() => setActiveTab('agreements')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition font-sans cursor-pointer ${
                  activeTab === 'agreements' 
                    ? 'bg-white/15 text-white border border-white/10 shadow-lg' 
                    : 'text-slate-400 hover:text-slate-105 hover:bg-white/5 border border-transparent'
                }`}
              >
                <ShieldCheck className="h-4.5 w-4.5 text-blue-400" />
                <span>{language === 'en' ? 'Employee Agreements' : 'রিমোট এগ্রিমেন্ট হাব'}</span>
              </button>
            </>
          ) : currentUser.role === 'Employee' ? (
            <>
              {/* Employee Workspace link */}
              <button
                onClick={() => setActiveTab('employee-dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition font-sans cursor-pointer ${
                  activeTab === 'employee-dashboard' 
                    ? 'bg-white/15 text-white border border-white/10 shadow-lg' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
                }`}
              >
                <LayoutDashboard className="h-4.5 w-4.5 text-teal-400" />
                <span>{language === 'en' ? 'Employee Workspace' : 'আমার ওয়ার্কস্পেস'}</span>
              </button>

              {/* Live Meetings (Team participation) */}
              <button
                onClick={() => setActiveTab('meetings')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition font-sans cursor-pointer ${
                  activeTab === 'meetings' 
                    ? 'bg-white/15 text-white border border-white/10 shadow-lg' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
                }`}
              >
                <Video className="h-4.5 w-4.5" />
                <span>{language === 'en' ? 'Meeting Broadroom' : 'ভার্চুয়াল মিটিং রুম'}</span>
              </button>
            </>
          ) : (
            <>
              {/* Client Workspace link */}
              <button
                onClick={() => setActiveTab('client-dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition font-sans cursor-pointer ${
                  activeTab === 'client-dashboard' 
                    ? 'bg-white/15 text-white border border-white/10 shadow-lg' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <LayoutDashboard className="h-4.5 w-4.5 text-emerald-450" />
                <span>{language === 'en' ? 'Client Dashboard' : 'রশিদ ও অগ্রগামী কাজ'}</span>
              </button>
            </>
          )}

          {/* AI Partner advisor (Accessible to all accounts) */}
          <button
            onClick={() => setActiveTab('ai-advisor')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition font-sans cursor-pointer ${
              activeTab === 'ai-advisor' 
                ? 'bg-[#1e1b4b] text-indigo-300 border border-indigo-500/20 shadow-md' 
                : 'text-slate-400 hover:text-indigo-300 hover:bg-white/5 border border-transparent'
            }`}
          >
            <Sparkles className="h-4.5 w-4.5 text-indigo-400 animate-pulse" />
            <span>{language === 'en' ? 'Gemini Consultant' : 'জেমিনি এআই কনসালটেন্ট'}</span>
          </button>

          {/* System Preferences */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition font-sans cursor-pointer ${
              activeTab === 'settings' 
                ? 'bg-white/15 text-white border border-white/10 shadow-lg' 
                : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
            }`}
          >
            <Settings className="h-4.5 w-4.5" />
            <span>{language === 'en' ? 'Branding & Settings' : 'সিস্টেম সেটিংস'}</span>
          </button>
        </nav>

        {/* Footer profile summary with logout button */}
        <div className="p-4 border-t border-white/10 text-xs text-slate-300 gap-2 space-y-2 bg-[#0d121f]">
          <div className="flex items-center gap-2.5 bg-white/5 p-2 rounded-xl border border-white/5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center font-black text-white uppercase font-mono shadow-xs shrink-0 select-none text-[10px]">
              {currentUser.role === 'Admin' ? 'AD' : currentUser.role === 'Employee' ? 'EM' : 'CL'}
            </div>
            <div className="truncate">
              <span className="block font-bold text-white text-[11px] truncate">{currentUser.name || 'Staff User'}</span>
              <span className="block text-[8.5px] text-slate-450 truncate font-mono">{currentUser.role} Control</span>
            </div>
          </div>
          {settings.showCustomLoginSim && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-350 py-2 rounded-xl font-bold transition font-sans cursor-pointer"
            >
              <Power className="h-3.5 w-3.5" />
              <span>{language === 'en' ? 'Sign Out Session' : 'লগআউট করুন'}</span>
            </button>
          )}
        </div>

      </aside>

      {/* Main Viewport Container */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10">
        
        {/* Render Selected View layout */}
        {activeTab === 'dashboard' && (
          <DashboardView 
            clients={clients}
            tasks={tasks}
            transactions={transactions}
            services={services}
            language={language}
            onNavigate={(view) => setActiveTab(view)}
            settings={settings}
          />
        )}

        {activeTab === 'clients' && (
          <ClientsView 
            clients={clients}
            onAddClient={handleAddClient}
            onRecordPayment={handleRecordPayment}
            language={language}
            settings={settings}
            bankAccounts={bankAccounts}
          />
        )}

        {activeTab === 'tasks' && (
          <TeamTasksView 
            team={team}
            tasks={tasks}
            onAddTask={handleAddTask}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            language={language}
          />
        )}

        {activeTab === 'services' && (
          <ServicesView 
            services={services}
            onAddService={handleAddService}
            language={language}
          />
        )}

        {activeTab === 'meetings' && (
          <MeetingsView 
            meetings={meetings}
            team={team}
            onAddMeeting={handleAddMeeting}
            onAutoAddGeneratedTasks={handleAutoAddGeneratedTasks}
            language={language}
          />
        )}

        {activeTab === 'accounting' && (
          <AccountingView 
            bankAccounts={bankAccounts}
            transactions={transactions}
            clients={clients}
            language={language}
            onAddBankAccount={handleAddBankAccount}
            onRecordExpense={handleRecordExpense}
            onTransferFunds={handleTransferFunds}
            currencySymbol={settings.currency === 'BDT' ? '৳' : '$'}
            expenseCategories={settings.expenseCategories}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView 
            settings={settings}
            onSaveSettings={(updated) => setSettings(updated)}
            language={language}
          />
        )}

        {activeTab === 'ai-advisor' && (
          <AiPartnerView 
            language={language}
          />
        )}

        {activeTab === 'employee-dashboard' && (
          <EmployeeDashboard 
            employee={team.find(t => t.id === currentUser.id) || team[2]} 
            tasks={tasks}
            reports={reports}
            chats={chats}
            clients={clients}
            settings={settings}
            language={language}
            agreements={agreements}
            onUpdateAgreement={handleUpdateAgreement}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onSubmitReport={handleSubmitReport}
            onSendChatMessage={handleSendChatMessage}
          />
        )}

        {activeTab === 'client-dashboard' && (
          <ClientDashboard 
            client={clients.find(c => c.id === currentUser.id) || clients[0]} 
            tasks={tasks}
            transactions={transactions}
            chats={chats}
            team={team}
            settings={settings}
            language={language}
            onRecordSimulatedPayment={handleRecordPayment}
            onSendChatMessage={handleSendChatMessage}
            onAddTask={handleAddTask}
          />
        )}

        {activeTab === 'user-management' && (
          <UserManagementView 
            clients={clients}
            team={team}
            language={language}
            settings={settings}
            onAddClient={handleAddClient}
            onAddEmployee={handleAddEmployee}
            onDisburseSalary={handleDisburseSalary}
            onDeleteClient={handleDeleteClient}
            onDeleteEmployee={handleDeleteEmployee}
          />
        )}

        {activeTab === 'support-chats' && (
          <SupportChatsView 
            chats={chats}
            clients={clients}
            team={team}
            language={language}
            onSendChatMessage={handleSendChatMessage}
          />
        )}

        {activeTab === 'file-manager' && (
          <CompanyFileManager 
            files={companyFiles}
            settings={settings}
            language={language}
            clients={clients}
            bankAccounts={bankAccounts}
            transactions={transactions}
            tasks={tasks}
            meetings={meetings}
            services={services}
            team={team}
            onAddCompanyFile={handleAddCompanyFile}
            onDeleteCompanyFile={handleDeleteCompanyFile}
            onToggleLockFile={handleToggleLockFile}
          />
        )}

        {activeTab === 'agreements' && (
          <AgreementsView 
            agreements={agreements}
            team={team}
            settings={settings}
            language={language}
            onAddAgreement={handleAddAgreement}
            onUpdateAgreement={handleUpdateAgreement}
            onDeleteAgreement={handleDeleteAgreement}
          />
        )}

      </main>

    </div>
  );
}
