import React, { useState } from 'react';
import { Client, TeamMember, AppSettings, Role } from '../types';
import { 
  Users, 
  UserPlus, 
  Briefcase, 
  DollarSign, 
  PlusCircle, 
  Trash2, 
  Key, 
  Check, 
  Sparkles, 
  Phone, 
  Mail, 
  Calendar,
  Gift,
  Coins,
  ShieldAlert
} from 'lucide-react';

interface UserManagementViewProps {
  clients: Client[];
  team: TeamMember[];
  language: 'en' | 'bn';
  settings: AppSettings;
  onAddClient: (newClientData: Omit<Client, 'id' | 'dueAmount'>) => void;
  onAddEmployee: (newEmpData: Omit<TeamMember, 'id' | 'paymentsPaid'>) => void;
  onDisburseSalary: (employeeId: string, month: string, amount: number) => void;
  onDeleteClient: (id: string) => void;
  onDeleteEmployee: (id: string) => void;
}

export default function UserManagementView({
  clients,
  team,
  language,
  settings,
  onAddClient,
  onAddEmployee,
  onDisburseSalary,
  onDeleteClient,
  onDeleteEmployee
}: UserManagementViewProps) {
  const [activeTab, setActiveTab] = useState<'employees' | 'clients'>('employees');
  
  // Dialog / form toggles
  const [showAddEmpForm, setShowAddEmpForm] = useState(false);
  const [showAddClForm, setShowAddClForm] = useState(false);
  const [disbursingEmpId, setDisbursingEmpId] = useState<string | null>(null);

  // New Employee state
  const [empName, setEmpName] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empPhone, setEmpPhone] = useState('');
  const [empRole, setEmpRole] = useState<Role>('Developer');
  const [empSalary, setEmpSalary] = useState(45000);
  const [empSkills, setEmpSkills] = useState('');

  // New Client state
  const [clName, setClName] = useState('');
  const [clCompany, setClCompany] = useState('');
  const [clEmail, setClEmail] = useState('');
  const [clPhone, setClPhone] = useState('');
  const [clProject, setClProject] = useState('');
  const [clBudget, setClBudget] = useState(3000);
  const [clPaid, setClPaid] = useState(1500);
  const [clNotes, setClNotes] = useState('');

  // Disbursement state
  const [payMonth, setPayMonth] = useState('June 2026');
  const [payAmount, setPayAmount] = useState(45000);

  const currencySymbol = settings.currency === 'BDT' ? '৳' : '$';

  const handleAddEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName.trim() || !empEmail.trim()) return;

    onAddEmployee({
      name: empName,
      email: empEmail,
      phone: empPhone,
      role: empRole,
      salaryAmount: empSalary,
      skills: empSkills.split(',').map(s => s.trim()).filter(s => s.length > 0),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      joinedDate: new Date().toISOString().split('T')[0]
    });

    // Reset
    setEmpName('');
    setEmpEmail('');
    setEmpPhone('');
    setEmpSalary(45000);
    setEmpSkills('');
    setShowAddEmpForm(false);
  };

  const handleAddClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clName.trim() || !clEmail.trim() || !clCompany.trim()) return;

    onAddClient({
      name: clName,
      companyName: clCompany,
      email: clEmail,
      phone: clPhone,
      projectName: clProject,
      totalBudget: clBudget,
      paidAmount: clPaid,
      status: 'Active',
      notes: clNotes
    });

    // Reset
    setClName('');
    setClCompany('');
    setClEmail('');
    setClPhone('');
    setClProject('');
    setClBudget(3000);
    setClPaid(1500);
    setClNotes('');
    setShowAddClForm(false);
  };

  const handleDisbursementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disbursingEmpId) return;

    onDisburseSalary(disbursingEmpId, payMonth, payAmount);
    setDisbursingEmpId(null);
  };

  const text = {
    title: language === 'en' ? 'User Portal and Roles Control' : 'ইউজার পোর্টাল ও রোলস ম্যানেজমেন্ট',
    clientsReg: language === 'en' ? 'Client Access Accounts' : 'ক্লায়েন্ট পোর্টাল অ্যাকাউন্টস',
    empsReg: language === 'en' ? 'Employee Access Accounts' : 'কর্মচারী পোর্টাল অ্যাকাউন্টস',
    addNewEmployee: language === 'en' ? 'Register New Employee' : 'নতুন কর্মচারী নিবন্ধন করুন',
    addNewClient: language === 'en' ? 'Register New Client' : 'নতুন ক্লায়েন্ট নিবন্ধন করুন',
    salaryDisb: language === 'en' ? 'Process Payroll Payment' : 'বেতন ও পে-স্লিপ প্রদান করুন',
    confirmDisb: language === 'en' ? 'Confirm and Disburse' : 'বেতন প্রদান নিশ্চিত করুন',
    monthLabel: language === 'en' ? 'Payroll Month Reference:' : 'বেতনের মাস সিলেক্ট করুন:',
    amountLabel: language === 'en' ? 'Salary Amount (' + currencySymbol + '):' : 'বেতনের পরিমাণ (' + currencySymbol + '):',
    nameField: language === 'en' ? 'Full Name' : 'পূর্ণ নাম',
    emailField: language === 'en' ? 'Registered Email' : 'ইমেইল এড্রেস',
    phoneField: language === 'en' ? 'Contact Phone' : 'যোগাযোগের মোবাইল',
    roleField: language === 'en' ? 'Assigned Role' : 'নির্ধারিত রোল / পদবী',
    salaryField: language === 'en' ? 'Base Monthly Pay Rate' : 'মাসিক মূল বেতন কাঠামো',
    skillsField: language === 'en' ? 'Skills (Separate with comma)' : 'যোগ্যতা / স্কিলসমূহ (কমা দিয়ে লিখুন)',
    companyField: language === 'en' ? 'Corporate Company Name' : 'কোম্পানির অফিসিয়াল নাম',
    projectField: language === 'en' ? 'Active Project Assignment' : 'সক্রিয় প্রকল্পের নাম',
    budgetField: language === 'en' ? 'Total Project Budget' : 'প্রজেক্ট মোট বাজেট',
    paidField: language === 'en' ? 'Initial Advance Paid' : 'প্রাথমিক পেমেন্ট',
    clientNotesField: language === 'en' ? 'Internal Client Notes' : 'ক্লায়েন্ট সম্পর্কিত অভ্যন্তরীণ নোট',
    submitting: language === 'en' ? 'Saving Secure Account...' : 'নিরাপদ অ্যাকাউন্ট ডেটা সংরক্ষণ করা হচ্ছে...',
    submitBtn: language === 'en' ? 'Save Account' : 'অ্যাকাউন্ট তৈরি করুন',
    deleteConfirm: language === 'en' ? 'Confirm Account Deletion' : 'অ্যাকাউন্ট মুছে ফেলার সত্যতা',
    disburseBtn: language === 'en' ? 'Pay Salary' : 'বেতন প্রদান',
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in text-xs text-slate-100">
      
      {/* Branding top block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xl font-black text-white font-display uppercase tracking-tight flex items-center gap-2">
            <Users className="h-5.5 w-5.5 text-blue-450" />
            <span>{text.title}</span>
          </h2>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5">Admin Central Hub to create user logins for Clients and Employees & manage automated payroll loops.</p>
        </div>

        {/* Action tabs to toggle */}
        <div className="flex bg-slate-900/60 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setActiveTab('employees')}
            className={`px-4 py-2 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'employees' ? 'bg-white/10 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>{text.empsReg}</span>
          </button>
          <button
            onClick={() => setActiveTab('clients')}
            className={`px-4 py-2 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'clients' ? 'bg-white/10 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="h-3.5 w-3.5" />
            <span>{text.clientsReg}</span>
          </button>
        </div>
      </div>

      {/* RENDER EMPLOYEES TAB ACCORDION */}
      {activeTab === 'employees' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black font-display text-slate-200">
              {language === 'en' ? 'Registered Office Staffs' : 'অফিস কর্মকর্তাদের তালিকা ও বেতন অনুমোদন'}
            </h3>
            <button
              onClick={() => {
                setShowAddEmpForm(!showAddEmpForm);
                setShowAddClForm(false);
              }}
              className="bg-indigo-650 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm text-[10.5px]"
            >
              <PlusCircle className="h-4 w-4" />
              <span>{text.addNewEmployee}</span>
            </button>
          </div>

          {/* Add Employee Form Dialog Drawer */}
          {showAddEmpForm && (
            <form onSubmit={handleAddEmployeeSubmit} className="bg-[#111625]/90 border border-white/10 p-5 rounded-2xl space-y-4 animate-fade-in max-w-2xl">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <h4 className="font-bold text-white text-[11px] font-mono tracking-wider flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  <span>{text.addNewEmployee}</span>
                </h4>
                <button type="button" onClick={() => setShowAddEmpForm(false)} className="text-slate-450 hover:text-white text-xs font-bold">X</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-350 font-bold mb-1.5">{text.nameField}</label>
                  <input
                    type="text"
                    required
                    value={empName}
                    onChange={(e) => setEmpName(e.target.value)}
                    placeholder="e.g. Arif Hossain"
                    className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-white outline-none focus:border-indigo-450 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-350 font-bold mb-1.5">{text.emailField}</label>
                  <input
                    type="email"
                    required
                    value={empEmail}
                    onChange={(e) => setEmpEmail(e.target.value)}
                    placeholder="e.g. arif@innovix-bd.com"
                    className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-white outline-none focus:border-indigo-455 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-350 font-bold mb-1.5">{text.phoneField}</label>
                  <input
                    type="text"
                    value={empPhone}
                    onChange={(e) => setEmpPhone(e.target.value)}
                    placeholder="e.g. +88017xxxxxxxx"
                    className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-white outline-none focus:border-indigo-455 text-xs font-mono"
                  />
                </div>

                {/* Role dropdown */}
                <div>
                  <label className="block text-slate-350 font-bold mb-1.5">{text.roleField}</label>
                  <select
                    value={empRole}
                    onChange={(e: any) => setEmpRole(e.target.value as Role)}
                    className="w-full bg-slate-900 border border-white/10 p-2.5 rounded-xl text-slate-200 outline-none focus:border-indigo-455 font-mono"
                  >
                    <option value="Developer">Software Developer</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="Designer">UI/UX Designer</option>
                    <option value="QA Tester">QA Automation Engineer</option>
                    <option value="Admin">Administrator</option>
                    <option value="Marketer">Creative Marketer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-350 font-bold mb-1.5">{text.salaryField}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-mono">{currencySymbol}</span>
                    <input
                      type="number"
                      required
                      value={empSalary}
                      onChange={(e) => setEmpSalary(parseInt(e.target.value) || 0)}
                      className="w-full bg-white/5 border border-white/10 p-2.5 pl-6 rounded-xl text-white outline-none focus:border-indigo-455 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-350 font-bold mb-1.5">{text.skillsField}</label>
                  <input
                    type="text"
                    value={empSkills}
                    onChange={(e) => setEmpSkills(e.target.value)}
                    placeholder="e.g. React, NodeJS, Tailwind CSS"
                    className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-white outline-none focus:border-indigo-455 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 text-right pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddEmpForm(false)}
                  className="bg-white/5 hover:bg-white/10 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-xs font-bold"
                >
                  {text.submitBtn}
                </button>
              </div>
            </form>
          )}

          {/* Employees List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {team.map(emp => (
              <div key={emp.id} className="bg-[#111625]/90 border border-white/15 p-4 rounded-2xl flex flex-col justify-between gap-5 relative overflow-hidden group hover:border-indigo-505/20 transition">
                <div className="flex items-start gap-3.5 relative z-10">
                  <img src={emp.avatar} alt={emp.name} className="w-11 h-11 rounded-xl object-cover shrink-0 border border-white/10" />
                  <div className="space-y-1 truncate">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-bold text-[13px] text-white tracking-tight">{emp.name}</h4>
                      <span className="bg-slate-800 text-slate-350 px-1.5 py-0.5 rounded text-[8.5px] font-bold font-mono uppercase">{emp.role}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 space-y-0.5">
                      <p className="flex items-center gap-1"><Mail className="h-3 w-3 shrink-0 inline text-blue-400" /> {emp.email}</p>
                      {emp.phone && <p className="flex items-center gap-1"><Phone className="h-3 w-3 shrink-0 inline text-indigo-400" /> {emp.phone}</p>}
                    </div>
                  </div>
                </div>

                {/* Skills tags list */}
                <div className="flex flex-wrap gap-1">
                  {emp.skills?.map((sk, id) => (
                    <span key={id} className="bg-white/5 border border-white/5 px-2 py-0.5 rounded text-[9px] text-indigo-300 font-mono">
                      {sk}
                    </span>
                  ))}
                </div>

                {/* Payroll summaries bar */}
                <div className="flex items-center justify-between border-t border-white/5 pt-3.5 font-mono">
                  <div>
                    <span className="block text-[8.5px] text-slate-450 uppercase">MONTHLY PAY</span>
                    <span className="block text-xs font-bold text-slate-202">{currencySymbol}{emp.salaryAmount.toLocaleString()}</span>
                  </div>

                  <div>
                    <span className="block text-[8.5px] text-slate-450 uppercase text-right">PAYMENTS CLEARED</span>
                    <span className="block text-xs font-bold text-emerald-400 text-right">{emp.paymentsPaid.length} log invoices</span>
                  </div>

                  <div className="flex gap-1.5">
                    <button
                      onClick={() => {
                        setDisbursingEmpId(emp.id);
                        setPayAmount(emp.salaryAmount);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-[9px] transition cursor-pointer flex items-center gap-1"
                    >
                      <Coins className="h-3 w-3" />
                      <span>{text.disburseBtn}</span>
                    </button>
                    {emp.id !== 'tm1' && (
                      <button
                        onClick={() => onDeleteEmployee(emp.id)}
                        className="bg-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-350 p-2 rounded-lg transition cursor-pointer"
                        title="Delete office staff record"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RENDER CLIENT DATA TAB */}
      {activeTab === 'clients' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black font-display text-slate-200">
              {language === 'en' ? 'Registered Company Client Accounts' : 'নিবন্ধিত প্রাতিষ্ঠানিক ক্লায়েন্ট তালিকা'}
            </h3>
            <button
              onClick={() => {
                setShowAddClForm(!showAddClForm);
                setShowAddEmpForm(false);
              }}
              className="bg-indigo-650 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm text-[10.5px]"
            >
              <PlusCircle className="h-4 w-4" />
              <span>{text.addNewClient}</span>
            </button>
          </div>

          {/* Add Client Form Drawer Drawer */}
          {showAddClForm && (
            <form onSubmit={handleAddClientSubmit} className="bg-[#111625]/90 border border-white/10 p-5 rounded-2xl space-y-4 animate-fade-in max-w-2xl">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <h4 className="font-bold text-white text-[11px] font-mono tracking-wider flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  <span>{text.addNewClient}</span>
                </h4>
                <button type="button" onClick={() => setShowAddClForm(false)} className="text-slate-450 hover:text-white text-xs font-bold">X</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-350 font-bold mb-1.5">{text.nameField} (Contact Person)</label>
                  <input
                    type="text"
                    required
                    value={clName}
                    onChange={(e) => setClName(e.target.value)}
                    placeholder="e.g. Rahat Chowdhury"
                    className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-white outline-none focus:border-indigo-455 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-350 font-bold mb-1.5">{text.companyField}</label>
                  <input
                    type="text"
                    required
                    value={clCompany}
                    onChange={(e) => setClCompany(e.target.value)}
                    placeholder="e.g. Dhaka Agro Foods Ltd"
                    className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-white outline-none focus:border-indigo-455 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-350 font-bold mb-1.5">{text.emailField}</label>
                  <input
                    type="email"
                    required
                    value={clEmail}
                    onChange={(e) => setClEmail(e.target.value)}
                    placeholder="rahat@agrofoods.bd"
                    className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-white outline-none focus:border-indigo-455 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-350 font-bold mb-1.5">{text.phoneField}</label>
                  <input
                    type="text"
                    value={clPhone}
                    onChange={(e) => setClPhone(e.target.value)}
                    placeholder="e.g. +8801712345678"
                    className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-white outline-none focus:border-indigo-455 text-xs font-mono"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-350 font-bold mb-1.5">{text.projectField}</label>
                  <input
                    type="text"
                    required
                    value={clProject}
                    onChange={(e) => setClProject(e.target.value)}
                    placeholder="e.g. E-Commerce Platform & Android app"
                    className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-white outline-none focus:border-indigo-455 text-xs font-sans"
                  />
                </div>

                <div>
                  <label className="block text-slate-350 font-bold mb-1.5">{text.budgetField}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-mono">{currencySymbol}</span>
                    <input
                      type="number"
                      required
                      value={clBudget}
                      onChange={(e) => setClBudget(parseInt(e.target.value) || 0)}
                      className="w-full bg-white/5 border border-white/10 p-2.5 pl-6 rounded-xl text-white outline-none focus:border-indigo-455 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-350 font-bold mb-1.5">{text.paidField}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-mono">{currencySymbol}</span>
                    <input
                      type="number"
                      required
                      value={clPaid}
                      onChange={(e) => setClPaid(parseInt(e.target.value) || 0)}
                      className="w-full bg-white/5 border border-white/10 p-2.5 pl-6 rounded-xl text-white outline-none focus:border-indigo-455 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-350 font-bold mb-1.5">{text.clientNotesField}</label>
                  <textarea
                    rows={3}
                    value={clNotes}
                    onChange={(e) => setClNotes(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-white outline-none focus:border-indigo-455 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 text-right pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddClForm(false)}
                  className="bg-white/5 hover:bg-white/10 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-xs font-bold"
                >
                  {text.submitBtn}
                </button>
              </div>
            </form>
          )}

          {/* Clients List grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clients.map(cl => (
              <div key={cl.id} className="bg-[#111625]/90 border border-white/15 p-4 rounded-2xl space-y-4 group hover:border-emerald-505/20 transition">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1 truncate">
                    <span className="bg-emerald-500/10 border border-emerald-500/15 text-emerald-450 px-2 py-0.5 rounded-md text-[9px] font-bold font-mono">
                      {cl.projectName}
                    </span>
                    <h4 className="font-bold text-[13px] text-white tracking-tight mt-1 truncate">{cl.companyName}</h4>
                    <span className="block text-[10px] text-slate-400">Representative: <strong className="text-white">{cl.name}</strong></span>
                  </div>
                  
                  <button
                    onClick={() => onDeleteClient(cl.id)}
                    className="bg-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-350 p-2 rounded-lg transition cursor-pointer"
                    title="Delete client account"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="text-[10px] text-slate-400 space-y-0.5 border-l border-white/5 pl-2 font-mono">
                  <p><strong className="text-slate-450">Active Email:</strong> {cl.email}</p>
                  <p><strong className="text-slate-455">Phone No:</strong> {cl.phone}</p>
                </div>

                {/* Ledgers bar info */}
                <div className="grid grid-cols-3 bg-black/35 p-3 rounded-xl border border-white/5 text-center font-mono text-[10px]">
                  <div>
                    <span className="block text-[8px] text-slate-450 uppercase">Agreed Budget</span>
                    <span className="text-white font-bold">{currencySymbol}{cl.totalBudget.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] text-slate-450 uppercase">PAID MILESTONES</span>
                    <span className="text-emerald-400 font-bold">{currencySymbol}{cl.paidAmount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] text-slate-450 uppercase">OUTSTANDING DUE</span>
                    <span className={`font-bold ${cl.dueAmount > 0 ? 'text-amber-500' : 'text-slate-400'}`}>{currencySymbol}{cl.dueAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL / DIALOG POPUP: Disburse payroll payments */}
      {disbursingEmpId && (
        <div className="fixed inset-0 bg-[#000000]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111625] border border-white/10 p-6 rounded-2xl max-w-sm w-full space-y-4 animate-fade-in text-xs">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <h4 className="font-bold text-white text-sm font-display tracking-tight flex items-center gap-1.5">
                <Coins className="h-4.5 w-4.5 text-emerald-400" />
                <span>{text.salaryDisb}</span>
              </h4>
              <button onClick={() => setDisbursingEmpId(null)} className="text-slate-400 hover:text-white font-bold">X</button>
            </div>

            <p className="text-[10.5px] text-slate-400 leading-relaxed font-mono">
              Process secure salary transfer for <strong className="text-transparent bg-clip-text bg-gradient-to-r from-blue-450 to-indigo-350">{team.find(t => t.id === disbursingEmpId)?.name}</strong>. This registers as a corporate ledger debit Expense automatically.
            </p>

            <form onSubmit={handleDisbursementSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-350 font-bold mb-1.5">{text.monthLabel}</label>
                <input
                  type="text"
                  required
                  value={payMonth}
                  onChange={(e) => setPayMonth(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-white outline-none focus:border-indigo-400 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-355 font-bold mb-1.5">{text.amountLabel}</label>
                <input
                  type="number"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(parseInt(e.target.value) || 0)}
                  className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-white outline-none focus:border-indigo-400 text-xs font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 text-right">
                <button
                  type="button"
                  onClick={() => setDisbursingEmpId(null)}
                  className="bg-white/5 hover:bg-white/10 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-xs font-bold"
                >
                  {text.confirmDisb}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
