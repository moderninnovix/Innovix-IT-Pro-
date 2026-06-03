import React, { useState } from 'react';
import { BankAccount, Transaction, Client } from '../types';
import { 
  Building, 
  Wallet, 
  Coins, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  History, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  DollarSign, 
  ArrowRight,
  FileSpreadsheet
} from 'lucide-react';

interface AccountingViewProps {
  bankAccounts: BankAccount[];
  transactions: Transaction[];
  clients: Client[];
  language: 'en' | 'bn';
  onAddBankAccount: (newAccount: Omit<BankAccount, 'id'>) => void;
  onRecordExpense: (expense: Omit<Transaction, 'id' | 'type'>) => void;
  onTransferFunds: (sourceId: string, destinationId: string, amount: number, note: string) => void;
  currencySymbol: string;
  expenseCategories?: string[];
}

export default function AccountingView({
  bankAccounts,
  transactions,
  clients,
  language,
  onAddBankAccount,
  onRecordExpense,
  onTransferFunds,
  currencySymbol,
  expenseCategories = [
    'Employee Salaries (কর্মকর্তাদের বেতন)',
    'Server Hosting & Software (ক্লাউড হোস্টিং)',
    'Office Rent & Utilities (অফিস ও বিদ্যুৎ বিল)',
    'Snacks & Entertainment (আপ্যায়ন খরচ)',
    'QA, Devices & Gear (ডিভাইস ও যন্ত্রপাতি)',
    'Business Marketing & Ads (মার্কেটিং)',
    'Others (অন্যান্য বিবিধ)'
  ]
}: AccountingViewProps) {
  
  // Tabs: Lists of banks, expenses, and profit-loss statements
  const [activeSubTab, setActiveSubTab] = useState<'accounts' | 'expenses' | 'transfer' | 'report'>('accounts');

  // Add Bank state
  const [showAddBank, setShowAddBank] = useState(false);
  const [bankName, setBankName] = useState('');
  const [bankType, setBankType] = useState<'Bank' | 'Mobile Banking' | 'Cash'>('Bank');
  const [bankNumber, setBankNumber] = useState('');
  const [bankBranch, setBankBranch] = useState('');
  const [bankInitialBalance, setBankInitialBalance] = useState<number>(0);

  // Add Expense state
  const [expenseAmount, setExpenseAmount] = useState<number>(0);
  const [expenseCategory, setExpenseCategory] = useState(expenseCategories[0] || 'Others (অন্যান্য বিবিধ)');
  const [expenseAccount, setExpenseAccount] = useState('');
  const [expenseNote, setExpenseNote] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);

  // Sync category if dynamic categories list changes
  React.useEffect(() => {
    if (expenseCategories.length > 0 && !expenseCategories.includes(expenseCategory)) {
      setExpenseCategory(expenseCategories[0]);
    }
  }, [expenseCategories]);

  // Funds Transfer states
  const [transferSource, setTransferSource] = useState('');
  const [transferDest, setTransferDest] = useState('');
  const [transferAmt, setTransferAmt] = useState<number>(0);
  const [transferNote, setTransferNote] = useState('');
  const [transferMessage, setTransferMessage] = useState('');

  // Handle bank form submission
  const handleAddBankSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName || bankInitialBalance < 0) return;
    onAddBankAccount({
      accountName: bankName,
      accountType: bankType,
      accountNumber: bankNumber || undefined,
      branchName: bankBranch || undefined,
      balance: bankInitialBalance
    });
    // Reset
    setBankName('');
    setBankType('Bank');
    setBankNumber('');
    setBankBranch('');
    setBankInitialBalance(0);
    setShowAddBank(false);
  };

  // Handle expense form submission
  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (expenseAmount <= 0 || !expenseAccount) return;
    onRecordExpense({
      amount: expenseAmount,
      category: expenseCategory,
      bankAccountId: expenseAccount,
      description: expenseNote || `Overhead expense: ${expenseCategory}`,
      date: expenseDate,
    });
    // Reset
    setExpenseAmount(0);
    setExpenseNote('');
    setExpenseCategory(expenseCategories[0] || 'Others (অন্যান্য বিবিধ)');
    setTransferMessage('Expense recorded.');
    setTimeout(() => setTransferMessage(''), 3000);
  };

  // Handle funds transfer submission
  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferSource || !transferDest || transferAmt <= 0) return;
    if (transferSource === transferDest) {
      alert(language === 'en' ? 'Cannot transfer to the same account.' : 'একই অ্যাকাউন্টে টাকা স্থানান্তর করা অসম্ভব।');
      return;
    }
    const srcAcc = bankAccounts.find(b => b.id === transferSource);
    if (!srcAcc || srcAcc.balance < transferAmt) {
      alert(language === 'en' ? 'Insufficient funds in selected source account.' : 'উৎস অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স নেই।');
      return;
    }
    onTransferFunds(transferSource, transferDest, transferAmt, transferNote || 'Internal transfer');
    // Reset
    setTransferAmt(0);
    setTransferNote('');
    setTransferMessage(language === 'en' ? 'Internal funds transferred successfully.' : 'অ্যাকাউন্ট টু অ্যাকাউন্ট ফান্ড সফলভাবে স্থানান্তরিত হয়েছে।');
    setTimeout(() => setTransferMessage(''), 4000);
  };

  // Profit and Loss calculations
  const totalIncome = transactions.filter(t => t.type === 'Income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'Expense').reduce((acc, t) => acc + t.amount, 0);
  const netProfit = totalIncome - totalExpense;

  // Group expenses by category
  const expenseBreakdown = transactions
    .filter(t => t.type === 'Expense')
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

  // Income break down
  const incomeBreakdown = transactions
    .filter(t => t.type === 'Income')
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

  const text = {
    en: {
      title: 'Company Vault & General Ledger',
      subtitle: 'Oversee physical bank liquidity, record monthly overheads, and run automated P&L statements.',
      tabAccounts: 'Liquid Bank Accounts',
      tabExpenses: 'Record Overhead Expenses',
      tabTransfer: 'A/C Core Transfer',
      tabReport: 'Profit & Loss Statement',
      btnNewAccount: 'Configure Bank/Cash Vault',
      lblBankName: 'Account Name (e.g. Bkash Merchant, DBBL Core)',
      lblBankType: 'Vault Type',
      lblAcNum: 'Account Number (Optional)',
      lblBranch: 'Branch Name (Optional)',
      lblInitBal: 'Opening Balance',
      recentTr: 'Real-time Ledgers',
      income: 'Total Gross Revenues',
      expense: 'Total Overhead Expenses',
      netProfitLabel: 'Net Business Profit',
      netLossLabel: 'Net Business Loss',
      noAccounts: 'No bank nodes registered yet.'
    },
    bn: {
      title: 'কোম্পানি ক্যাশ বুক ও জেনারেল লেজার',
      subtitle: 'আপনার ব্যাংকের ব্যালেন্স, মোবাইল ব্যাংকিং হিসেব রাখুন, খরচ যুক্ত করুন এবং লাভ ও ক্ষতি খতিয়ান বিশ্লেষণ করুন।',
      tabAccounts: 'ব্যাংক হিসাব ও নগদ ক্যাশ',
      tabExpenses: 'অফিস খরচ রেকর্ড করুন',
      tabTransfer: 'অ্যাকাউন্ট ট্রান্সফার',
      tabReport: 'লাভ-ক্ষতি রিপোর্ট (P&L)',
      btnNewAccount: 'নতুন ব্যাংক / ক্যাশ অ্যাকাউন্ট',
      lblBankName: 'অ্যাকাউন্টের নাম (যেমন: ব্র্যাক ব্যাংক, বিকাশ বিজনেস)',
      lblBankType: 'অ্যাকাউন্টের ধরণ',
      lblAcNum: 'ব্যাংক হিসাব নম্বর',
      lblBranch: 'শাখার নাম',
      lblInitBal: 'প্রারম্ভিক জমা',
      recentTr: 'আর্থিক লেনদেন ইতিহাস',
      income: 'মোট সংগৃহীত আয় (Income)',
      expense: 'মোট অফিসিয়াল ব্যয় (Expense)',
      netProfitLabel: 'চলতি নিট লাভ (Profit)',
      netLossLabel: 'চলতি নিট ক্ষতি (Loss)',
      noAccounts: 'কোনো ব্যাংক অ্যাকাউন্ট যুক্ত করা হয়নি।'
    }
  }[language];

  return (
    <div className="space-y-6 text-xs">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-5 gap-3">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Building className="h-6 w-6 text-indigo-400" />
            {text.title}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {text.subtitle}
          </p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 shrink-0">
          <button
            onClick={() => setActiveSubTab('accounts')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeSubTab === 'accounts' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            {text.tabAccounts}
          </button>
          <button
            onClick={() => setActiveSubTab('expenses')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeSubTab === 'expenses' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            {text.tabExpenses}
          </button>
          <button
            onClick={() => setActiveSubTab('transfer')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeSubTab === 'transfer' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            {text.tabTransfer}
          </button>
          <button
            onClick={() => setActiveSubTab('report')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeSubTab === 'report' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            {text.tabReport}
          </button>
        </div>
      </div>

      {transferMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 p-3 rounded-xl animate-fade-in font-bold font-mono">
          {transferMessage}
        </div>
      )}

      {/* CORE SUBTABS DEFINITION */}

      {/* tab 1: Bank list & accounts */}
      {activeSubTab === 'accounts' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              {language === 'en' ? 'Registered Ledger Vaults' : 'সচল ব্যাংক ও ক্যাশ খতিয়ান সমূহ'}
            </h3>
            <button
              onClick={() => setShowAddBank(!showAddBank)}
              className="flex items-center gap-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-2 px-3.5 rounded-xl transition text-xs shadow-md shadow-indigo-500/10"
            >
              <Plus className="h-4.5 w-4.5" />
              {text.btnNewAccount}
            </button>
          </div>

          {showAddBank && (
            <form onSubmit={handleAddBankSubmit} className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-4 animate-fade-in max-w-xl">
              <h4 className="text-sm font-bold text-indigo-300 border-b border-white/5 pb-2">
                {language === 'en' ? 'Configure Bank Node' : 'নতুন ব্যাংক হিসাব বিবরণী'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">{text.lblBankName} *</label>
                  <input
                    type="text"
                    required
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl p-2.5 outline-none focus:border-indigo-400 focus:bg-white/10"
                    placeholder="e.g. DBBL Current, bkash Agent"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">{text.lblBankType} *</label>
                  <select
                    value={bankType}
                    onChange={(e) => setBankType(e.target.value as any)}
                    className="w-full bg-white/10 border border-white/10 text-white rounded-xl p-2.5 outline-none focus:border-indigo-400"
                  >
                    <option value="Bank">Bank AC (ব্যাংক অ্যাকাউন্ট)</option>
                    <option value="Mobile Banking">Mobile Wallet (বিকাশ / নগদ)</option>
                    <option value="Cash">Physical Cash (নগদ ক্যাশ বক্স)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">{text.lblAcNum}</label>
                  <input
                    type="text"
                    value={bankNumber}
                    onChange={(e) => setBankNumber(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl p-2.5 outline-none font-mono focus:border-indigo-400"
                    placeholder="e.g. 151.110.4293"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">{text.lblBranch}</label>
                  <input
                    type="text"
                    value={bankBranch}
                    onChange={(e) => setBankBranch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl p-2.5 outline-none focus:border-indigo-400"
                    placeholder="e.g. Uttara Branch"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">{text.lblInitBal} *</label>
                  <input
                    type="number"
                    required
                    value={bankInitialBalance || ''}
                    onChange={(e) => setBankInitialBalance(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl p-2.5 outline-none font-mono focus:border-indigo-400 font-bold"
                    placeholder="e.g. 50000"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 text-xs font-bold pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddBank(false)}
                  className="px-4 py-2 border border-white/10 rounded-xl text-slate-300 hover:bg-white/5"
                >
                  {language === 'en' ? 'Cancel' : 'বাতিল'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl"
                >
                  {language === 'en' ? 'Save Node' : 'সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          )}

          {/* Liquid balances block */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bankAccounts.length === 0 ? (
              <div className="col-span-full border border-dashed border-white/10 p-8 rounded-2xl text-center text-slate-450 italic">
                {text.noAccounts}
              </div>
            ) : (
              bankAccounts.map(ba => {
                const isCash = ba.accountType === 'Cash';
                const isMobile = ba.accountType === 'Mobile Banking';
                return (
                  <div key={ba.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-white/15 transition shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-all">
                      {isCash ? (
                        <Coins className="h-16 w-16 text-indigo-400" />
                      ) : isMobile ? (
                        <Wallet className="h-16 w-16 text-indigo-400" />
                      ) : (
                        <Building className="h-16 w-16 text-indigo-400" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 bg-[#6366f1]/15 rounded-xl border border-indigo-500/20 flex items-center justify-center text-indigo-300 font-mono">
                        {isCash ? <Coins className="h-5 w-5" /> : isMobile ? <Wallet className="h-5 w-5" /> : <Building className="h-5 w-5" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{ba.accountName}</h4>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest leading-none">
                          {ba.accountType} {ba.branchName ? `• ${ba.branchName}` : ''}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5">
                      <p className="text-[10px] text-slate-400 uppercase font-mono">{language === 'en' ? 'Liquid Balance' : 'চলতি ক্যাশ ব্যালেন্স'}</p>
                      <p className="text-2xl font-black font-mono text-emerald-400 mt-1">
                        {currencySymbol}{ba.balance.toLocaleString()}
                      </p>
                    </div>

                    {ba.accountNumber && (
                      <span className="block mt-2 font-mono text-[10px] text-slate-400 tracking-wider">
                        A/C: {ba.accountNumber}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Ledger transaction logs view */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="h-4.5 w-4.5 text-indigo-400" />
              {text.recentTr}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-200">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 font-bold font-mono">
                    <th className="p-3">{language === 'en' ? 'Particulars / Description' : 'লেনদেনের বিবরণ'}</th>
                    <th className="p-3">{language === 'en' ? 'Type' : 'ধরণ'}</th>
                    <th className="p-3">{language === 'en' ? 'Paid Vault node' : 'পরিশোধ মাধ্যম'}</th>
                    <th className="p-3">{language === 'en' ? 'Date' : 'তারিখ'}</th>
                    <th className="p-3 text-right">{language === 'en' ? 'Revenues' : 'টাকার পরিমাণ'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {transactions.map(t => {
                    const acc = bankAccounts.find(a => a.id === t.bankAccountId);
                    return (
                      <tr key={t.id} className="hover:bg-white/5 transition-all text-slate-300">
                        <td className="p-3 font-semibold text-white">
                          <span className="block">{t.description}</span>
                          <span className="text-[10px] text-slate-400 font-mono italic mt-0.5">{t.category}</span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded border text-[10px] uppercase font-mono font-bold ${
                            t.type === 'Income' 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                            {t.type === 'Income' ? (language === 'en' ? 'Income' : 'আয়') : (language === 'en' ? 'Expense' : 'ব্যয়')}
                          </span>
                        </td>
                        <td className="p-3 font-semibold font-mono text-slate-300">
                          {acc ? acc.accountName : (t.paymentMethod || 'Main Vault')}
                        </td>
                        <td className="p-3 font-mono text-slate-400">{t.date}</td>
                        <td className={`p-3 text-right font-black font-mono ${t.type === 'Income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {t.type === 'Income' ? '+' : '-'}{currencySymbol}{t.amount.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* tab 2: Expense entry form */}
      {activeSubTab === 'expenses' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Submission Panel */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl space-y-4 lg:col-span-1 border border-indigo-505/10">
            <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2">
              {language === 'en' ? 'Record New Office Expense' : 'নতুন অফিস খরচ যুক্ত করুন'}
            </h3>
            
            <form onSubmit={handleExpenseSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">{language === 'en' ? 'Expense Amount' : 'টাকার পরিমাণ ({currencySymbol})'} *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2 py-0.5 text-slate-400 font-bold font-mono">{currencySymbol}</span>
                  <input
                    type="number"
                    required
                    min={1}
                    value={expenseAmount || ''}
                    onChange={(e) => setExpenseAmount(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-2.5 outline-none text-white focus:border-indigo-400 focus:bg-white/10 font-bold font-mono"
                    placeholder="e.g. 1500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">{language === 'en' ? 'Expense Category' : 'ব্যয়ের ক্যাটাগরি'} *</label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                  className="w-full bg-white/10 border border-white/10 text-white rounded-xl p-2.5 outline-none focus:border-indigo-400"
                >
                  {expenseCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">{language === 'en' ? 'Select Paid Vault Node' : 'যে ব্যাংক অ্যাকাউন্ট থেকে দিলেন'} *</label>
                <select
                  required
                  value={expenseAccount}
                  onChange={(e) => setExpenseAccount(e.target.value)}
                  className="w-full bg-white/10 border border-white/10 text-white rounded-xl p-2.5 outline-none focus:border-indigo-400"
                >
                  <option value="">{language === 'en' ? '-- Choose Source Vault --' : '-- অ্যাকাউন্ট নির্বাচন করুন --'}</option>
                  {bankAccounts.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.accountName} (Bal: {currencySymbol}{b.balance.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">{language === 'en' ? 'Date' : 'ব্যয়ের তারিখ'} *</label>
                  <input
                    type="date"
                    required
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl p-2.5 font-mono outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">{language === 'en' ? 'Particulars Note' : 'লেনদেন রেফারেন্স / বিবরণ'}</label>
                <input
                  type="text"
                  value={expenseNote}
                  onChange={(e) => setExpenseNote(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 outline-none text-white focus:border-indigo-400"
                  placeholder="e.g. Uttara DBBL Branch rent payment"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-rose-500 to-indigo-650 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition"
              >
                {language === 'en' ? 'Log Ledger Expense' : 'হিসাব বইয়ে খরচ জমা করুন'}
              </button>
            </form>
          </div>

          {/* Quick List Expenses tracked */}
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>{language === 'en' ? 'Recent Ledger Expenses Paid' : 'অফিস খরচের প্রজেক্ট খতিয়ান'}</span>
            </h3>

            <div className="divide-y divide-white/5">
              {transactions.filter(t => t.type === 'Expense').length === 0 ? (
                <p className="text-xs text-slate-400 italic py-6 text-center">{language === 'en' ? 'No expense logs tracked yet.' : 'এখনো কোনো অফিস খরচের হিসাব নেই।'}</p>
              ) : (
                transactions.filter(t => t.type === 'Expense').map(e => {
                  const bNode = bankAccounts.find(bk => bk.id === e.bankAccountId);
                  return (
                    <div key={e.id} className="py-3 flex justify-between items-start gap-4">
                      <div>
                        <div className="font-bold text-white text-sm">{e.description}</div>
                        <div className="flex gap-2 items-center text-[10px] text-slate-400 font-mono mt-1">
                          <span className="bg-white/5 px-2 py-0.5 rounded border border-white/5">{e.category}</span>
                          <span>Account: {bNode ? bNode.accountName : 'Cash Vault'}</span>
                          <span>Date: {e.date}</span>
                        </div>
                      </div>
                      <span className="font-black text-rose-455 font-mono text-sm shrink-0">
                        -{currencySymbol}{e.amount.toLocaleString()}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* tab 3: Account Transfers */}
      {activeSubTab === 'transfer' && (
        <div className="max-w-xl mx-auto bg-white/5 border border-white/10 p-6 rounded-3xl shadow-xl space-y-6">
          <div className="text-center space-y-1 pb-3 border-b border-white/5">
            <h3 className="text-base font-black text-white flex justify-center items-center gap-2">
              <Coins className="h-5 w-5 text-indigo-400 animate-spin" />
              {language === 'en' ? 'Inter-Vault Core Fund Transfer' : 'ব্যাংক ও ক্যাশ অ্যাকাউন্ট টু অ্যাকাউন্ট ট্রান্সফার'}
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {language === 'en' ? 'Atomically transfer reserves from cash registers to digital banking systems or mobile nodes.' : 'ব্যাংক থেকে বিকাশে বা ক্যাশ ড্রয়ার থেকে ব্র্যাক ব্যাংকে ফান্ড স্থানান্তরের জন্য এটি ব্যবহার করুন।'}
            </p>
          </div>

          <form onSubmit={handleTransferSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">{language === 'en' ? 'Source Vault' : 'উৎস অ্যাকাউন্ট (কোথা থেকে টাকা বের হবে)'} *</label>
                <select
                  required
                  value={transferSource}
                  onChange={(e) => setTransferSource(e.target.value)}
                  className="w-full bg-white/10 border border-white/10 text-white rounded-xl p-3 outline-none focus:border-indigo-400"
                >
                  <option value="">{language === 'en' ? '-- Choose Source --' : '-- উৎস নির্বাচন করুন --'}</option>
                  {bankAccounts.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.accountName} (Balance: {currencySymbol}{b.balance.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">{language === 'en' ? 'Destination Vault' : 'গন্তব্য অ্যাকাউন্ট (কোথায় টাকা ঢুকবে)'} *</label>
                <select
                  required
                  value={transferDest}
                  onChange={(e) => setTransferDest(e.target.value)}
                  className="w-full bg-white/10 border border-white/10 text-white rounded-xl p-3 outline-none focus:border-indigo-400"
                >
                  <option value="">{language === 'en' ? '-- Choose Destination --' : '-- গন্তব্য নির্বাচন করুন --'}</option>
                  {bankAccounts.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.accountName} (Balance: {currencySymbol}{b.balance.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1.5">{language === 'en' ? 'Transfer Amount' : 'স্থানান্তরের পরিমাণ'} *</label>
              <div className="relative">
                <span className="absolute left-3.5 top-2 py-0.5 text-slate-400 font-bold font-mono">{currencySymbol}</span>
                <input
                  type="number"
                  required
                  min={1}
                  value={transferAmt || ''}
                  onChange={(e) => setTransferAmt(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-3 outline-none text-white focus:border-indigo-400 focus:bg-white/10 font-bold font-mono text-base"
                  placeholder="e.g. 5000"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1.5">{language === 'en' ? 'Particulars Reference' : 'লেনদেন বিবরণী / ধরণ'}</label>
              <input
                type="text"
                value={transferNote}
                onChange={(e) => setTransferNote(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none text-white focus:border-indigo-400 focus:bg-white/10"
                placeholder="e.g. Deposited cash to DBBL accounts or bkash cashed in"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl transition shadow-lg shrink-0 flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              Transfer Funds Across Accounts
              <ArrowRight className="h-4.5 w-4.5" />
            </button>
          </form>
        </div>
      )}

      {/* tab 4: Profit & Loss Statement report */}
      {activeSubTab === 'report' && (
        <div className="space-y-6">
          {/* Big P&L visual status metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Income indicator card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex justify-between items-center relative overflow-hidden">
              <div className="space-y-1">
                <span className="text-slate-400 font-bold block">{text.income}</span>
                <span className="text-2xl font-black font-mono text-emerald-400">{currencySymbol}{totalIncome.toLocaleString()}</span>
              </div>
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>

            {/* Expense indicator card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex justify-between items-center relative overflow-hidden">
              <div className="space-y-1">
                <span className="text-slate-400 font-bold block">{text.expense}</span>
                <span className="text-2xl font-black font-mono text-rose-400">{currencySymbol}{totalExpense.toLocaleString()}</span>
              </div>
              <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <TrendingDown className="h-5 w-5" />
              </div>
            </div>

            {/* Net margin Profit / Loss */}
            <div className={`border rounded-2xl p-5 flex justify-between items-center relative overflow-hidden ${
              netProfit >= 0 
                ? 'bg-emerald-500/5 border-emerald-500/25 text-white' 
                : 'bg-rose-500/5 border-rose-500/25 text-white'
            }`}>
              <div className="space-y-1">
                <span className="text-slate-300 font-bold block">
                  {netProfit >= 0 ? text.netProfitLabel : text.netLossLabel}
                </span>
                <span className={`text-2xl font-black font-mono ${
                  netProfit >= 0 ? 'text-emerald-400' : 'text-rose-450'
                }`}>
                  {netProfit >= 0 ? '+' : ''}{currencySymbol}{netProfit.toLocaleString()}
                </span>
              </div>
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                netProfit >= 0 
                  ? 'bg-emerald-500/10 text-emerald-400' 
                  : 'bg-rose-500/10 text-rose-400'
              }`}>
                {netProfit >= 0 ? <TrendingUp className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
              </div>
            </div>
          </div>

          {/* Section details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {/* Income Streams Ledger Categorized breakdown */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl space-y-4">
              <h4 className="text-xs font-bold font-mono tracking-widest uppercase text-emerald-300 border-b border-white/5 pb-2">
                {language === 'en' ? 'Gross Revenue Category Breakdown' : 'আয় প্রজেক্ট ক্যাটাগরি বিশ্লেষণ (Inflow)'}
              </h4>
              <div className="space-y-3.5">
                {Object.keys(incomeBreakdown).length === 0 ? (
                  <p className="text-xs text-slate-405 italic py-4">{language === 'en' ? 'No revenue entries recorded.' : 'কোনো আয়ের রেকর্ড খুঁজে পাওয়া যায়নি।'}</p>
                ) : (
                  Object.entries(incomeBreakdown).map(([category, amount]) => {
                    const pct = totalIncome > 0 ? Math.round((amount / totalIncome) * 100) : 0;
                    return (
                      <div key={category} className="space-y-1.5">
                        <div className="flex justify-between text-xs text-slate-200">
                          <span className="font-semibold">{category}</span>
                          <span className="font-mono text-emerald-450 font-bold">{currencySymbol}{amount.toLocaleString()} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-1.5 border border-white/5">
                          <div 
                            className="bg-emerald-550 h-1.5 rounded-full" 
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Expense Streams Ledger Categorized breakdown */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl space-y-4">
              <h4 className="text-xs font-bold font-mono tracking-widest uppercase text-rose-300 border-b border-white/5 pb-2">
                {language === 'en' ? 'Overhead Expense Category Breakdown' : 'ব্যয় বিশ্লেষণ এবং বাজেট প্রগ্রেস (Outflow)'}
              </h4>
              <div className="space-y-3.5">
                {Object.keys(expenseBreakdown).length === 0 ? (
                  <p className="text-xs text-slate-405 italic py-4">{language === 'en' ? 'No office overhead expenses tracked.' : 'কোনো খরচের রেকর্ড খুঁজে পাওয়া যায়নি।'}</p>
                ) : (
                  Object.entries(expenseBreakdown).map(([category, amount]) => {
                    const pct = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;
                    return (
                      <div key={category} className="space-y-1.5">
                        <div className="flex justify-between text-xs text-slate-200">
                          <span className="font-semibold">{category}</span>
                          <span className="font-mono text-rose-450 font-bold">{currencySymbol}{amount.toLocaleString()} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-1.5 border border-white/5">
                          <div 
                            className="bg-rose-500 h-1.5 rounded-full" 
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Core financial suggestions from Advisor block */}
          <div className="bg-[#151c2e]/80 border border-white/5 p-5 rounded-3xl flex items-start gap-4">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 rounded-2xl shrink-0 animate-pulse">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div className="space-y-1 text-slate-300 font-mono text-[11px] leading-relaxed">
              <h5 className="font-bold text-white uppercase text-xs font-sans tracking-wide">
                BizFlow Core Audit Insights
              </h5>
              <p>
                {netProfit >= 0 
                  ? `Your business is operating at a Net Margin of +${totalIncome > 0 ? Math.round((netProfit / totalIncome) * 100) : 0}%. High liquid asset solvency detected inside your registered banks. Keep collecting milestone dues for maximal compounding.`
                  : 'Operating at negative net capital flow for this monthly cycle. Reduce overhead expenses, evaluate low budget service packages, and prompt immediate AI smart reminders to clients with outstanding dues.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
