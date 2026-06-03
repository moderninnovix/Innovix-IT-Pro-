import React, { useState } from 'react';
import { Client, Task, Transaction, ChatMessage, TeamMember, AppSettings } from '../types';
import FileUploader, { AttachmentPreview } from './FileUploader';
import { 
  Building, 
  DollarSign, 
  CheckCircle, 
  Send, 
  Printer, 
  Mail, 
  User, 
  Clock, 
  TrendingUp, 
  Receipt, 
  Check, 
  X, 
  AlertCircle, 
  Sparkles,
  MessageSquare,
  FileText,
  Paperclip,
  Plus
} from 'lucide-react';

interface ClientDashboardProps {
  client: Client;
  tasks: Task[];
  transactions: Transaction[];
  chats: ChatMessage[];
  team: TeamMember[];
  settings: AppSettings;
  language: 'en' | 'bn';
  onRecordSimulatedPayment: (clientId: string, amount: number, note: string) => void;
  onSendChatMessage: (receiverId: string, message: string, attachments?: { name: string; url: string; type: string }[]) => void;
  onAddTask?: (taskData: Omit<Task, 'id' | 'createdAt'>) => void;
}

export default function ClientDashboard({
  client,
  tasks,
  transactions,
  chats,
  team,
  settings,
  language,
  onRecordSimulatedPayment,
  onSendChatMessage,
  onAddTask
}: ClientDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'project' | 'invoice' | 'chats'>('project');
  const [selectedChannelId, setSelectedChannelId] = useState<'admin' | string>('admin'); // 'admin' or team member ID
  const [typedMessage, setTypedMessage] = useState('');

  // New Project Requirement Form states
  const [showAddRequirementForm, setShowAddRequirementForm] = useState(false);
  const [requirementTitle, setRequirementTitle] = useState('');
  const [requirementDesc, setRequirementDesc] = useState('');
  const [requirementPriority, setRequirementPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [requirementFiles, setRequirementFiles] = useState<{ name: string; url: string; type: string }[]>([]);
  const [requirementSuccess, setRequirementSuccess] = useState(false);

  // Chat attachments states
  const [showChatAttachments, setShowChatAttachments] = useState(false);
  const [chatAttachedFiles, setChatAttachedFiles] = useState<{ name: string; url: string; type: string }[]>([]);
  
  // Simulated payment state
  const [paymentAmount, setPaymentAmount] = useState(1500);
  const [paymentNote, setPaymentNote] = useState('Aggregated project milestone completion payment');
  const [payingState, setPayingState] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Email state simulation
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);

  // Invoice variables & parameters
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2026-662');
  const [invoiceDate, setInvoiceDate] = useState('2026-06-02');

  const currencySymbol = settings.currency === 'BDT' ? '৳' : '$';

  // Filters relative to this client
  const myTasks = tasks.filter(t => t.description.toLowerCase().includes(client.companyName.toLowerCase()) || t.title.toLowerCase().includes(client.companyName.toLowerCase()) || t.title.toLowerCase().includes(client.projectName.toLowerCase()) || t.id === 'tk1'); // mapped manually/heuristically
  const myTransactions = transactions.filter(t => t.clientId === client.id);
  
  // Filter chats belonging to this Client Thread
  const myChats = chats.filter(c => 
    (c.senderId === client.id && c.receiverId === selectedChannelId) || 
    (c.senderId === selectedChannelId && c.receiverId === client.id)
  );

  const text = {
    myProject: language === 'en' ? 'My Contract Deliverables' : 'আমার প্রজেক্ট ও কন্টাক্ট ডিটেইলস',
    billingInvoices: language === 'en' ? 'Invoices & Ledger' : 'বিলিং রশিদ ও বিবরণ',
    chatsInbox: language === 'en' ? 'Collaboration Board' : 'টিম চ্যাট ও সাপোর্ট বক্স',
    clientBanner: language === 'en' ? 'Client Workspace' : 'ক্লায়েন্ট পোর্টাল',
    companyNameText: language === 'en' ? 'Registered Name: ' : 'কোম্পানি নাম: ',
    projectHead: language === 'en' ? 'Assigned Core Project: ' : 'সক্রিয় প্রকল্প: ',
    budgetCard: language === 'en' ? 'Agreed Budget' : 'অনুমোদিত প্রজেক্ট বাজেট',
    paidCard: language === 'en' ? 'Total Settled / Paid' : 'মোট পরিশোধিত পেমেন্ট',
    dueCard: language === 'en' ? 'Net Outstanding Due' : 'বকেয়া পাওনা হিসাব',
    noTransactionsYet: language === 'en' ? 'No transactions recorded on this client account.' : 'এই অ্যাকাউন্টে কোনো পরিশোধিত ট্রানজেকশন ডাটা পাওয়া যায়নি।',
    payDummyMilestone: language === 'en' ? 'Make Milestone Payment' : 'অনলাইন পেমেন্ট করুন (সিমুলেটর)',
    payAmountLabel: language === 'en' ? 'Select Payment Installment Amount:' : 'ইনস্টলমেন্ট পেমেন্টের পরিমাণ:',
    payBtnLabel: language === 'en' ? 'Authorize Secure BKash / Bank Inflow' : 'পেমেন্ট অনুমোদন করুন (SSL Gateway)',
    paySuccessLabel: language === 'en' ? 'Simulated payment processed! Recorded in corporate bank DBBL balance.' : 'টাকা সফলভাবে কোম্পানি ব্যাংক অ্যাকাউন্টে জমা হয়েছে!',
    invoiceBuilder: language === 'en' ? 'Interactive Billing Invoice Widget' : 'রশিদ ইনভয়েস প্রিভিউ ও কন্ট্রোল',
    invNoLabel: language === 'en' ? 'Invoice Serial:' : 'ইনভয়েস নং:',
    invDateLabel: language === 'en' ? 'Billing Date:' : 'ইনভয়েস তারিখ:',
    invPrintBtn: language === 'en' ? 'Print / Download PDF Voucher' : 'ভাউচার প্রিন্ট / ডাউনলোড করুন',
    invEmailBtn: language === 'en' ? 'Send Billing Copy over Email' : 'ইমেইল রিপোর্ট পাঠান (Simulated)',
    emailSubmitted: language === 'en' ? 'Mailing trigger accepted! Billing receipt dispatched to company email.' : 'ইনভয়েস রশিদ গ্রাহকের ইমেইলে সফলভাবে পাঠানো হয়েছে!',
    chatSupportHeader: language === 'en' ? 'Interactive Dev Team Support' : 'বার্তা আদান-প্রদান (অ্যাডমিন ও টিম মেম্বার)',
    supportTeamLabel: language === 'en' ? 'Choose Support Agent' : 'সহায়তাকারী নির্বাচন করুন',
    supportAdminText: language === 'en' ? 'Zakir Hasan (Lead Director)' : 'জাকির হাসান (অ্যাডমিন ডিরেক্টর)',
    supportPmText: language === 'en' ? 'Tasnim Jahan (Project Manager)' : 'তাসনিম জাহান (প্রজেক্ট ম্যানেজার)',
    supportDevText: language === 'en' ? 'Tanvir Hossain (React Developer)' : 'তানভির হোসাইন (ডেভেলপার)',
    typeMessagePlaceholder: language === 'en' ? 'Write message to team... (Press Enter to send)' : 'এখানে আপনার বার্তা লিখুন... (পাঠাতে এন্টার চাপুন)',
    backToDashboard: language === 'en' ? 'Return' : 'ফিরে যান',
    invoiceTitle: language === 'en' ? 'INVOICE RECEIPT' : 'ইনভয়েস রশিদ ভাউচার',
    certifiedVoucher: language === 'en' ? 'Verified BizFlow ERP Cloud Transaction Voucher' : 'BizFlow ERP ক্লাউড গেটওয়ে দ্বারা সার্টিফাইড ভাউচার',
  };

  const handleMakeSimulatedPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentAmount <= 0) return;
    setPayingState(true);

    setTimeout(() => {
      onRecordSimulatedPayment(
        client.id, 
        paymentAmount, 
        paymentNote || 'Milestone Settlement Payment from Client Dashboard'
      );
      setPayingState(false);
      setPaymentSuccess(true);
      setTimeout(() => setPaymentSuccess(false), 4000);
    }, 1200);
  };

  const handleTriggerEmailSim = () => {
    setSendingEmail(true);
    setTimeout(() => {
      setSendingEmail(false);
      setEmailSuccess(true);
      setTimeout(() => setEmailSuccess(false), 4000);
    }, 1500);
  };

  const handleSendMessage = () => {
    if (!typedMessage.trim() && chatAttachedFiles.length === 0) return;
    onSendChatMessage(selectedChannelId, typedMessage, chatAttachedFiles);
    setTypedMessage('');
    setChatAttachedFiles([]);
    setShowChatAttachments(false);
  };

  const handleAddRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requirementTitle.trim() || !requirementDesc.trim()) return;

    if (onAddTask) {
      onAddTask({
        title: `[Client Request] ${requirementTitle}`,
        description: `Description:\n${requirementDesc}\n\nClient Contact: ${client.name} (${client.companyName})`,
        assignedToId: 'tm1', // Assign to Project Manager by default/heuristics
        priority: requirementPriority,
        status: 'Pending',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 7 days from now
        attachments: requirementFiles
      });

      setRequirementTitle('');
      setRequirementDesc('');
      setRequirementPriority('Medium');
      setRequirementFiles([]);
      setRequirementSuccess(true);
      setTimeout(() => setRequirementSuccess(false), 4000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in text-xs text-slate-100 print:bg-white print:text-black">
      
      {/* Brand Header Portal banner card */}
      <div className="bg-gradient-to-r from-emerald-950/45 via-slate-900/50 to-blue-900/25 p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden print:hidden">
        <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[150%] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-14 h-14 bg-gradient-to-tr from-emerald-505 via-teal-500 to-indigo-505 rounded-2xl flex items-center justify-center font-black text-white shadow-lg shrink-0 text-xl">
            {client.companyName ? client.companyName.substring(0, 2).toUpperCase() : 'CL'}
          </div>
          <div className="space-y-1">
            <span className="bg-emerald-500/10 border border-emerald-550/15 text-emerald-400 font-bold px-2.5 py-1 rounded-lg text-[9px] uppercase tracking-wider font-mono">
              {text.clientBanner}
            </span>
            <h2 className="text-xl font-black text-white font-display tracking-tight mt-1.5 flex items-center gap-2">
              <span>{client.name}</span>
            </h2>
            <div className="text-[10px] text-slate-400 space-y-0.5">
              <p><strong className="text-slate-350">{text.companyNameText}</strong>{client.companyName}</p>
              <p><strong className="text-slate-350">{text.projectHead}</strong><span className="text-emerald-300 font-semibold">{client.projectName}</span></p>
            </div>
          </div>
        </div>

        <div className="text-right font-mono space-y-1 shrink-0 relative z-10">
          <span className="bg-white/5 border border-white/5 px-3 py-1.5 rounded-xl text-[10px] text-emerald-300 font-bold block">
            🔒 Account Secured
          </span>
          <span className="block text-[8px] text-slate-450 uppercase mt-1">SSL SHA-256 Registered Link</span>
        </div>
      </div>

      {/* CRM Budget balances ledgers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:hidden">
        {/* Total contract budget */}
        <div className="bg-[#111625]/95 border border-white/5 p-5 rounded-2xl relative overflow-hidden">
          <div className="absolute top-1 right-2"><DollarSign className="h-4.5 w-4.5 text-indigo-400 opacity-20" /></div>
          <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider font-mono">{text.budgetCard}</span>
          <p className="text-2xl font-black text-white mt-1 font-mono">{currencySymbol}{client.totalBudget.toLocaleString()}</p>
          <span className="text-[8px] text-slate-450 block font-mono">Total scope deliverables cost</span>
        </div>

        {/* Total payment settled */}
        <div className="bg-[#111625]/95 border border-white/5 p-5 rounded-2xl relative overflow-hidden">
          <div className="absolute top-1 right-2"><CheckCircle className="h-4.5 w-4.5 text-emerald-400 opacity-20" /></div>
          <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider font-mono">{text.paidCard}</span>
          <p className="text-2xl font-black text-emerald-400 mt-1 font-mono">{currencySymbol}{client.paidAmount.toLocaleString()}</p>
          <span className="text-[8px] text-slate-450 block font-mono">Cleared milestones value</span>
        </div>

        {/* Amount Outstanding Due */}
        <div className={`border p-5 rounded-2xl relative overflow-hidden transition ${
          client.dueAmount > 0 
            ? 'bg-[#1e1b1a]/40 border-amber-500/20' 
            : 'bg-[#111625]/95 border-white/5'
        }`}>
          <div className="absolute top-1 right-2"><AlertCircle className="h-4.5 w-4.5 text-amber-400 opacity-20" /></div>
          <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider font-mono">{text.dueCard}</span>
          <p className={`text-2xl font-black mt-1 font-mono ${client.dueAmount > 0 ? 'text-amber-405' : 'text-slate-400'}`}>
            {currencySymbol}{client.dueAmount.toLocaleString()}
          </p>
          <span className="text-[8px] text-slate-450 block font-mono">Invoiced outstanding liability</span>
        </div>
      </div>

      {/* Workspace subtabs controllers */}
      <div className="flex bg-slate-900/60 p-1 rounded-xl border border-white/5 max-w-lg print:hidden">
        <button
          onClick={() => setActiveSubTab('project')}
          className={`flex-1 py-2 rounded-lg font-bold text-center text-xs cursor-pointer transition ${
            activeSubTab === 'project' ? 'bg-white/10 text-white border border-white/10 shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          {text.myProject}
        </button>
        <button
          onClick={() => setActiveSubTab('invoice')}
          className={`flex-1 py-2 rounded-lg font-bold text-center text-xs cursor-pointer transition ${
            activeSubTab === 'invoice' ? 'bg-white/10 text-white border border-white/10 shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          {text.billingInvoices}
        </button>
        <button
          onClick={() => setActiveSubTab('chats')}
          className={`flex-1 py-2 rounded-lg font-bold text-center text-xs cursor-pointer transition ${
            activeSubTab === 'chats' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-550/20 shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          {text.chatsInbox}
        </button>
      </div>

      {/* SUBTAB 1: Project contract details & Ledger flow */}
      {activeSubTab === 'project' && (
        <div className="space-y-6 print:hidden animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Milestone transactions journal */}
          <div className="md:col-span-2 bg-[#111625]/90 border border-white/10 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-black font-display text-white tracking-tight flex items-center gap-2">
              <Receipt className="h-4.5 w-4.5 text-blue-400" />
              <span>Paid Invoices Transaction Ledger</span>
            </h3>

            <div className="space-y-3">
              {myTransactions.length === 0 ? (
                <div className="p-8 text-center text-slate-500 font-mono italic bg-black/10 rounded-xl border border-white/5">
                  {text.noTransactionsYet}
                </div>
              ) : (
                myTransactions.map(tx => (
                  <div key={tx.id} className="bg-white/2 border border-white/5 p-3.5 rounded-xl flex justify-between items-center hover:bg-white/4 transition font-mono text-[11px]">
                    <div className="space-y-1">
                      <span className="block font-bold text-slate-205">{tx.category}</span>
                      <span className="block text-[9.5px] text-slate-450">{tx.description}</span>
                    </div>
                    <div className="text-right space-y-1">
                      <span className="block text-emerald-400 font-bold">{currencySymbol}{tx.amount.toLocaleString()}</span>
                      <span className="block text-[9px] text-slate-450">{tx.date}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Interactive Simulated payment installment console (গত পেমেন্ট ডিউ আছে) */}
          <div className="bg-[#111625]/90 border border-white/10 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-300 tracking-tight flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5 text-indigo-400 animate-pulse" />
              <span>{text.payDummyMilestone}</span>
            </h3>

            {client.dueAmount <= 0 ? (
              <div className="bg-emerald-500/10 border border-emerald-500/15 p-4 rounded-xl text-center text-emerald-405 font-bold space-y-2">
                <CheckCircle className="h-6 w-6 text-emerald-400 mx-auto" />
                <p>Wow! Account Fully Cleared!</p>
                <p className="text-[9.5px] font-mono text-slate-400 font-normal">All agreed invoice milestones settled on ledger database.</p>
              </div>
            ) : (
              <form onSubmit={handleMakeSimulatedPayment} className="space-y-4">
                
                {paymentSuccess && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold rounded-xl text-center font-mono animate-pulse">
                    {text.paySuccessLabel}
                  </div>
                )}

                <div>
                  <label className="block text-slate-350 font-bold mb-1.5">{text.payAmountLabel}</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-slate-400 font-bold font-mono text-xs">{currencySymbol}</span>
                    <input
                      type="number"
                      max={client.dueAmount}
                      min={100}
                      required
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(parseInt(e.target.value) || 0)}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl p-3 pl-7 outline-none focus:border-indigo-400 text-xs font-mono"
                    />
                  </div>
                  <span className="text-[9.5px] text-slate-450 font-mono block mt-1.5">Maximum payment payable: <strong className="text-white">{currencySymbol}{client.dueAmount.toLocaleString()}</strong></span>
                </div>

                <div>
                  <label className="block text-slate-350 font-bold mb-1.5">Payment memo reference:</label>
                  <input
                    type="text"
                    value={paymentNote}
                    onChange={(e) => setPaymentNote(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-white outline-none focus:border-indigo-400 text-[10px] font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={payingState}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-650 hover:from-emerald-650 hover:to-teal-700 text-white font-bold py-3 px-4 rounded-xl cursor-pointer transition shadow-md shadow-emerald-500/10 font-sans tracking-wide text-[10.5px] uppercase"
                >
                  {payingState ? 'Processing SSL Gateway Securing...' : text.payBtnLabel}
                </button>
              </form>
            )}
          </div>

          </div>

          {/* Client custom requirements submission, tasks list & logs */}
          <div className="bg-[#111625]/90 border border-white/10 rounded-2xl p-5 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-3">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <FileText className="h-4.5 w-4.5 text-indigo-400" />
                  <span>{language === 'en' ? 'Project Requirements & Features Map' : 'প্রজেক্ট রিকোয়ারমেন্ট ও কাজের তালিকা'}</span>
                </h3>
                <p className="text-[9.5px] text-slate-400 font-mono mt-1">Review active development features or request new technical requirements directly.</p>
              </div>

              <button
                onClick={() => setShowAddRequirementForm(!showAddRequirementForm)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-[10px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition self-start cursor-pointer shadow-md"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{showAddRequirementForm ? (language === 'en' ? 'View Tasks List' : 'তালিকা দেখুন') : (language === 'en' ? 'Add New Requirement' : 'নতুন রিকোয়ারমেন্ট যোগ করুন')}</span>
              </button>
            </div>

            {showAddRequirementForm ? (
              // Create requirement form
              <form onSubmit={handleAddRequirement} className="space-y-4 max-w-xl animate-fade-in text-[11px]">
                <div className="bg-indigo-950/10 border border-indigo-500/20 p-4 rounded-xl space-y-2">
                  <span className="text-[10px] font-black font-mono text-indigo-300 uppercase tracking-wider block">Submit Custom Change / New Feature Request</span>
                  <p className="text-slate-400 text-[9.5px] font-sans leading-relaxed">Describe any structural changes, screen additions, design specifications, or requirements. Our Lead Architect will audit the request and schedule updates immediately on active prints.</p>
                </div>

                {requirementSuccess && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-center font-bold">
                    {language === 'en' ? 'Requirement request submitted! Your Manager was notified and assigned to review files.' : 'নতুন কাজের রিকোয়ারমেন্ট তালিকাভুক্ত হয়েছে! প্রজেক্ট টিমকে জানানো হয়েছে।'}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-350 font-mono font-bold mb-1">Requirement Title / Feature Name:</label>
                    <input
                      type="text"
                      required
                      value={requirementTitle}
                      onChange={(e) => setRequirementTitle(e.target.value)}
                      placeholder="e.g. Integration of Razorpay international gateway"
                      className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-white outline-none focus:border-indigo-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-350 font-mono font-bold mb-1">Priority Metric:</label>
                    <select
                      value={requirementPriority}
                      onChange={(e: any) => setRequirementPriority(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 p-2.5 rounded-xl text-slate-200 outline-none focus:border-indigo-400 font-mono"
                    >
                      <option value="Low">Low (Scheduled)</option>
                      <option value="Medium">Medium (Regular)</option>
                      <option value="High">High (Hotfix Crit)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-350 font-mono font-bold mb-1">Details & Core Specifications:</label>
                  <textarea
                    rows={4}
                    required
                    value={requirementDesc}
                    onChange={(e) => setRequirementDesc(e.target.value)}
                    placeholder="Provide specific guidelines, links to templates, screen fields needed, or instructions..."
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-indigo-400 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-slate-355 font-mono font-bold mb-1.5 font-bold">
                    {language === 'en' ? 'Attach flowcharts, mockups, or documents:' : 'ডিজাইন মকআপ, ডকুমেন্ট বা ফ্লোচার্ট সংযুক্ত করুন:'}
                  </label>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <FileUploader 
                      onFilesChange={setRequirementFiles} 
                      language={language} 
                      multiple={true} 
                      accept="image/*,application/*" 
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-bold px-5 py-2.5 rounded-xl transition cursor-pointer shadow-md"
                  >
                    {language === 'en' ? 'Submit Technical Requirement' : 'রিকোয়ারমেন্ট দাখিল করুন'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddRequirementForm(false);
                      setRequirementFiles([]);
                    }}
                    className="bg-white/5 hover:bg-[#1f293d]/50 text-slate-300 font-sans font-bold px-4 py-2.5 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              // Requirements / Tasks table list
              <div className="overflow-x-auto text-[11px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 font-bold font-mono text-[9px] uppercase tracking-wider">
                      <th className="p-3">Requirement/Task</th>
                      <th className="p-3">Assigned Agent</th>
                      <th className="p-3">Timeline</th>
                      <th className="p-3">Priority</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    {myTasks.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-500 font-mono italic">
                          No active requirements or development deliverables found.
                        </td>
                      </tr>
                    ) : (
                      myTasks.map(task => {
                        const pmOrDev = team.find(t => t.id === task.assignedToId) || team[0];
                        return (
                          <tr key={task.id} className="hover:bg-white/2 transition font-mono">
                            <td className="p-3 max-w-sm">
                              <span className="font-bold text-slate-205 block text-xs">{task.title}</span>
                              <span className="text-slate-450 block mt-1 leading-relaxed text-[10.5px] sm:max-w-md whitespace-pre-wrap">{task.description}</span>
                              
                              {task.submissionNote && (
                                <div className="mt-2 bg-emerald-500/5 border border-emerald-500/10 p-2 rounded-lg text-[10px]">
                                  <strong className="text-emerald-400">{language === 'en' ? 'Manager Delivery Note:' : 'ডেলিভারি নোট:'}</strong> {task.submissionNote}
                                </div>
                              )}

                              {task.attachments && task.attachments.length > 0 && (
                                <div className="mt-2">
                                  <span className="block text-[8px] text-indigo-300 font-bold uppercase tracking-widest mb-1">Uploaded Deliverables:</span>
                                  <AttachmentPreview attachments={task.attachments} language={language} />
                                </div>
                              )}
                            </td>
                            <td className="p-3 text-slate-350">
                              <span className="font-bold block text-slate-205">{pmOrDev.name}</span>
                              <span className="text-[9px] text-slate-500 uppercase">{pmOrDev.role}</span>
                            </td>
                            <td className="p-3 text-slate-350 text-[10.5px] font-mono">{task.dueDate}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[8.5px] font-bold tracking-widest uppercase ${
                                task.priority === 'High' ? 'bg-rose-500/10 text-rose-350 border border-rose-500/20' :
                                task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' :
                                'bg-slate-500/10 text-slate-350 border border-slate-500/20'
                              }`}>
                                {task.priority}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold ${
                                task.status === 'Completed' ? 'bg-emerald-500/15 text-emerald-400' :
                                task.status === 'Submitted' ? 'bg-blue-500/15 text-blue-400' :
                                task.status === 'In Progress' ? 'bg-amber-550/15 text-amber-400' :
                                'bg-slate-500/15 text-slate-400'
                              }`}>
                                {task.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 2: Printable invoice config & sheet (ইনভয়েস ডাউনলোড ও ইমেইল পাঠাতে হবে) */}
      {activeSubTab === 'invoice' && (
        <div className="space-y-6">
          {/* Top action controller toolbar in web view */}
          <div className="bg-[#111625]/90 border border-white/10 rounded-2xl p-4 flex flex-wrap gap-4 items-center justify-between print:hidden">
            <div className="flex gap-4 items-center">
              <div>
                <label className="block text-[9.5px] text-slate-400 uppercase font-black tracking-wider font-mono mb-1">{text.invNoLabel}</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="bg-white/5 border border-white/10 px-2.5 py-1 text-slate-200 rounded font-mono text-[10.5px] outline-none"
                />
              </div>
              <div>
                <label className="block text-[9.5px] text-slate-400 uppercase font-black tracking-wider font-mono mb-1">{text.invDateLabel}</label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="bg-white/5 border border-white/10 px-2.5 py-1 text-slate-200 rounded font-mono text-[10.5px] outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="bg-indigo-650 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer text-[10.5px]"
              >
                <Printer className="h-4 w-4" />
                <span>{text.invPrintBtn}</span>
              </button>
              <button
                onClick={handleTriggerEmailSim}
                disabled={sendingEmail}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer text-[10.5px]"
              >
                <Mail className="h-4 w-4" />
                <span>{sendingEmail ? 'Connecting SMTP...' : text.invEmailBtn}</span>
              </button>
            </div>
          </div>

          {emailSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 font-bold rounded-xl text-center font-mono animate-bounce max-w-md mx-auto print:hidden">
              {text.emailSubmitted}
            </div>
          )}

          {/* Actual invoice sheet printable page */}
          <div className="bg-white text-slate-900 border border-slate-200 p-8 rounded-3xl max-w-3xl mx-auto space-y-6 shadow-2xl print:border-none print:shadow-none print:p-4 print:mx-0 print:rounded-none">
            {/* Invoice Top Header */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl font-black text-slate-950 uppercase font-display tracking-tight">{settings.agencyName}</h1>
                <p className="text-[10px] text-slate-550 mt-1 whitespace-pre-wrap leading-relaxed">
                  {settings.address}<br />
                  Email: {settings.email}<br />
                  Phone: {settings.phone}
                </p>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-black text-slate-800 font-mono uppercase tracking-widest">{text.invoiceTitle}</h2>
                <p className="text-[10.5px] text-slate-600 font-mono mt-1 leading-relaxed">
                  <strong>Invoice No:</strong> {invoiceNumber}<br />
                  <strong>Date:</strong> {invoiceDate}
                </p>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Invoiced Parties card grids */}
            <div className="grid grid-cols-2 gap-6 text-[10px] text-slate-700">
              <div>
                <h5 className="font-bold text-slate-400 uppercase tracking-widest font-mono mb-1.5">BILLED TO:</h5>
                <p className="font-bold text-slate-900 text-sm">{client.companyName}</p>
                <p className="leading-relaxed mt-0.5">
                  Attn: {client.name}<br />
                  Email: {client.email}<br />
                  Phone: {client.phone}
                </p>
              </div>

              <div>
                <h5 className="font-bold text-slate-400 uppercase tracking-widest font-mono mb-1.5">REMITTANCE PATHWAYS:</h5>
                <p className="text-slate-600 font-mono leading-relaxed whitespace-pre-wrap bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {settings.paymentDetails || 'Direct bank deposits processed.'}
                </p>
              </div>
            </div>

            {/* Core Invoice items ledger table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden mt-4">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-550 font-bold text-[9.5px] font-mono border-b border-slate-200">
                    <th className="p-3">SCOPE / PROJECT MILESTONE ACTION</th>
                    <th className="p-3 text-right">TOTAL FLAT COST</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100 font-mono text-[11px]">
                    <td className="p-3 text-slate-705">
                      <span className="font-bold text-slate-900 block text-sm">{client.projectName}</span>
                      <span className="text-[10px] text-slate-450 block mt-0.5">{client.notes || 'IT Technical Services deliverables agreement.'}</span>
                    </td>
                    <td className="p-3 text-right font-bold text-slate-900 text-base">{currencySymbol}{client.totalBudget.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Calculations summaries */}
            <div className="flex justify-end pt-4">
              <div className="w-64 space-y-2 text-[11px] text-slate-600 font-mono">
                <div className="flex justify-between">
                  <span>Subtotal Cost:</span>
                  <span className="text-slate-900 font-bold">{currencySymbol}{client.totalBudget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Payments Cleaned:</span>
                  <span className="font-bold">-{currencySymbol}{client.paidAmount.toLocaleString()}</span>
                </div>
                <hr className="border-slate-200" />
                <div className="flex justify-between text-slate-900 font-bold text-sm bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span>Net Outstanding Balance:</span>
                  <span className="text-amber-600">{currencySymbol}{client.dueAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="text-[9.5px] text-slate-400 mt-12 text-center pt-6 border-t border-slate-100 font-mono">
              {text.certifiedVoucher} • Dhaka, Bangladesh.
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: Team developer chats support box (চ্যাট বক্স থাকবে) */}
      {activeSubTab === 'chats' && (
        <div className="bg-[#111625]/90 border border-white/10 rounded-2xl overflow-hidden flex flex-col md:flex-row h-[420px] max-w-4xl mx-auto print:hidden">
          
          {/* Chat Select Support list sidepanel */}
          <div className="w-full md:w-56 bg-slate-900/60 border-r border-white/10 flex flex-col shrink-0">
            <div className="p-3 border-b border-white/5 bg-black/20">
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest font-mono">{text.supportTeamLabel}</span>
            </div>
            
            <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
              
              {/* Channel 1: Admin */}
              <button
                onClick={() => setSelectedChannelId('admin')}
                className={`w-full text-left p-3 rounded-lg font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                  selectedChannelId === 'admin' 
                    ? 'bg-indigo-500/20 text-indigo-305 border-l-4 border-indigo-500' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
                <div className="truncate">
                  <span>{text.supportAdminText}</span>
                  <span className="block text-[8.5px] font-mono text-slate-450 truncate">Company Director</span>
                </div>
              </button>

              <div className="border-t border-white/5 my-2 pt-2 px-1 text-[9px] text-slate-500 uppercase tracking-widest font-black font-mono">
                Project Developers
              </div>

              {/* Channel 2: PM Tasnim */}
              <button
                onClick={() => setSelectedChannelId('tm2')}
                className={`w-full text-left p-3 rounded-lg font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                  selectedChannelId === 'tm2' 
                    ? 'bg-indigo-500/20 text-indigo-305 border-l-4 border-indigo-500' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="h-2 w-2 rounded-full bg-blue-400" />
                <div className="truncate">
                  <span>{text.supportPmText}</span>
                  <span className="block text-[8.5px] font-mono text-slate-450 truncate">Project Coordinator</span>
                </div>
              </button>

              {/* Channel 3: Developer Tanvir */}
              <button
                onClick={() => setSelectedChannelId('tm3')}
                className={`w-full text-left p-3 rounded-lg font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                  selectedChannelId === 'tm3' 
                    ? 'bg-indigo-500/20 text-indigo-305 border-l-4 border-indigo-500' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <div className="truncate">
                  <span>{text.supportDevText}</span>
                  <span className="block text-[8.5px] font-mono text-slate-450">Lead Node Developer</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Core Support messages list window */}
          <div className="flex-grow flex flex-col bg-black/10">
            <div className="p-3.5 border-b border-white/5 flex justify-between items-center bg-black/20">
              <div>
                <span className="text-[10px] font-mono font-bold block text-indigo-300">COLLABORATION THREAD</span>
                <span className="text-[11px] font-bold text-white block mt-0.5">
                  {selectedChannelId === 'admin' 
                    ? 'Zakir Hasan (Director Communication)' 
                    : team.find(t => t.id === selectedChannelId)?.name || 'IT Support'}
                </span>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-3">
              {myChats.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-500 italic font-mono text-center flex-col gap-1.5 py-12">
                  <MessageSquare className="h-6 w-6 text-slate-650 animate-pulse" />
                  <span>No messages in this pipeline thread yet.<br />Initiate secure communication using the portal interface below.</span>
                </div>
              ) : (
                myChats.map(message => {
                  const isMe = message.senderId === client.id;
                  return (
                    <div 
                      key={message.id} 
                      className={`flex flex-col max-w-[280px] md:max-w-md ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 text-[8.5px] text-slate-400 font-mono mb-1">
                        <span className="font-bold text-slate-350">{isMe ? 'You' : message.senderName}</span>
                        <span>•</span>
                        <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className={`p-3 rounded-2xl text-[11px] leading-relaxed font-sans whitespace-pre-wrap ${
                        isMe 
                          ? 'bg-gradient-to-tr from-blue-600 to-indigo-650 text-white rounded-tr-none shadow-md' 
                          : 'bg-white/10 text-slate-100 rounded-tl-none border border-white/5'
                      }`}>
                        <div>{message.message}</div>
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-1.5 pt-1.5 border-t border-white/5">
                            <AttachmentPreview attachments={message.attachments} language={language} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input message form controls */}
            <div className="border-t border-white/5 bg-black/25 flex flex-col p-2 space-y-2">
              {showChatAttachments && (
                <div className="bg-[#191e2b] border border-white/10 rounded-xl p-3 animate-fade-in">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[9px] font-mono uppercase text-indigo-300 font-bold">
                      {language === 'en' ? 'Select File Attachments:' : 'ফাইল বা ছবি সংযুক্ত করুন:'}
                    </span>
                    <button 
                      onClick={() => {
                        setShowChatAttachments(false);
                        setChatAttachedFiles([]);
                      }}
                      className="text-[9px] text-slate-450 hover:text-white font-mono cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                  <FileUploader 
                    onFilesChange={setChatAttachedFiles} 
                    language={language} 
                    multiple={true} 
                    accept="image/*,application/*" 
                  />
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowChatAttachments(!showChatAttachments)}
                  className={`p-3 rounded-xl cursor-pointer transition shrink-0 flex items-center justify-center border ${
                    showChatAttachments || chatAttachedFiles.length > 0
                      ? 'bg-indigo-500/20 border-indigo-500/20 text-indigo-300'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                  title="Attach file relative log"
                >
                  <Paperclip className="h-4 w-4" />
                </button>
                <input
                  type="text"
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={text.typeMessagePlaceholder}
                  className="flex-grow bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-indigo-400 text-xs font-sans"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl cursor-pointer transition shrink-0 flex items-center justify-center shadow-md shadow-indigo-600/15"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
