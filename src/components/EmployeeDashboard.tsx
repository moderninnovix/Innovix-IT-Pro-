import React, { useState } from 'react';
import { Task, TeamMember, EmployeeReport, ChatMessage, AppSettings, Client, Agreement } from '../types';
import FileUploader, { AttachmentPreview } from './FileUploader';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Send, 
  User, 
  HelpCircle, 
  Sparkles, 
  MessageSquare, 
  FileText, 
  Check, 
  TrendingUp, 
  DollarSign, 
  Backpack, 
  Phone, 
  Plus, 
  Briefcase,
  ChevronRight,
  ShieldQuestion,
  Receipt,
  Paperclip,
  ShieldCheck,
  Signature,
  Printer,
  FileCheck
} from 'lucide-react';

interface EmployeeDashboardProps {
  employee: TeamMember;
  tasks: Task[];
  reports: EmployeeReport[];
  chats: ChatMessage[];
  clients: Client[];
  settings: AppSettings;
  language: 'en' | 'bn';
  agreements?: Agreement[];
  onUpdateAgreement?: (updated: Agreement) => void;
  onUpdateTaskStatus: (taskId: string, status: 'Pending' | 'In Progress' | 'Submitted' | 'Completed', note?: string, attachments?: { name: string; url: string; type: string }[]) => void;
  onSubmitReport: (report: Omit<EmployeeReport, 'id' | 'employeeId' | 'employeeName' | 'status'>) => void;
  onSendChatMessage: (receiverId: string, message: string, attachments?: { name: string; url: string; type: string }[]) => void;
}

export default function EmployeeDashboard({
  employee,
  tasks,
  reports,
  chats,
  clients,
  settings,
  language,
  agreements = [],
  onUpdateAgreement,
  onUpdateTaskStatus,
  onSubmitReport,
  onSendChatMessage
}: EmployeeDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'tasks' | 'reports' | 'payroll' | 'chats' | 'agreements'>('tasks');
  
  // Custom contract / agreement states
  const [expandedContractId, setExpandedContractId] = useState<string | null>(null);
  const [employeeSignText, setEmployeeSignText] = useState(employee.name);
  
  // Task status submission state
  const [selectedTaskForSubmit, setSelectedTaskForSubmit] = useState<Task | null>(null);
  const [submissionNote, setSubmissionNote] = useState('');

  // Report form state
  const [reportTitle, setReportTitle] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [reportType, setReportType] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Expense Request'>('Daily');
  const [reportSuccess, setReportSuccess] = useState(false);

  // Chat panel states
  const [activeChatChannel, setActiveChatChannel] = useState<'admin' | string>('admin'); // 'admin' or client ID
  const [typedMessage, setTypedMessage] = useState('');

  // Task submission attachments state
  const [submissionFiles, setSubmissionFiles] = useState<{ name: string; url: string; type: string }[]>([]);

  // Report files attachments state
  const [reportFiles, setReportFiles] = useState<{ name: string; url: string; type: string }[]>([]);

  // Chat attachments states
  const [showChatAttachments, setShowChatAttachments] = useState(false);
  const [chatAttachedFiles, setChatAttachedFiles] = useState<{ name: string; url: string; type: string }[]>([]);

  const currencySymbol = settings.currency === 'BDT' ? '৳' : '$';

  // Filters
  const myTasks = tasks.filter(t => t.assignedToId === employee.id);
  const myReports = reports.filter(r => r.employeeId === employee.id);

  // Filter chats relevant to this employee
  // (Either sent by this employee, or received by this employee, or received by 'all')
  const myChats = chats.filter(c => 
    (c.senderId === employee.id && c.receiverId === activeChatChannel) ||
    (c.senderId === activeChatChannel && c.receiverId === employee.id)
  );

  const pendingCount = myTasks.filter(t => t.status !== 'Completed').length;
  const completedCount = myTasks.filter(t => t.status === 'Completed').length;

  // Translation text map
  const text = {
    welcome: language === 'en' ? 'Welcome Back,' : 'স্বাগতম,',
    empPortal: language === 'en' ? 'Employee Workspace' : 'টিম মেম্বার ওয়ার্কস্পেস',
    designation: language === 'en' ? 'Designation / Role: ' : 'পদবী / দায়িত্ব: ',
    joined: language === 'en' ? 'Joined On: ' : 'যোগদানের তারিখ: ',
    skills: language === 'en' ? 'Registered Skills: ' : 'নিবন্ধিত স্কিলসমূহ: ',
    myTasksTab: language === 'en' ? 'My Assigned Tasks' : 'আমার অর্পিত কাজসমূহ',
    submitReportTab: language === 'en' ? 'Activity Reports' : 'অগ্রগতি রিপোর্ট সাবমিট',
    payrollTab: language === 'en' ? 'Salary & Pay Ledger' : 'বেতন ও পে-স্লিপ হিসাব',
    chatsTab: language === 'en' ? 'Direct Messaging Hub' : 'বার্তা আদান-প্রদান চ্যাট',
    pendingTasks: language === 'en' ? 'Pending Tasks' : 'চলতি কাজসমূহ',
    completedTasks: language === 'en' ? 'Completed Tasks' : 'সম্পন্ন কাজসমূহ',
    monthlySalary: language === 'en' ? 'Monthly Pay Grade' : 'মাসিক বেতন কাঠামো',
    salaryPaidStatus: language === 'en' ? 'Payroll Status' : 'চলতি মাসের পেমেন্ট',
    taskTitle: language === 'en' ? 'Task Title' : 'কাজের শিরোনাম',
    priority: language === 'en' ? 'Priority' : 'গুরুত্ব',
    dueDate: language === 'en' ? 'Due Date' : 'শেষ সময়',
    status: language === 'en' ? 'Status' : 'অবস্থা',
    actions: language === 'en' ? 'Actions' : 'কার্যক্রম',
    startTask: language === 'en' ? 'Start Working' : 'কাজটি শুরু করুন',
    submitCompletion: language === 'en' ? 'Submit Progress' : 'রিপোর্ট জমা দিন',
    viewSubmission: language === 'en' ? 'View Work Note' : 'জমা দেওয়া কাজের নোট',
    completed: language === 'en' ? 'Completed' : 'সম্পন্ন হয়েছে',
    submitted: language === 'en' ? 'Submitted (Reviewing)' : 'জমা দেওয়া হয়েছে (অপেক্ষমান)',
    inprogress: language === 'en' ? 'In Progress' : 'চলমান',
    pending: language === 'en' ? 'Pending Acceptance' : 'নতুন কাজ',
    submitWorkTitle: language === 'en' ? 'Submit Work Deliverables' : 'কাজের অগ্রগতি রিপোর্ট জমা দিন',
    compNoteLabel: language === 'en' ? 'Provide completion or progress notes:' : 'কাজের বিস্তারিত আউটপুট বা লিংক এখানে লিখুন:',
    submitBtn: language === 'en' ? 'Confirm and Submit' : 'নিশ্চিত ও সংরক্ষণ করুন',
    reportTitleLabel: language === 'en' ? 'Report Title' : 'রিপোর্টের শিরোনাম',
    reportContentLabel: language === 'en' ? 'Detailed Report Content' : 'রিপোর্টের বিস্তারিত বিবরণ',
    reportTypeLabel: language === 'en' ? 'Reporting Frequency' : 'রিপোর্টের ধরণ',
    submitReportBtn: language === 'en' ? 'Send Report to Admin' : 'অ্যাডমিনের কাছে রিপোর্ট পাঠান',
    reportSuccessMsg: language === 'en' ? 'Report submitted successfully to Admin!' : 'অগ্রগতি রিপোর্ট সফলভাবে অ্যাডমিনের নিকট প্রেরিত হয়েছে!',
    salaryStubTitle: language === 'en' ? 'Official Paystub History' : 'অফিসিয়াল বেতন ও পে-স্লিপ হিস্ট্রি',
    salaryAmountText: language === 'en' ? 'Base Salary:' : 'মূল বেতন কাঠামো:',
    monthText: language === 'en' ? 'Month' : 'মাস / সময়কাল',
    disbursedAmount: language === 'en' ? 'Amount Disbursed' : 'পরিশোধিত অর্থ',
    dateText: language === 'en' ? 'Disbursement Date' : 'প্রদানের তারিখ',
    txIdText: language === 'en' ? 'Voucher Block Hash / Transaction ID' : 'ভাউচার আইডি / ট্রানজেকশন কড',
    chatWithAdmin: language === 'en' ? 'Direct Admin Channel (Zakir Hasan)' : 'অ্যাডমিন ডিরেক্ট পোর্টাল (জাকির হাসান)',
    chatWithClient: language === 'en' ? 'Direct Clients Line' : 'ক্লায়েন্ট ডিরেক্ট চ্যাট',
    typeMessagePlaceholder: language === 'en' ? 'Type secure message here... (Press Enter to Send)' : 'নিরাপদ বার্তা এখানে লিখুন... (পাঠাতে এন্টার চাপুন)',
    reportedOn: language === 'en' ? 'Reported on: ' : 'রিপোর্ট করার তারিখ: ',
    verifiedBadge: language === 'en' ? 'Official Automated Pay' : 'ব্যাংক ট্রান্সফার গেটওয়ে দ্বারা নিশ্চিত',
  };

  const handleUpdateTaskInprogress = (taskId: string) => {
    onUpdateTaskStatus(taskId, 'In Progress');
  };

  const handleOpenSubmitModal = (task: Task) => {
    setSelectedTaskForSubmit(task);
    setSubmissionNote('');
    setSubmissionFiles([]);
  };

  const handleSaveSubmission = () => {
    if (!selectedTaskForSubmit) return;
    onUpdateTaskStatus(selectedTaskForSubmit.id, 'Submitted', submissionNote, submissionFiles);
    setSelectedTaskForSubmit(null);
    setSubmissionNote('');
    setSubmissionFiles([]);
  };

  const handleSubmitNewReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim() || !reportContent.trim()) return;

    onSubmitReport({
      title: reportTitle,
      content: reportContent,
      date: new Date().toISOString().split('T')[0],
      type: reportType,
      attachments: reportFiles
    });

    setReportTitle('');
    setReportContent('');
    setReportFiles([]);
    setReportSuccess(true);
    setTimeout(() => setReportSuccess(false), 4000);
  };

  const handleSendMessage = () => {
    if (!typedMessage.trim() && chatAttachedFiles.length === 0) return;
    onSendChatMessage(activeChatChannel, typedMessage, chatAttachedFiles);
    setTypedMessage('');
    setChatAttachedFiles([]);
    setShowChatAttachments(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in text-xs text-slate-100">
      
      {/* Header Profile Section */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/45 to-purple-900/30 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[150%] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="flex items-center gap-5 relative z-10">
          <img 
            src={employee.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"} 
            alt={employee.name} 
            className="w-16 h-16 rounded-2xl border-2 border-indigo-400 object-cover shadow-lg shrink-0" 
          />
          <div className="space-y-1">
            <span className="bg-indigo-500/10 border border-indigo-500/15 text-indigo-300 font-bold px-2.5 py-1 rounded-lg text-[9px] uppercase tracking-wider font-mono">
              {text.empPortal}
            </span>
            <h2 className="text-xl font-black text-white font-display tracking-tight mt-1.5 flex items-center gap-2">
              {text.welcome} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-300">{employee.name}</span>
            </h2>
            <div className="text-[10px] text-slate-400 space-y-0.5">
              <p><strong className="text-slate-350">{text.designation}</strong>{employee.role}</p>
              <p><strong className="text-slate-350">{text.joined}</strong>{employee.joinedDate}</p>
              {employee.phone && <p><strong className="text-slate-355">Contact No: </strong>{employee.phone}</p>}
            </div>
          </div>
        </div>

        {/* Dynamic Registered skills tagboard */}
        <div className="text-right space-y-1.5 shrink-0 max-w-xs relative z-10 font-mono">
          <span className="text-[9px] text-slate-400 uppercase font-black block tracking-widest">{text.skills}</span>
          <div className="flex flex-wrap gap-1 md:justify-end">
            {(employee.skills && employee.skills.length > 0) ? (
              employee.skills.map((sk, i) => (
                <span key={i} className="bg-white/5 border border-white/5 px-2 py-1 rounded-md text-[9px] text-indigo-300">
                  {sk}
                </span>
              ))
            ) : (
              <span className="text-slate-500 italic text-[10px]">React Developer, Express API</span>
            )}
          </div>
        </div>
      </div>

      {/* Mini-dashboard performance logs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#111625]/90 border border-white/5 p-4 rounded-2xl space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold font-mono tracking-wider text-slate-400">{text.pendingTasks}</span>
            <Clock className="h-4.5 w-4.5 text-amber-400" />
          </div>
          <p className="text-2xl font-black font-mono text-white">{pendingCount}</p>
          <div className="text-[8px] text-amber-500/80 font-mono">Requires action milestones</div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#111625]/90 border border-white/5 p-4 rounded-2xl space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold font-mono tracking-wider text-slate-400">{text.completedTasks}</span>
            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
          </div>
          <p className="text-2xl font-black font-mono text-white">{completedCount}</p>
          <div className="text-[8px] text-emerald-400/80 font-mono">Pushed successfully</div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#111625]/90 border border-white/5 p-4 rounded-2xl space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold font-mono tracking-wider text-slate-400">{text.monthlySalary}</span>
            <DollarSign className="h-4.5 w-4.5 text-indigo-400" />
          </div>
          <p className="text-2xl font-black font-mono text-indigo-300">{currencySymbol}{employee.salaryAmount.toLocaleString()}</p>
          <div className="text-[8px] text-slate-400 font-mono">Per month base ledger rate</div>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#111625]/90 border border-white/5 p-4 rounded-2xl space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold font-mono tracking-wider text-slate-400">{text.salaryPaidStatus}</span>
            <TrendingUp className="h-4.5 w-4.5 text-purple-400" />
          </div>
          <p className="text-base font-black font-mono text-emerald-450 uppercase mt-1">Paid (পরিশোধিত)</p>
          <div className="text-[8px] text-emerald-400/80 font-mono flex items-center gap-1">
            <Check className="h-3 w-3" /> Secure Sync Active
          </div>
        </div>
      </div>

      {/* Quick Nav SubTabs bar */}
      <div className="flex bg-slate-900/60 p-1 rounded-xl border border-white/5 max-w-2xl">
        <button
          onClick={() => setActiveSubTab('tasks')}
          className={`flex-1 py-2 rounded-lg font-bold text-center text-xs cursor-pointer transition ${
            activeSubTab === 'tasks' ? 'bg-white/10 text-white border border-white/10 shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          {text.myTasksTab}
        </button>
        <button
          onClick={() => setActiveSubTab('reports')}
          className={`flex-1 py-2 rounded-lg font-bold text-center text-xs cursor-pointer transition ${
            activeSubTab === 'reports' ? 'bg-white/10 text-white border border-white/10 shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          {text.submitReportTab}
        </button>
        <button
          onClick={() => setActiveSubTab('payroll')}
          className={`flex-1 py-2 rounded-lg font-bold text-center text-xs cursor-pointer transition ${
            activeSubTab === 'payroll' ? 'bg-white/10 text-white border border-white/10 shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          {text.payrollTab}
        </button>
        <button
          onClick={() => setActiveSubTab('chats')}
          className={`flex-1 py-2 rounded-lg font-bold text-center text-xs cursor-pointer transition ${
            activeSubTab === 'chats' ? 'bg-[#1a1b3a] text-indigo-300 border border-indigo-500/10 shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          {text.chatsTab}
        </button>
        <button
          onClick={() => setActiveSubTab('agreements')}
          className={`flex-1 py-2 rounded-lg font-bold text-center text-xs cursor-pointer transition ${
            activeSubTab === 'agreements' ? 'bg-indigo-550/20 text-indigo-300 border border-indigo-500/20 shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          {language === 'en' ? 'Remote Contracts' : 'কর্মচুক্তি ও দায়বদ্ধতা'}
        </button>
      </div>

      {/* RENDER ACTIVE SUBTAB CONTENT */}

      {/* TAB 1: Tasks inbox panel */}
      {activeSubTab === 'tasks' && (
        <div className="bg-[#111625]/90 border border-white/10 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-black font-display text-white tracking-tight flex items-center gap-2">
            <CheckCircle2 className="h-4.5 w-4.5 text-blue-400" />
            <span>{text.myTasksTab}</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-bold font-mono text-[10px]">
                  <th className="p-3">{text.taskTitle}</th>
                  <th className="p-3">{text.priority}</th>
                  <th className="p-3">{text.dueDate}</th>
                  <th className="p-3">{text.status}</th>
                  <th className="p-3 text-right">{text.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {myTasks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500 font-mono italic">
                      No tasks assigned on your timeline currently.
                    </td>
                  </tr>
                ) : (
                  myTasks.map(task => (
                    <tr key={task.id} className="hover:bg-white/2 transition">
                      <td className="p-3">
                        <span className="font-bold text-slate-200 block text-sm">{task.title}</span>
                        <span className="text-slate-450 text-[10.5px] block mt-0.5 max-w-sm">{task.description}</span>
                        {task.submissionNote && (
                          <div className="mt-2 bg-emerald-500/5 border border-emerald-500/10 p-2 rounded-lg text-[10px] text-slate-350 space-y-1">
                            <div><strong>{text.viewSubmission}:</strong> {task.submissionNote}</div>
                            {task.attachments && task.attachments.length > 0 && (
                              <div className="pt-1 border-t border-emerald-500/10 mt-1">
                                <AttachmentPreview attachments={task.attachments} language={language} />
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-md font-mono text-[9px] font-bold ${
                          task.priority === 'High' ? 'bg-rose-500/10 text-rose-300 border border-rose-505/20' :
                          task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' :
                          'bg-slate-500/10 text-slate-300 border border-slate-500/20'
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-300">{task.dueDate}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          task.status === 'Completed' ? 'bg-emerald-500/15 text-emerald-400' :
                          task.status === 'Submitted' ? 'bg-blue-500/15 text-blue-400' :
                          task.status === 'In Progress' ? 'bg-amber-550/15 text-amber-400 animate-pulse' :
                          'bg-slate-500/15 text-slate-400'
                        }`}>
                          {task.status === 'Completed' ? text.completed :
                           task.status === 'Submitted' ? text.submitted :
                           task.status === 'In Progress' ? text.inprogress :
                           text.pending}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {task.status === 'Pending' && (
                          <button
                            onClick={() => handleUpdateTaskInprogress(task.id)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] cursor-pointer transition font-mono shadow-xs"
                          >
                            {text.startTask}
                          </button>
                        )}
                        {task.status === 'In Progress' && (
                          <button
                            onClick={() => handleOpenSubmitModal(task)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] cursor-pointer transition font-mono shadow-xs"
                          >
                            {text.submitCompletion}
                          </button>
                        )}
                        {task.status === 'Submitted' && (
                          <span className="text-[10px] font-mono text-blue-300 bg-blue-500/5 px-2 py-1 rounded border border-blue-505/10">Under Audit</span>
                        )}
                        {task.status === 'Completed' && (
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/5 px-2 py-1 rounded border border-emerald-505/10">Archived Done</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Inline Work submission workspace form if selected */}
          {selectedTaskForSubmit && (
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-white/10 space-y-3 animate-fade-in">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-white uppercase text-[10.5px] font-mono flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  <span>{text.submitWorkTitle}: <span className="text-indigo-300">{selectedTaskForSubmit.title}</span></span>
                </h4>
                <button 
                  onClick={() => setSelectedTaskForSubmit(null)}
                  className="text-slate-400 hover:text-white font-bold font-mono text-xs px-2"
                >
                  X
                </button>
              </div>

              <div>
                <label className="block text-slate-300 font-mono mb-1.5">{text.compNoteLabel}</label>
                <textarea
                  rows={3}
                  value={submissionNote}
                  onChange={(e) => setSubmissionNote(e.target.value)}
                  placeholder="Insert drive URLs, GitHub pull requests, or custom milestone completion summary..."
                  className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-indigo-400 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-mono mb-1.5">
                  {language === 'en' ? 'Upload deliverables / files / photos:' : 'ডেলিভারেবল কাজ / ফাইল বা ফটো আপলোড করুন:'}
                </label>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <FileUploader onFilesChange={setSubmissionFiles} language={language} multiple={true} accept="image/*,application/*" />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setSelectedTaskForSubmit(null)}
                  className="bg-white/5 hover:bg-white/10 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold font-sans cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSubmission}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-xs font-bold font-sans cursor-pointer shadow-md"
                >
                  {text.submitBtn}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Activity reports logging progress to Admin */}
      {activeSubTab === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Submit form container */}
          <div className="md:col-span-1 bg-[#111625]/90 border border-white/10 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-black font-display text-white tracking-tight flex items-center gap-2">
              <FileText className="h-4.5 w-4.5 text-blue-400" />
              <span>{language === 'en' ? 'Submit Progress log' : 'অগ্রগতি রিপোর্ট দাখিল'}</span>
            </h3>

            {reportSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold rounded-xl text-center">
                {text.reportSuccessMsg}
              </div>
            )}

            <form onSubmit={handleSubmitNewReport} className="space-y-4">
              <div>
                <label className="block text-slate-350 font-bold mb-1.5">{text.reportTitleLabel}</label>
                <input
                  type="text"
                  required
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="e.g. Completed Apex Payment integration"
                  className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-white outline-none focus:border-indigo-400 text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-350 font-bold mb-1.5">{text.reportTypeLabel}</label>
                  <select
                    value={reportType}
                    onChange={(e: any) => setReportType(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 p-2.5 rounded-xl text-slate-200 outline-none focus:border-indigo-400 font-mono"
                  >
                    <option value="Daily">Daily Update</option>
                    <option value="Weekly">Weekly Digest</option>
                    <option value="Monthly">Monthly Summary</option>
                    <option value="Expense Request">Expense Request</option>
                  </select>
                </div>
                <div className="text-slate-450 text-[9.5px] leading-snug flex items-center">
                  <span>Your report logs instantly sync to the Administrator ledger database.</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-350 font-bold mb-1.5">{text.reportContentLabel}</label>
                <textarea
                  rows={4}
                  required
                  value={reportContent}
                  onChange={(e) => setReportContent(e.target.value)}
                  placeholder="Report your tasks completed today, blocker challenges Faced, or invoice receipts required mapping..."
                  className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-white outline-none focus:border-indigo-400 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-350 font-bold mb-1.5">
                  {language === 'en' ? 'Attach logs / invoices / photos:' : 'লগ / রসিদ বা ফটো সংযুক্ত করুন (ঐচ্ছিক):'}
                </label>
                <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                  <FileUploader onFilesChange={setReportFiles} language={language} multiple={true} accept="image/*,application/*" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-650 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-2.5 rounded-xl transition cursor-pointer shadow-md text-xs font-sans"
              >
                {text.submitReportBtn}
              </button>
            </form>
          </div>

          {/* Reports History logs */}
          <div className="md:col-span-2 bg-[#111625]/90 border border-white/10 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-black font-display text-white tracking-tight">
              {language === 'en' ? 'Previously Filed Reports' : 'পূর্ববর্তী রিপোর্টের তালিকা'}
            </h3>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {myReports.length === 0 ? (
                <div className="p-8 text-center text-slate-500 font-mono italic">
                  No activity reports created yet. Complete the left form to file one.
                </div>
              ) : (
                myReports.map(rep => (
                  <div key={rep.id} className="bg-white/2 border border-white/5 p-4 rounded-xl space-y-2 hover:bg-white/4 transition">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="bg-white/5 border border-white/10 text-[9px] font-bold text-slate-350 px-2 py-0.5 rounded-md font-mono mr-2">
                          {rep.type}
                        </span>
                        <h4 className="text-sm font-bold text-white inline-block mt-1 font-display">{rep.title}</h4>
                      </div>
                      <span className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded ${
                        rep.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        'bg-slate-500/10 text-slate-300 border border-slate-500/20'
                      }`}>
                        {rep.status}
                      </span>
                    </div>

                    <p className="text-slate-350 text-[10.5px] font-mono whitespace-pre-wrap pl-2 border-l border-white/10 leading-relaxed">
                      {rep.content}
                    </p>

                    {rep.attachments && rep.attachments.length > 0 && (
                      <div className="pl-2">
                        <AttachmentPreview attachments={rep.attachments} language={language} />
                      </div>
                    )}

                    <div className="flex justify-between items-center text-[9px] text-slate-450 border-t border-white/5 pt-2">
                      <span>{text.reportedOn} {rep.date}</span>
                      {rep.adminFeedback && (
                        <span className="text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded italic">
                          Feedback: "{rep.adminFeedback}"
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Payroll Vouchers & Pay Ledger (বেতন হিসাব) */}
      {activeSubTab === 'payroll' && (
        <div className="bg-[#111625]/90 border border-white/10 rounded-2xl p-5 space-y-6">
          <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-3 border-b border-white/5 pb-4">
            <div>
              <h3 className="text-sm font-black font-display text-white tracking-tight flex items-center gap-2">
                <Receipt className="h-4.5 w-4.5 text-blue-400" />
                <span>{text.salaryStubTitle}</span>
              </h3>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">Voucher disbursement details registered to central bank ledger account node.</p>
            </div>
            <div className="bg-emerald-500/5 border border-emerald-500/10 px-4 py-2.5 rounded-xl flex items-center gap-3 font-mono">
              <div>
                <span className="block text-[9px] text-slate-450 text-right uppercase">PAYROLL SCHEME BASE</span>
                <span className="block text-sm font-black text-emerald-400 text-right">{currencySymbol}{employee.salaryAmount.toLocaleString()} / mo</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pay Grade Details Card */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 space-y-3 block h-fit text-slate-300">
              <span className="text-[9.5px] text-indigo-400 uppercase font-black tracking-widest block font-mono">EMPLOYEE LEDGER CARD</span>
              <div className="divide-y divide-white/5 text-[10.5px] space-y-2">
                <div className="flex justify-between py-1 mt-1 font-mono">
                  <span>Name:</span>
                  <span className="font-bold text-white">{employee.name}</span>
                </div>
                <div className="flex justify-between py-1 font-mono">
                  <span>Assigned Post:</span>
                  <span className="text-white">{employee.role}</span>
                </div>
                <div className="flex justify-between py-1 font-mono">
                  <span>Payout Rate:</span>
                  <span className="font-bold text-white">{currencySymbol}{employee.salaryAmount.toLocaleString()} per month</span>
                </div>
                <div className="flex justify-between py-1 font-mono">
                  <span>Channel:</span>
                  <span className="text-slate-400 bg-white/10 px-1.5 rounded text-[10px]">Dutch Bangla Transfer (DBBL)</span>
                </div>
              </div>
              <div className="bg-indigo-500/10 p-3 rounded-lg border border-indigo-500/20 text-[9px] leading-relaxed text-indigo-300 font-mono flex items-center gap-2">
                <span>✓</span>
                <span>{text.verifiedBadge}</span>
              </div>
            </div>

            {/* Paystub Voucher Ledger */}
            <div className="md:col-span-2 space-y-3">
              <h4 className="font-bold text-white uppercase text-[10px] font-mono tracking-wider">Payroll Processing Logs</h4>
              
              <div className="bg-black/20 rounded-xl border border-white/5 overflow-hidden">
                <div className="grid grid-cols-4 bg-white/5 p-3 rounded-t-xl font-bold font-mono text-[9.5px] text-slate-400 border-b border-white/5">
                  <div>{text.monthText}</div>
                  <div>{text.disbursedAmount}</div>
                  <div>{text.dateText}</div>
                  <div>{text.txIdText}</div>
                </div>

                <div className="divide-y divide-white/5">
                  {employee.paymentsPaid.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 font-mono italic">
                      No payroll disbursements recorded inside this portal ledger yet.
                    </div>
                  ) : (
                    employee.paymentsPaid.map((stub, i) => (
                      <div key={i} className="grid grid-cols-4 p-3 font-mono text-[10.5px] text-slate-300 hover:bg-white/2 transition">
                        <div className="font-bold text-white">{stub.month}</div>
                        <div className="text-emerald-400 font-bold">{currencySymbol}{stub.amount.toLocaleString()}</div>
                        <div className="text-slate-400">{stub.paidDate}</div>
                        <div className="text-slate-450 truncate text-[9.5px] max-w-[150px]" title={stub.txId}>{stub.txId}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Direct chats with Admin & Associated Clients */}
      {activeSubTab === 'chats' && (
        <div className="bg-[#111625]/90 border border-white/10 rounded-2xl p-0 overflow-hidden flex flex-col md:flex-row h-[420px] max-w-4xl mx-auto">
          
          {/* Chat side navigation Channels list */}
          <div className="w-full md:w-56 bg-slate-900/60 border-r border-white/10 flex flex-col shrink-0">
            <div className="p-3 border-b border-white/5 bg-black/20">
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest font-mono">Channels (চ্যানেল)</span>
            </div>
            <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
              
              {/* Channel 1: Admin */}
              <button
                onClick={() => setActiveChatChannel('admin')}
                className={`w-full text-left p-3 rounded-lg font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                  activeChatChannel === 'admin' 
                    ? 'bg-indigo-500/20 text-indigo-200 border-l-4 border-indigo-500' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
                <div className="truncate">
                  <span>{language === 'en' ? 'Zakir Hasan (Admin)' : 'জাকির হাসান (অ্যাডমিন)'}</span>
                  <span className="block text-[8.5px] font-mono text-slate-450 truncate">Company Administrator</span>
                </div>
              </button>

              <div className="border-t border-white/5 my-2 pt-2 px-1 text-[9px] text-slate-500 uppercase tracking-widest font-black font-mono">
                {text.chatWithClient}
              </div>

              {/* Channels: Clients */}
              {clients.map(cl => (
                <button
                  key={cl.id}
                  onClick={() => setActiveChatChannel(cl.id)}
                  className={`w-full text-left p-3 rounded-lg font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                    activeChatChannel === cl.id 
                      ? 'bg-emerald-500/20 text-emerald-300 border-l-4 border-emerald-500' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
                  <div className="truncate">
                    <span>{cl.name}</span>
                    <span className="block text-[8.5px] font-mono text-slate-450 truncate">{cl.companyName}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Chat active window messages stream */}
          <div className="flex-grow flex flex-col bg-black/10">
            <div className="p-3.5 border-b border-white/5 flex justify-between items-center bg-black/20 min-h-[50px]">
              <div>
                <span className="text-[10px] font-mono font-bold block text-indigo-300">
                  {activeChatChannel === 'admin' ? 'CONNECTED CHANNEL: administrator' : 'CLIENT SECURE CRM LINE'}
                </span>
                <span className="text-[11px] font-bold text-white block mt-0.5">
                  {activeChatChannel === 'admin' 
                    ? 'Zakir Hasan (Lead Director)' 
                    : clients.find(c => c.id === activeChatChannel)?.name || 'Direct Thread'}
                </span>
              </div>
            </div>

            {/* Messages box stream wrapper */}
            <div className="flex-grow overflow-y-auto p-4 space-y-3">
              {myChats.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-500 italic font-mono text-center flex-col gap-1.5 py-12">
                  <MessageSquare className="h-6 w-6 text-slate-650" />
                  <span>No messages in this pipeline thread yet.<br />Initiate secure communication using the portal interface below.</span>
                </div>
              ) : (
                myChats.map(message => {
                  const isMe = message.senderId === employee.id;
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
                          ? 'bg-gradient-to-tr from-blue-600 to-indigo-650 text-white rounded-tr-none' 
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

            {/* Chat bottom input bar control */}
            <div className="border-t border-white/5 bg-black/25 flex flex-col p-2 space-y-2">
              {showChatAttachments && (
                <div className="bg-[#191e2b] border border-white/5 rounded-xl p-3 animate-fade-in">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[9px] font-mono uppercase text-indigo-300 font-black">
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
                  className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl cursor-pointer transition shrink-0 flex items-center justify-center shadow-md shadow-indigo-600/10"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 5: Agreements ledger panel */}
      {activeSubTab === 'agreements' && (
        <div className="bg-[#111625]/90 border border-white/10 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-black font-display text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-4.5 w-4.5 text-blue-400" />
            <span>{language === 'en' ? 'My Official Work Agreements & NDAs' : 'আমার রিমোট কর্মচুক্তি ও ও আইনি দায়বদ্ধতা দলীলসমূহ'}</span>
          </h3>

          <div className="space-y-4">
            {agreements.filter(a => a.employeeId === employee.id).length === 0 ? (
              <div className="py-12 text-center text-slate-500 font-mono italic">
                No active agreements have been assigned on your account profile yet.
              </div>
            ) : (
              agreements.filter(a => a.employeeId === employee.id).map(ag => {
                const isExpanded = expandedContractId === ag.id;
                
                // Helper to render markdown document segments
                const renderMD = (mdText: string) => {
                  if (!mdText) return null;
                  const lines = mdText.split('\n');
                  return lines.map((line, idx) => {
                    if (line.startsWith('### ')) {
                      return <h4 key={idx} className="text-xs font-black text-white mt-4 mb-1 uppercase tracking-wider">{line.replace('### ', '')}</h4>;
                    }
                    if (line.startsWith('## ')) {
                      return <h3 key={idx} className="text-sm font-black text-indigo-300 mt-5 mb-2 uppercase border-b border-indigo-550/20 pb-0.5">{line.replace('## ', '')}</h3>;
                    }
                    if (line.startsWith('# ')) {
                      return <h2 key={idx} className="text-base font-black text-indigo-400 text-center mb-4 uppercase tracking-wider">{line.replace('# ', '')}</h2>;
                    }
                    return <p key={idx} className="text-[10.5px] text-slate-300 leading-relaxed my-2 whitespace-pre-wrap">{line}</p>;
                  });
                };

                const handleSignByEmployee = () => {
                  if (!onUpdateAgreement) return;
                  const timestampStr = new Date().toISOString();
                  const signature = `Signed Digitally by ${employeeSignText} [Verified Token ID: EM-${employee.id}-${Math.floor(1000 + Math.random()*9000)}]`;
                  
                  const updated: Agreement = {
                    ...ag,
                    employeeSignature: signature,
                    status: 'Signed',
                    signedAt: timestampStr
                  };

                  onUpdateAgreement(updated);
                  alert(language === 'en' ? 'Document digitally signed and verified successfully!' : 'দলিলটি সফলভাবে ডিজিটাল স্বাক্ষর দেওয়া হয়েছে!');
                };

                return (
                  <div key={ag.id} className="border border-white/5 bg-[#141b2c] rounded-xl overflow-hidden shadow-inner">
                    <div 
                      onClick={() => setExpandedContractId(isExpanded ? null : ag.id)}
                      className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 cursor-pointer hover:bg-white/2 transition"
                    >
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-200">{ag.projectName}</h4>
                        <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                          <span className="font-mono bg-white/5 px-2 py-0.5 rounded border border-white/5">{ag.employeeRole}</span>
                          <span>•</span>
                          <span>Created: {new Date(ag.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono ${
                          ag.status === 'Signed' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-300 animate-pulse'
                        }`}>
                          {ag.status === 'Signed' ? (language === 'en' ? 'Signed & Enforced' : 'সইকৃত ও সক্রিয়') : (language === 'en' ? 'Action Required' : 'স্বাক্ষর প্রয়োজন')}
                        </span>
                        <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-5 border-t border-white/5 bg-[#0a0014]/60 space-y-6 animate-fade-in">
                        {/* Legal Scroll layout */}
                        <div className="bg-[#0b0c16] border border-white/5 p-6 rounded-xl space-y-4 max-w-3xl mx-auto shadow-inner text-slate-300">
                          {renderMD(ag.agreementText)}

                          {/* Digital sign footers inside the scroll block */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-white/5 mt-6">
                            {/* Admin Signature */}
                            <div className="bg-slate-900/50 p-3 rounded-lg border border-white/5 text-[10px]">
                              <span className="block text-[8px] uppercase font-bold text-indigo-400 font-mono mb-1">Company Representative Sign:</span>
                              {ag.adminSignature ? (
                                <p className="font-serif italic text-indigo-300 font-bold mb-1">{ag.adminSignature}</p>
                              ) : (
                                <p className="text-slate-500 italic">Not signed yet</p>
                              )}
                              <span className="text-[8px] text-slate-500 block">Verified Corporate Stamp</span>
                            </div>

                            {/* Employee Signature */}
                            <div className="bg-slate-900/50 p-3 rounded-lg border border-white/5 text-[10px]">
                              <span className="block text-[8px] uppercase font-bold text-emerald-400 font-mono mb-1">Employee Witness Signature:</span>
                              {ag.employeeSignature ? (
                                <>
                                  <p className="font-serif italic text-emerald-400 font-bold mb-1">{ag.employeeSignature}</p>
                                  {ag.signedAt && <span className="text-[8.5px] text-slate-400 block font-mono">Timestamp: {new Date(ag.signedAt).toLocaleString()}</span>}
                                </>
                              ) : (
                                <p className="text-rose-450 italic">Awaiting Digital Signature</p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Sign Form if empty */}
                        {!ag.employeeSignature && (
                          <div className="bg-slate-900 p-4 rounded-xl border border-white/5 max-w-xl mx-auto space-y-3">
                            <span className="text-[10px] uppercase font-black tracking-wider text-indigo-300 font-mono block flex items-center gap-1.5">
                              <Signature className="h-4 w-4" />
                              <span>{language === 'en' ? 'Digital Signature Stamp Verification' : 'দলিলটিতে ডিজিটাল সিগনেচার ও সম্মতি নিশ্চিতকরণ'}</span>
                            </span>
                            <p className="text-slate-400 leading-relaxed text-[10px]">
                              {language === 'en' 
                                ? 'By typing your name below and clicking the sign button, you legally consent that you have read all clauses, NDAs, non-disclosure requirements, intellectual property assignments, and penalty provisions, and you execute this agreement in good faith.'
                                : 'নিচে আপনার পূর্ণ অফিসিয়াল নাম টাইপ করে স্বাক্ষর বাটনে ক্লিক করার মাধ্যমে আপনি আইনগতভাবে সাক্ষ্য দিচ্ছেন যে, আপনি প্রজেক্টের সকল শর্তাবলী, কাজের পরিধি, কোডের গোপনীয়তা (NDA), মেধাস্বত্ব সোপর্দকরণ ও বিলম্ব সংক্রান্ত পেনাল্টি পলিসি ভালোভাবে পড়েছেন এবং এতে সানন্দে সহমত প্রকাশ করছেন।'}
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-2">
                              <input
                                type="text"
                                value={employeeSignText}
                                onChange={(e) => setEmployeeSignText(e.target.value)}
                                placeholder="Type your legal full name to sign"
                                className="flex-grow bg-white/5 border border-white/10 rounded-lg p-2 text-white font-mono text-[11px]"
                              />
                              <button
                                onClick={handleSignByEmployee}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2 px-5 rounded-lg text-[10.5px] cursor-pointer transition font-mono flex items-center gap-1"
                              >
                                <FileCheck className="h-4 w-4" />
                                <span>{language === 'en' ? 'Legally Sign Contract' : 'ডিজিটাল স্বাক্ষর প্রদান করুন'}</span>
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end pr-2">
                          <button
                            onClick={() => window.print()}
                            className="bg-white/5 hover:bg-white/10 text-slate-300 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition text-[10px]"
                          >
                            <Printer className="h-3.5 w-3.5" />
                            <span>{language === 'en' ? 'Print Document copy' : 'প্রিন্টযোগ্য কপি ও রসিদ'}</span>
                          </button>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

    </div>
  );
}
