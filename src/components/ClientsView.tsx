import React, { useState } from 'react';
import { Client, Transaction, AppSettings, BankAccount } from '../types';
import { Plus, Users, DollarSign, FileText, Send, Phone, ArrowDownRight, Printer, Copy, Check, CircleAlert, Sparkles, X, ChevronRight } from 'lucide-react';

interface ClientsViewProps {
  clients: Client[];
  onAddClient: (newClient: Omit<Client, 'id' | 'dueAmount'>) => void;
  onRecordPayment: (clientId: string, amount: number, note: string, category: string, bankAccountId: string) => void;
  language: 'en' | 'bn';
  settings: AppSettings;
  bankAccounts?: BankAccount[];
}

export default function ClientsView({ clients, onAddClient, onRecordPayment, language, settings, bankAccounts = [] }: ClientsViewProps) {
  const currencySymbol = settings.currency === 'BDT' ? '৳' : '$';

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClientForPayment, setSelectedClientForPayment] = useState<Client | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentNote, setPaymentNote] = useState('');
  const [paymentCategory, setPaymentCategory] = useState('');
  const [paymentBankAccountId, setPaymentBankAccountId] = useState('');

  // Invoice generator state
  const [selectedClientForInvoice, setSelectedClientForInvoice] = useState<Client | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2026-003');
  const [invoiceDate, setInvoiceDate] = useState('2026-06-02');

  // AI draft generating states
  const [aiDraftClient, setAiDraftClient] = useState<Client | null>(null);
  const [aiDraftText, setAiDraftText] = useState('');
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [draftLang, setDraftLang] = useState<'Bengali' | 'English'>('Bengali');
  const [copiedDraft, setCopiedDraft] = useState(false);

  // New Client Form inputs
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [projectName, setProjectName] = useState('');
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [notes, setNotes] = useState('');

  // Form submission helpers
  const handleAddNewClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !companyName || !projectName || totalBudget <= 0) return;
    onAddClient({
      name,
      companyName,
      email,
      phone,
      projectName,
      totalBudget,
      paidAmount: 0,
      status: 'Active',
      notes
    });
    // reset
    setName('');
    setCompanyName('');
    setEmail('');
    setPhone('');
    setProjectName('');
    setTotalBudget(0);
    setNotes('');
    setShowAddModal(false);
  };

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientForPayment || paymentAmount <= 0) return;

    const cat = paymentCategory || (settings.incomeCategories && settings.incomeCategories[0]) || 'Milestone Payment (কাজের কিস্তি পেমেন্ট)';
    const bankId = paymentBankAccountId || (bankAccounts && bankAccounts[0]?.id) || 'b1';

    onRecordPayment(
      selectedClientForPayment.id,
      paymentAmount,
      paymentNote || `Payment received: ${paymentNote}`,
      cat,
      bankId
    );
    setPaymentAmount(0);
    setPaymentNote('');
    setPaymentCategory('');
    setPaymentBankAccountId('');
    setSelectedClientForPayment(null);
  };

  // call server-side Gemini draft API
  const generateAiPaymentReminder = async (client: Client, lang: 'Bengali' | 'English') => {
    setIsGeneratingDraft(true);
    setAiDraftClient(client);
    setAiDraftText('');
    try {
      const response = await fetch('/api/gemini/invoice-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: client.name,
          projectName: client.projectName,
          totalBudget: client.totalBudget,
          paidAmount: client.paidAmount,
          dueAmount: client.dueAmount,
          language: lang,
        })
      });
      const data = await response.json();
      if (data.emailText) {
        setAiDraftText(data.emailText);
      } else {
        setAiDraftText('Failed to generate draft. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setAiDraftText('Failed to reach Gemini. Verify connection.');
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(aiDraftText);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  const triggerPrintInvoice = () => {
    window.print();
  };

  // Translations
  const text = {
    en: {
      crm: 'Clients CRM & Accounts Ledger',
      newClientButton: 'Onboard New client',
      addClientTitle: 'Onboard New Client Project',
      clientName: 'Client Contact Name',
      companyName: 'Company Name',
      email: 'Email Address',
      phone: 'Phone/Whatsapp',
      budget: 'Total Contract Budget ($)',
      projName: 'Project Name/Scope',
      submitBtn: 'Add Contract',
      paidAmount: 'Paid',
      dueAmount: 'Dues',
      status: 'Status',
      actions: 'Financial Actions',
      recPayment: 'Collect Payment',
      genInvoice: 'Generate Invoice',
      aiDraft: 'AI Payment Reminder',
      close: 'Close',
      submitPay: 'Record Payment',
      amount: 'Amount Received ($)',
      note: 'Payment Notes / Ledger ref',
      generating: 'AI is thinking & drafting in Bengali...',
      copyDraft: 'Copy AI Draft',
      copied: 'Copied!',
      invoiceConfig: 'Invoice Builder Config',
    },
    bn: {
      crm: 'ক্লায়েন্ট সিআরএম ও অ্যাকাউন্টস লেজার',
      newClientButton: 'নতুন ক্লায়েন্ট যুক্ত করুন',
      addClientTitle: 'নতুন ক্লায়েন্ট ও প্রজেক্ট চুক্তি বিবরণ',
      clientName: 'ক্লায়েন্টের নাম',
      companyName: 'কোম্পানি/প্রতিষ্ঠানের নাম',
      email: 'ইমেইল এড্রেস',
      phone: 'ফোন নাম্বার/হোয়াটসঅ্যাপ',
      budget: 'চুক্তিকৃত মোট বাজেট ($)',
      projName: 'প্রজেক্টের নাম ও বিবরণ',
      submitBtn: 'চুক্তি যুক্ত করুন',
      paidAmount: 'পরিশোধিত',
      dueAmount: 'বকেয়া',
      status: 'অবস্থা',
      actions: 'হিসাব সংক্রান্ত অ্যাকশনসমূহ',
      recPayment: 'পেমেন্ট জমা করুন',
      genInvoice: 'ইনভয়েস তৈরি করুন',
      aiDraft: 'রিমাইন্ডার খসড়া (AI)',
      close: 'বন্ধ করুন',
      submitPay: 'পেমেন্ট রেকর্ড করুন',
      amount: 'জমাকৃত টাকার পরিমাণ ($)',
      note: 'লেনদেন বিবরণী / নোট',
      generating: 'এআই বাংলায় রিমাইন্ডার ড্রাফট করছে...',
      copyDraft: 'ড্রাফট কপি করুন',
      copied: 'কপি হয়েছে!',
      invoiceConfig: 'ইনভয়েস কনফিগারেশন',
    }
  }[language];

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-5 gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">{text.crm}</h2>
          <p className="text-sm text-slate-400 mt-1">
            {language === 'en' 
              ? 'Onboard clients, record incoming payments, track system dues, and draft smart reminders.' 
              : 'নতুন ক্লায়েন্ট প্রজেক্ট যুক্ত করুন, চলতি পেমেন্ট জমা রাখুন এবং বকেয়া আদায়ের জন্য জেমিনি এআই রিমাইন্ডার ব্যবহার করুন।'}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl transition shadow-lg shadow-indigo-500/20 text-sm"
        >
          <Plus className="h-4 w-4" />
          {text.newClientButton}
        </button>
      </div>

      {/* Main Table/Grid */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto border-none">
          <table className="w-full text-left text-sm text-slate-200">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-slate-300 font-mono text-xs uppercase">
                <th className="p-4">{language === 'en' ? 'Company / Project' : 'কোম্পানি ও প্রজেক্ট'}</th>
                <th className="p-4">{language === 'en' ? 'Contact details' : 'যোগাযোগ বিবরণ'}</th>
                <th className="p-4">{language === 'en' ? 'Total Project Budget' : 'মোট বাজেট'}</th>
                <th className="p-4 text-emerald-400">{text.paidAmount}</th>
                <th className="p-4 text-amber-400">{text.dueAmount}</th>
                <th className="p-4">{text.status}</th>
                <th className="p-4 text-right">{text.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-white/5 transition-all">
                  <td className="p-4">
                    <span className="block font-bold text-white text-base">{client.companyName}</span>
                    <span className="block text-xs text-indigo-300 bg-indigo-500/15 border border-indigo-500/25 inline-block px-2.5 py-0.5 rounded-lg mt-1 font-bold select-none">
                      {client.projectName}
                    </span>
                  </td>
                  <td className="p-4 text-xs space-y-1">
                    <div className="font-semibold text-slate-200">{client.name}</div>
                    <div className="text-slate-400">{client.email}</div>
                    <div className="text-slate-400 font-mono flex items-center gap-1">
                      <Phone className="h-3 w-3 inline" /> {client.phone}
                    </div>
                  </td>
                  <td className="p-4 font-bold font-mono text-white">{currencySymbol}{client.totalBudget.toLocaleString()}</td>
                  <td className="p-4 font-bold font-mono text-emerald-400">{currencySymbol}{client.paidAmount.toLocaleString()}</td>
                  <td className={`p-4 font-bold font-mono ${client.dueAmount > 0 ? 'text-amber-400 bg-amber-500/10 px-2 rounded-lg py-1' : 'text-slate-400'}`}>
                    {currencySymbol}{client.dueAmount.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      client.status === 'Active' ? 'bg-blue-500/15 text-blue-400 border-blue-500/25' :
                      client.status === 'Completed' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' : 'bg-white/5 text-slate-300 border-white/10'
                    }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex flex-col sm:flex-row gap-2 justify-end items-stretch sm:items-center">
                      <button
                        onClick={() => {
                          setSelectedClientForPayment(client);
                          setPaymentAmount(client.dueAmount);
                          setPaymentCategory((settings.incomeCategories && settings.incomeCategories[0]) || '');
                          setPaymentBankAccountId((bankAccounts && bankAccounts[0]?.id) || '');
                        }}
                        className="text-xs bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-emerald-200 py-1.5 px-3 rounded-lg transition font-bold text-center"
                      >
                        {text.recPayment}
                      </button>
                      <button
                        onClick={() => setSelectedClientForInvoice(client)}
                        className="text-xs bg-white/10 hover:bg-white/15 border border-white/10 text-white py-1.5 px-3 rounded-lg transition font-bold text-center"
                      >
                        {text.genInvoice}
                      </button>
                      {client.dueAmount > 0 && (
                        <button
                          onClick={() => generateAiPaymentReminder(client, draftLang)}
                          className="text-xs bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 text-indigo-300 py-1.5 px-3 rounded-lg transition flex items-center justify-center gap-1.5 font-bold"
                        >
                          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                          {language === 'en' ? 'Remind Draft' : 'বকেয়া রিমাইন্ডার'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Section: AI Reminder draft view */}
      {aiDraftClient && (
        <div className="bg-white/5 backdrop-blur-xl border border-indigo-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h4 className="font-bold flex items-center gap-2 text-indigo-400 text-base">
              <Sparkles className="h-5 w-5 animate-pulse" />
              {language === 'en' ? `AI Payment Draft: ${aiDraftClient.companyName}` : `এআই পেমেন্ট রিমাইন্ডার খসড়া: ${aiDraftClient.companyName}`}
            </h4>
            <div className="flex items-center gap-3">
              <select 
                value={draftLang}
                onChange={(e) => {
                  const newL = e.target.value as 'Bengali' | 'English';
                  setDraftLang(newL);
                  generateAiPaymentReminder(aiDraftClient, newL);
                }}
                className="bg-white/10 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white outline-none focus:border-indigo-400 cursor-pointer"
              >
                <option value="Bengali">বাংলা (Bengali)</option>
                <option value="English">English</option>
              </select>
              <button 
                onClick={() => { setAiDraftClient(null); setAiDraftText(''); }}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          {isGeneratingDraft ? (
            <div className="flex items-center gap-3 py-6 text-slate-400">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-500 border-t-transparent" />
              <span>{text.generating}</span>
            </div>
          ) : (
            <div className="space-y-3">
              <textarea
                value={aiDraftText}
                onChange={(e) => setAiDraftText(e.target.value)}
                rows={8}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs font-mono text-slate-100 outline-none focus:border-indigo-505 leading-relaxed shadow-inner"
              />
              <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
                <span>{language === 'en' ? 'Protip: Edit text directly inside draft box.' : 'পরামর্শ: আপনি সরাসরি টেক্সট পরিবর্তন করতে পারেন।'}</span>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-750 text-white font-bold px-4 py-2 rounded-xl transition shadow-lg shadow-indigo-500/20"
                >
                  {copiedDraft ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copiedDraft ? text.copied : text.copyDraft}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Section: SVG Printable Invoice Draft */}
      {selectedClientForInvoice && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6 print:m-0 print:p-0 print:border-none print:shadow-none">
          <div className="flex justify-between items-center border-b border-white/10 pb-4 print:hidden">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <FileText className="text-slate-400 h-5 w-5" />
              {language === 'en' ? 'Invoice Preview & Printing' : 'ইনভয়েস প্রিন্ট এবং প্রিভিউ'}
            </h4>
            <div className="flex items-center gap-2">
              <button
                onClick={triggerPrintInvoice}
                className="flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-2 px-4 rounded-xl font-bold text-xs transition shadow-lg shadow-blue-500/10"
              >
                <Printer className="h-3.5 w-3.5" />
                {language === 'en' ? 'Print / Download PDF' : 'পিন্ট / পিডিএফ ডাউনলোড'}
              </button>
              <button
                onClick={() => setSelectedClientForInvoice(null)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Quick Config details */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 bg-white/5 border border-white/5 p-4 rounded-xl text-xs print:hidden">
            <div>
              <label className="block text-slate-300 font-bold mb-1">{text.invoiceConfig}</label>
              <input 
                type="text" 
                value={invoiceNumber} 
                onChange={(e) => setInvoiceNumber(e.target.value)} 
                className="bg-white/10 border border-white/10 text-white rounded p-2.5 w-full font-mono outline-none focus:border-indigo-400 focus:bg-white/15"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">{language === 'en' ? 'Issue Date' : 'ইস্যু তারিখ'}</label>
              <input 
                type="date" 
                value={invoiceDate} 
                onChange={(e) => setInvoiceDate(e.target.value)} 
                className="bg-white/10 border border-white/10 text-white rounded p-2.5 w-full font-mono outline-none focus:border-indigo-400 focus:bg-white/15"
              />
            </div>
          </div>

          {/* Actual Invoice Sheet */}
          <div className="border border-slate-105 p-8 rounded-xl max-w-3xl mx-auto space-y-6 shadow-sm bg-white print:border-none print:shadow-none print:p-0">
            {/* Invoice Top Header */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-black text-slate-900 uppercase font-mono tracking-wider">{settings.agencyName}</h1>
                <p className="text-xs text-slate-500 mt-1 whitespace-pre-wrap">
                  {settings.address}<br />
                  Email: {settings.email}<br />
                  Phone: {settings.phone}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-slate-900 font-mono">INVOICE</div>
                <p className="text-xs text-slate-500 mt-2 font-mono">
                  <strong>No:</strong> {invoiceNumber}<br />
                  <strong>Date:</strong> {invoiceDate}
                </p>
              </div>
            </div>

            <hr className="border-slate-120" />

            {/* Billed To / Company */}
            <div className="grid grid-cols-2 gap-6 text-xs text-slate-700">
              <div>
                <h5 className="font-semibold text-slate-400 uppercase tracking-wider font-mono mb-2">BILLED TO:</h5>
                <p className="font-bold text-slate-800 text-sm">{selectedClientForInvoice.companyName}</p>
                <p className="mt-1 text-slate-500">
                  Attn: {selectedClientForInvoice.name}<br />
                  Email: {selectedClientForInvoice.email}<br />
                  Phone: {selectedClientForInvoice.phone}
                </p>
              </div>
              <div className="text-right">
                <h5 className="font-semibold text-slate-400 uppercase tracking-wider font-mono mb-2">PAYMENT METHOD:</h5>
                <p className="text-slate-600 leading-relaxed font-mono whitespace-pre-wrap">
                  {settings.paymentDetails || 'Bank Wire Transfer / BKash Ledger'}
                </p>
              </div>
            </div>

            {/* Invoice items */}
            <div className="border border-slate-100 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-medium font-mono uppercase">
                    <th className="p-3">{language === 'en' ? 'Item / Description' : 'আইটেম বিবরণী'}</th>
                    <th className="p-3 text-right">{language === 'en' ? 'Price' : 'মূল্য'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3">
                      <span className="font-bold text-slate-800 block text-sm">{selectedClientForInvoice.projectName}</span>
                      <span className="text-[11px] text-gray-400 block mt-0.5">{selectedClientForInvoice.notes || 'IT Technical Services contract deliverables.'}</span>
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-slate-800">{currencySymbol}{selectedClientForInvoice.totalBudget.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Accounts Summary calculations */}
            <div className="flex justify-end pt-4">
              <div className="w-64 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono text-slate-800 font-bold">{currencySymbol}{selectedClientForInvoice.totalBudget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Amount Paid / Advanced:</span>
                  <span className="font-mono">-{currencySymbol}{selectedClientForInvoice.paidAmount.toLocaleString()}</span>
                </div>
                <hr className="border-slate-100" />
                <div className="flex justify-between font-bold text-slate-900 text-sm bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span>Total Dues Outstanding:</span>
                  <span className="font-mono text-amber-600">{currencySymbol}{selectedClientForInvoice.dueAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 leading-relaxed text-center pt-6 border-t border-slate-100 font-mono">
              Thank you for trusting {settings.agencyName} for your software development solutions. <br />
              Generated automatically on BizFlow ERP Cloud. Built in Bangladesh.
            </div>
          </div>
        </div>
      )}

      {/* Onboard client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in text-xs">
          <div className="bg-[#151c2e]/95 backdrop-blur-2xl border border-white/10 rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
            <h3 className="text-lg font-black text-white mb-4">{text.addClientTitle}</h3>
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
            <form onSubmit={handleAddNewClientSubmit} className="space-y-4 text-xs mt-2">
              <div>
                <label className="block font-bold text-slate-300 mb-1">{text.companyName} *</label>
                <input 
                  type="text" 
                  required 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white placeholder-slate-400 outline-none focus:border-indigo-400 focus:bg-white/10 transition-all"
                  placeholder="e.g. Dhaka Food Ltd."
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">{text.projName} *</label>
                <input 
                  type="text" 
                  required 
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white placeholder-slate-400 outline-none focus:border-indigo-400 focus:bg-white/10 transition-all"
                  placeholder="e.g. Delivery Mobile Application"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">{text.clientName} *</label>
                  <input 
                    type="text" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white placeholder-slate-400 outline-none focus:border-indigo-400 focus:bg-white/10 transition-all"
                    placeholder="e.g. Mr. Hashem"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">{text.budget} *</label>
                  <input 
                    type="number" 
                    required 
                    value={totalBudget || ''}
                    onChange={(e) => setTotalBudget(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white placeholder-slate-400 outline-none focus:border-indigo-400 focus:bg-white/10 transition-all font-mono"
                    placeholder="e.g. 5000"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">{text.email}</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white placeholder-slate-400 outline-none focus:border-indigo-400 focus:bg-white/10 transition-all"
                    placeholder="name@company.com"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">{text.phone}</label>
                  <input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white placeholder-slate-400 outline-none focus:border-indigo-400 focus:bg-white/10 transition-all font-mono"
                    placeholder="+88017XXXXXXXX font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1 font-sans">Contract Scope Outline</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-white placeholder-slate-400 outline-none focus:border-indigo-400 focus:bg-white/10 transition-all text-xs"
                  placeholder="Specific client terms & integrations..."
                  rows={2}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-750 text-white font-bold py-3 px-4 rounded-xl transition shadow-lg shadow-indigo-505/20 cursor-pointer text-sm"
              >
                {text.submitBtn}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Collect / Record incoming Payment Modal */}
      {selectedClientForPayment && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#151c2e]/95 backdrop-blur-2xl border border-white/10 rounded-3xl w-full max-w-sm p-6 shadow-2xl relative text-xs">
            <h3 className="text-lg font-black text-white mb-1">{text.recPayment}</h3>
            <p className="text-xs text-indigo-400 font-bold mb-4">{selectedClientForPayment.companyName} ({selectedClientForPayment.projectName})</p>
            <button 
              onClick={() => setSelectedClientForPayment(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
            <form onSubmit={handleRecordPaymentSubmit} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-300 mb-1">{text.amount}</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2 py-0.5 text-slate-400 font-bold font-mono">{currencySymbol}</span>
                  <input 
                    type="number" 
                    required 
                    min={1}
                    max={selectedClientForPayment.dueAmount}
                    value={paymentAmount || ''}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-2.5 outline-none focus:border-indigo-400 focus:bg-white/10 text-white placeholder-slate-450 font-mono font-bold"
                    placeholder={`Max: ${selectedClientForPayment.dueAmount}`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  {language === 'en' ? 'Income Category' : 'আয় / পেমেন্টের ধরন'} *
                </label>
                <select
                  required
                  value={paymentCategory}
                  onChange={(e) => setPaymentCategory(e.target.value)}
                  className="w-full bg-[#191f35] border border-white/10 text-white rounded-xl p-2.5 outline-none focus:border-indigo-400"
                >
                  {(settings.incomeCategories || [
                    'Milestone Payment (কাজের কিস্তি পেমেন্ট)',
                    'Support & AMC / Maintenance (বার্ষিক রক্ষণাবেক্ষণ)',
                    'Other Inflow Revenues (অন্যান্য বিবিধ আয়)'
                  ]).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  {language === 'en' ? 'Deposit Destination' : 'কোথায় জমা হবে (ব্যাংক/ক্যাশ)'} *
                </label>
                <select
                  required
                  value={paymentBankAccountId}
                  onChange={(e) => setPaymentBankAccountId(e.target.value)}
                  className="w-full bg-[#191f35] border border-white/10 text-white rounded-xl p-2.5 outline-none focus:border-indigo-400"
                >
                  <option value="">{language === 'en' ? '-- Select Vault --' : '-- ব্যাংক/ক্যাশ অ্যাকাউন্ট নির্বাচন করুন --'}</option>
                  {bankAccounts.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.accountName} ({currencySymbol}{b.balance.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">{text.note}</label>
                <input 
                  type="text" 
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 outline-none focus:border-indigo-400 focus:bg-white/10 text-white placeholder-slate-500"
                  placeholder="e.g. Milestone 2 bank wire DBBL"
                />
              </div>
              <div className="flex justify-end gap-2.5 pt-2 font-bold">
                <button 
                  type="button"
                  onClick={() => setSelectedClientForPayment(null)}
                  className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-300 hover:bg-white/10 transition"
                >
                  {text.close}
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/30 rounded-xl transition"
                >
                  {text.submitPay}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
