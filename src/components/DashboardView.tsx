import React from 'react';
import { Client, Task, Transaction, Service, AppSettings } from '../types';
import { DollarSign, AlertTriangle, CheckCircle2, FileText, TrendingUp, Users, Activity, Layers } from 'lucide-react';

interface DashboardViewProps {
  clients: Client[];
  tasks: Task[];
  transactions: Transaction[];
  services: Service[];
  language: 'en' | 'bn';
  onNavigate: (view: string) => void;
  settings: AppSettings;
}

export default function DashboardView({ clients, tasks, transactions, services, language, onNavigate, settings }: DashboardViewProps) {
  const currencySymbol = settings.currency === 'BDT' ? '৳' : '$';

  // Calculations
  const totalInvoiced = clients.reduce((acc, c) => acc + c.totalBudget, 0);
  const totalPaid = clients.reduce((acc, c) => acc + c.paidAmount, 0);
  const totalDue = clients.reduce((acc, c) => acc + c.dueAmount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'Expense').reduce((acc, t) => acc + t.amount, 0);
  const netEarnings = totalPaid - totalExpenses;

  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
  const submittedTasks = tasks.filter(t => t.status === 'Submitted').length;

  const activeClients = clients.filter(c => c.status === 'Active').length;

  // Language Mapping
  const text = {
    en: {
      stats: 'Company Financial Overview',
      totalInvoiced: 'Total Invoiced Value',
      totalCollected: 'Revenue Collected',
      totalDue: 'Outstanding Dues',
      netProfit: 'Current Net Cash Balance',
      activeProjects: 'Active Projects',
      completedTasks: 'Completed Tasks',
      teamLoad: 'Operational Workflow',
      dueWarning: 'Urgent Dues Alerts',
      financials: 'Recent Transaction Ledger',
      recentTasks: 'Key Active Tasks',
      submitReview: 'Tasks Pending Approval',
      noIssues: 'All clients are in good financial standing!',
      dueDate: 'Due Date',
      priority: 'Priority',
      status: 'Status',
      type: 'Type',
      amount: settings.currency === 'BDT' ? 'Amount (৳)' : 'Amount ($)',
      date: 'Date',
      description: 'Description',
      assignedTo: 'Assigned To',
    },
    bn: {
      stats: 'কোম্পানির আর্থিক পর্যালোচনা',
      totalInvoiced: 'মোট ইনভয়েসকৃত বাজেট',
      totalCollected: 'সংগৃহীত পেমেন্ট',
      totalDue: 'বকেয়া পাওনা (Due)',
      netProfit: 'বর্তমান নেট ক্যাশ ব্যালেন্স',
      activeProjects: 'চলতি প্রজেক্টসমূহ',
      completedTasks: 'সম্পন্ন কাজের সংখ্যা',
      teamLoad: 'অপারেশনাল প্রগ্রেস',
      dueWarning: 'জরুরি বকেয়া সতর্কতা',
      financials: 'সাম্প্রতিক লেনদেন খতিয়ান',
      recentTasks: 'গুরুত্বপূর্ণ চলতি কাজ',
      submitReview: 'অনুমোদনের জন্য জমা দেওয়া কাজ',
      noIssues: 'সব ক্লায়েন্টের পেমেন্ট রেকর্ড ঠিক আছে!',
      dueDate: 'জমা দেওয়ার তারিখ',
      priority: 'অগ্রাধিকার',
      status: 'অবস্থা',
      type: 'ধরণ',
      amount: settings.currency === 'BDT' ? 'টাকা (৳)' : 'টাকা / ডলার',
      date: 'তারিখ',
      description: 'বিবরণ',
      assignedTo: 'দায়িত্বপ্রাপ্ত',
    }
  }[language];

  // Outstanding alert clients
  const dueAlertClients = clients.filter(c => c.dueAmount > 0);

  return (
    <div className="space-y-6">
      {/* Page Title & Context */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-5 gap-3">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {language === 'en' ? `Executive Dashboard - ${settings.agencyName}` : `কোম্পানি পরিচালনা ড্যাশবোর্ড - ${settings.agencyName}`}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {language === 'en' ? `Manage ${settings.agencyName} contracts, payments, team assignments, and meetings.` : `আপনার আইটি এজেন্সি (${settings.agencyName}) এর যাবতীয় প্রজেক্ট, টিমওয়ার্ক, পেমেন্ট ও ইনভয়েসের হিসাব রাখুন।`}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 p-1 px-3 py-1.5 rounded-xl border border-white/10">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-xs text-slate-300 select-none">
            {language === 'en' ? 'Portal Active' : 'পোর্টাল সচল'}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mt-2">{text.stats}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Invoiced */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-lg flex items-center justify-between transition hover:bg-white/10 hover:border-white/25">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400">{text.totalInvoiced}</span>
            <div className="text-2xl font-black text-white font-mono">{currencySymbol}{totalInvoiced.toLocaleString()}</div>
          </div>
          <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <FileText className="h-6 w-6" />
          </div>
        </div>

        {/* Collected Revenue */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-lg flex items-center justify-between transition hover:bg-white/10 hover:border-white/25">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400">{text.totalCollected}</span>
            <div className="text-2xl font-black text-emerald-400 font-mono">{currencySymbol}{totalPaid.toLocaleString()}</div>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>

        {/* Dues */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-lg flex items-center justify-between transition hover:bg-white/10 hover:border-white/25">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400">{text.totalDue}</span>
            <div className={`text-2xl font-black font-mono ${totalDue > 0 ? 'text-amber-400' : 'text-slate-350'}`}>
              {currencySymbol}{totalDue.toLocaleString()}
            </div>
          </div>
          <div className={`h-12 w-12 rounded-xl border flex items-center justify-center ${totalDue > 0 ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-white/5 border-white/5 text-slate-400'}`}>
            <AlertTriangle className="h-6 w-6" />
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-lg flex items-center justify-between transition hover:bg-white/10 hover:border-white/25">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400">{text.netProfit}</span>
            <div className="text-2xl font-black text-blue-400 font-mono">{currencySymbol}{netEarnings.toLocaleString()}</div>
          </div>
          <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Grid Layout splits operational stats from logging */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* left column: operational status, logs, reviews */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Operations performance cards */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl">
            <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              {text.teamLoad}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                <span className="text-2xl font-black font-mono text-white">{activeClients}</span>
                <p className="text-xs text-slate-400 mt-1">{language === 'en' ? 'Active Projects' : 'চলতি প্রজেক্টসমূহ'}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                <span className="text-2xl font-black font-mono text-yellow-400">{inProgressTasks}</span>
                <p className="text-xs text-slate-400 mt-1">{language === 'en' ? 'In Progress' : 'চলতি কাজসমূহ'}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                <span className="text-2xl font-black font-mono text-indigo-400">{pendingTasks}</span>
                <p className="text-xs text-slate-400 mt-1">{language === 'en' ? 'Pending Assigns' : 'অপেক্ষমান কাজসমূহ'}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                <span className="text-2xl font-black font-mono text-emerald-400">{completedTasks}</span>
                <p className="text-xs text-slate-400 mt-1">{language === 'en' ? 'Completed Work' : 'সম্পন্ন কাজের সংখ্যা'}</p>
              </div>
            </div>

            {/* Micro progress bars */}
            <div className="space-y-2 mt-5">
              <div className="flex justify-between text-xs text-slate-350">
                <span>{language === 'en' ? 'Deliveries Project Completion Benchmark' : 'সামগ্রিক প্রজেক্টের কাজের অগ্রগতি'}</span>
                <span className="font-mono font-bold text-white">
                  {tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Submitted Tasks awaiting approval panel */}
          {submittedTasks > 0 && (
            <div className="bg-amber-500/5 border border-amber-500/15 rounded-3xl p-5 shadow-lg">
              <h4 className="text-sm font-bold text-amber-300 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-400" />
                {text.submitReview} ({submittedTasks})
              </h4>
              <div className="space-y-3">
                {tasks.filter(t => t.status === 'Submitted').map(task => (
                  <div key={task.id} className="bg-white/5 p-4 rounded-2xl border border-white/10 flex justify-between items-start gap-4">
                    <div>
                      <h5 className="font-semibold text-white text-sm">{task.title}</h5>
                      <p className="text-xs text-slate-300 mt-1">{task.description}</p>
                      {task.submissionNote && (
                        <div className="text-xs bg-amber-500/10 border border-amber-500/15 px-2.5 py-1.5 rounded-lg text-amber-300 font-mono mt-2">
                          <strong>Note:</strong> "{task.submissionNote}"
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => onNavigate('tasks')}
                      className="text-xs bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/25 text-amber-200 font-bold py-1.5 px-3 rounded-md transition shrink-0"
                    >
                      {language === 'en' ? 'Evaluate' : 'মূল্যায়ন করুন'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dynamic Transaction Logs */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2 font-sans">
                <Layers className="h-4 w-4 text-slate-400" />
                {text.financials}
              </h4>
              <button 
                onClick={() => onNavigate('accounting')}
                className="text-xs text-indigo-450 hover:text-indigo-350 transition-colors font-bold font-sans"
              >
                {language === 'en' ? 'Advanced Accounts' : 'উন্নত হিসাবখাতা'}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-350">
                <thead>
                  <tr className="bg-white/5 text-slate-300 font-bold border-b border-white/10">
                    <th className="p-3 rounded-l-xl">{text.description}</th>
                    <th className="p-3">{text.type}</th>
                    <th className="p-3">{text.date}</th>
                    <th className="p-3 text-right rounded-r-xl">{text.amount}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {transactions.slice(0, 5).map((trans) => (
                    <tr key={trans.id} className="hover:bg-white/5 transition-all text-slate-200">
                      <td className="p-3 font-semibold text-white">
                        {trans.description}
                        <span className="block text-[10px] text-slate-400 mt-0.5 font-mono">{trans.category}</span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono border ${trans.type === 'Income' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-455 border-rose-500/20'}`}>
                          {trans.type === 'Income' ? (language === 'en' ? 'Income' : 'আয়') : (language === 'en' ? 'Expense' : 'ব্যয়')}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-400">{trans.date}</td>
                      <td className={`p-3 text-right font-bold font-mono ${trans.type === 'Income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {trans.type === 'Income' ? '+' : '-'}{currencySymbol}{trans.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* right column: alerts, pricing configurations */}
        <div className="space-y-6">
          
          {/* Urgent dues notification boxes */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 shadow-xl">
            <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              {text.dueWarning}
            </h4>
            
            {dueAlertClients.length === 0 ? (
              <p className="text-xs text-slate-450 italic text-center py-4">{text.noIssues}</p>
            ) : (
              <div className="space-y-3">
                {dueAlertClients.slice(0, 4).map(c => (
                  <div key={c.id} className="border-l-4 border-amber-500 bg-white/5 border border-white/5 p-4 rounded-r-2xl text-xs space-y-1.5">
                    <div className="flex justify-between font-semibold text-white">
                      <span>{c.companyName}</span>
                      <span className="font-mono text-amber-400 font-bold">{currencySymbol}{c.dueAmount.toLocaleString()}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] font-mono leading-relaxed">
                      {language === 'en' ? `Contact: ${c.name}` : `যোগাযোগকারী: ${c.name}`} • {c.phone}
                    </p>
                    <div className="flex justify-end gap-1.5 pt-1">
                      <button 
                        onClick={() => onNavigate('clients')}
                        className="text-[10px] bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/20 text-amber-200 font-bold px-2 py-0.5 rounded transition"
                      >
                        {language === 'en' ? 'Manage CRM' : 'সিআরএম পরিচালনা'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick interactive high grade packages offering */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 shadow-xl">
            <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Layers className="h-4 w-4 text-slate-400" />
              {language === 'en' ? 'Corporate IT Offerings' : 'আমাদের সক্রিয় কর্পোরেট প্যাকেজ'}
            </h4>
            <div className="space-y-3">
              {services.slice(0, 4).map(sv => (
                <div key={sv.id} className="bg-white/5 border border-white/5 rounded-2xl p-4 hover:bg-white/10 hover:border-white/15 transition-all">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">{sv.name}</span>
                    <span className="font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/25 px-2 py-0.5 rounded-lg font-bold">
                      {currencySymbol}{sv.basePrice.toLocaleString()}+
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{sv.description}</p>
                </div>
              ))}
            </div>
            <button 
              onClick={() => onNavigate('services')}
              className="w-full text-center text-xs bg-white/10 hover:bg-white/15 border border-white/10 py-3 rounded-xl font-bold text-slate-200 mt-4 transition cursor-pointer"
            >
              {language === 'en' ? 'Configure Packages' : 'প্যাকেজসমূহ কনফিগার করুন'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
