import React, { useState } from 'react';
import { AppSettings } from '../types';
import { Save, ShieldAlert, Sliders, Globe, HelpCircle, ToggleLeft, ToggleRight, Building, Mail, Phone, MapPin, DollarSign, Lock, Plus, Trash2 } from 'lucide-react';

interface SettingsViewProps {
  settings: AppSettings;
  onSaveSettings: (updated: AppSettings) => void;
  language: 'en' | 'bn';
}

export default function SettingsView({ settings, onSaveSettings, language }: SettingsViewProps) {
  const [agencyName, setAgencyName] = useState(settings.agencyName);
  const [agencyLogoInitials, setAgencyLogoInitials] = useState(settings.agencyLogoInitials);
  const [contactPerson, setContactPerson] = useState(settings.contactPerson);
  const [email, setEmail] = useState(settings.email);
  const [phone, setPhone] = useState(settings.phone);
  const [address, setAddress] = useState(settings.address);
  const [currency, setCurrency] = useState<Omit<AppSettings['currency'], never>>(settings.currency);
  const [paymentDetails, setPaymentDetails] = useState(settings.paymentDetails);
  const [showCustomLoginSim, setShowCustomLoginSim] = useState(settings.showCustomLoginSim);
  const [filePin, setFilePin] = useState(settings.filePinCode || '1234');

  const [expenseCats, setExpenseCats] = useState<string[]>(() => settings.expenseCategories || [
    'Employee Salaries (কর্মকর্তাদের বেতন)',
    'Server Hosting & Software (ক্লাউড হোস্টিং)',
    'Office Rent & Utilities (অফিস ও বিদ্যুৎ বিল)',
    'Snacks & Entertainment (আপ্যায়ন খরচ)',
    'QA, Devices & Gear (ডিভাইস ও যন্ত্রপাতি)',
    'Business Marketing & Ads (মার্কেটিং)',
    'Others (অন্যান্য বিবিধ)'
  ]);
  const [incomeCats, setIncomeCats] = useState<string[]>(() => settings.incomeCategories || [
    'Milestone Payment (কাজের কিস্তি পেমেন্ট)',
    'Support & AMC / Maintenance (বার্ষিক রক্ষণাবেক্ষণ)',
    'Software Development Contract (সফটওয়্যার উন্নয়ন)',
    'Google AdSense / Youtube Revenues (বিজ্ঞাপন থেকে আয়)',
    'IT Operations Consulting (পরামর্শ ফি)',
    'Other Inflow Revenues (অন্যান্য বিবিধ আয়)'
  ]);

  const [newExpenseCat, setNewExpenseCat] = useState('');
  const [newIncomeCat, setNewIncomeCat] = useState('');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddExpenseCategory = () => {
    if (!newExpenseCat.trim()) return;
    if (expenseCats.includes(newExpenseCat.trim())) return;
    setExpenseCats([...expenseCats, newExpenseCat.trim()]);
    setNewExpenseCat('');
  };

  const handleDeleteExpenseCategory = (catToDelete: string) => {
    if (expenseCats.length <= 1) {
      alert(language === 'en' ? 'You must keep at least one category.' : 'কমপক্ষে একটি ক্যাটাগরি অবশ্যই রাখতে হবে।');
      return;
    }
    setExpenseCats(expenseCats.filter(c => c !== catToDelete));
  };

  const handleAddIncomeCategory = () => {
    if (!newIncomeCat.trim()) return;
    if (incomeCats.includes(newIncomeCat.trim())) return;
    setIncomeCats([...incomeCats, newIncomeCat.trim()]);
    setNewIncomeCat('');
  };

  const handleDeleteIncomeCategory = (catToDelete: string) => {
    if (incomeCats.length <= 1) {
      alert(language === 'en' ? 'You must keep at least one category.' : 'কমপক্ষে একটি ক্যাটাগরি অবশ্যই রাখতে হবে।');
      return;
    }
    setIncomeCats(incomeCats.filter(c => c !== catToDelete));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate 4-digit numeric PIN constraint
    if (!/^\d{4}$/.test(filePin)) {
      alert(language === 'en' ? 'File PIN Code must be exactly 4 digits!' : 'ফাইল ম্যানেজার পিন কোড অবশ্যই ৪টি সংখ্যা হতে হবে!');
      return;
    }

    onSaveSettings({
      agencyName,
      agencyLogoInitials,
      contactPerson,
      email,
      phone,
      address,
      currency,
      paymentDetails,
      showCustomLoginSim,
      expenseCategories: expenseCats,
      incomeCategories: incomeCats,
      filePinCode: filePin
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const text = {
    en: {
      header: 'System Preferences & Brand Settings',
      sub: 'Manage custom white-labeled parameters, billing currency, and login portals.',
      btn: 'Save Configuration',
      success: 'All settings saved successfully! Core dashboard, login, and invoice components updated.',
      secName: 'Company Branding',
      secContact: 'Contact Metadata',
      secBilling: 'Invoice & Currency Presets',
      secPortal: 'Login Security Portal',
      simDesc: 'Show dynamic login screen on initial load using saved company branding details.',
      lblAgencyName: 'Agency/Company Name',
      lblInitials: 'Logo Initials / Logo Text',
      lblPerson: 'Primary Contact Person',
      lblEmail: 'Official Email Support',
      lblPhone: 'Business Hotlines',
      lblAddress: 'Physical Postal Address',
      lblCurrency: 'Primary Ledger Currency',
      lblPaymentDetails: 'Invoice Payment Coordinate Details (Wire instructions, mobile numbers)',
      lblEnableSim: 'Force Simulated Login Screen Lock'
    },
    bn: {
      header: 'সিস্টেম ও ব্র্যান্ড সেটিংস',
      sub: 'কোম্পানির নাম, লোগো, কন্ট্রাক্ট মেটাডেটা, ইনভয়েস বিবরণী এবং কারেন্সি কান্ট্রি কোড পরিবর্তন করুন।',
      btn: 'সেটিংস সংরক্ষণ করুন',
      success: 'অভিনন্দন! আপনার ব্র্যান্ডের তথ্য সফলভাবে সংরক্ষিত হয়েছে। ড্যাশবোর্ড, ইনভয়েস এবং লগইন সর্বত্র চালু হয়েছে।',
      secName: 'কোম্পানি ও ব্র্যান্ডিং তথ্য',
      secContact: 'যোগাযোগ বিবরণী',
      secBilling: 'বিলিং এবং কারেন্সি সেটিংস',
      secPortal: 'সিকিউরিটি গেটওয়ে লগইন',
      simDesc: 'নতুন সেটিংসের ভিত্তিতে সিস্টেমে একটি সাইন-ইন গেটওয়ে সচল থাকবে।',
      lblAgencyName: 'এজেন্সি / কোম্পানির নাম',
      lblInitials: 'লোগো টেক্সট / সংক্ষিপ্ত রুপ',
      lblPerson: 'মূল যোগাযোগ কর্মকর্তা',
      lblEmail: 'সাপোর্ট ইমেইল এড্রেস',
      lblPhone: 'অফিসিয়াল হটলাইন নাম্বার',
      lblAddress: 'অফিসের ঠিকানা (পোস্টাল এড্রেস)',
      lblCurrency: 'প্রধান লেজার কারেন্সি',
      lblPaymentDetails: 'ইনভয়েস পেমেন্ট নির্দেশনা (ব্যাংক হিসাব নম্বর, বিকাশ ইত্যাদি)',
      lblEnableSim: 'সিস্টেম লকইন সিমুলেশন চালু করুন'
    }
  }[language];

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-xs">
      {/* Page Title */}
      <div className="border-b border-white/10 pb-5">
        <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
          <Sliders className="h-6 w-6 text-indigo-400" />
          {text.header}
        </h2>
        <p className="text-sm text-slate-400 mt-1 leading-relaxed">
          {text.sub}
        </p>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 p-4 rounded-2xl flex items-start gap-3 animate-fade-in font-bold">
          <ShieldAlert className="h-5 w-5 shrink-0 text-emerald-450 animate-bounce" />
          <div>
            <p className="font-sans">{text.success}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Company profile branding card */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-white/5 pb-2">
            <Building className="h-4.5 w-4.5 text-indigo-400" />
            {text.secName}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">{text.lblAgencyName}</label>
              <input 
                type="text"
                required
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-indigo-400 focus:bg-white/10 text-white rounded-xl p-3 outline-none transition-all"
                placeholder="e.g. Innovix Technologies BD"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">{text.lblInitials}</label>
              <input 
                type="text"
                required
                maxLength={4}
                value={agencyLogoInitials}
                onChange={(e) => setAgencyLogoInitials(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-indigo-400 focus:bg-white/10 text-white rounded-xl p-3 outline-none transition-all font-mono"
                placeholder="e.g. IT"
              />
            </div>
          </div>
        </div>

        {/* Contact Metadata card */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-white/5 pb-2">
            <Mail className="h-4.5 w-4.5 text-indigo-400" />
            {text.secContact}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">{text.lblPerson}</label>
              <input 
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-indigo-400 focus:bg-white/10 text-white rounded-xl p-3 outline-none transition-all"
                placeholder="e.g. Nafis Fuad"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">{text.lblEmail}</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-indigo-400 focus:bg-white/10 text-white rounded-xl p-3 outline-none transition-all font-mono"
                placeholder="e.g. contact@innovix-bd.com"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">{text.lblPhone}</label>
              <input 
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-indigo-400 focus:bg-white/10 text-white rounded-xl p-3 outline-none transition-all font-mono"
                placeholder="e.g. +8801915998877"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1.5">{text.lblAddress}</label>
            <textarea 
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-indigo-400 focus:bg-white/10 text-white rounded-xl p-3 outline-none transition-all leading-relaxed"
              placeholder="e.g. House 14, Road 5, Sector 1 Uttara, Dhaka, Bangladesh"
            />
          </div>
        </div>

        {/* Currency and Billing preset */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-white/5 pb-2">
            <DollarSign className="h-4.5 w-4.5 text-indigo-400" />
            {text.secBilling}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">{text.lblCurrency}</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setCurrency('BDT')}
                  className={`p-3.5 rounded-xl border font-bold text-center transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    currency === 'BDT' 
                      ? 'bg-indigo-600/35 border-indigo-400 text-white shadow-md' 
                      : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/15'
                  }`}
                >
                  <span className="text-lg">৳ BDT</span>
                  <span className="text-[10px] uppercase font-mono font-normal">Bangla Taka Currency</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`p-3.5 rounded-xl border font-bold text-center transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    currency === 'USD' 
                      ? 'bg-indigo-600/35 border-indigo-400 text-white shadow-md' 
                      : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/15'
                  }`}
                >
                  <span className="text-lg">$ USD</span>
                  <span className="text-[10px] uppercase font-mono font-normal">US Dollar Ledger</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1.5">{text.lblPaymentDetails}</label>
              <textarea 
                rows={3}
                value={paymentDetails}
                onChange={(e) => setPaymentDetails(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-indigo-400 focus:bg-white/10 text-white rounded-xl p-3 outline-none transition-all font-mono leading-relaxed text-[11px]"
                placeholder="A/C: Innovix Technologies, DBBL Branch Uttara, Acct No: 124-2104-555"
              />
            </div>
          </div>
        </div>

        {/* Customizable Categories Section Block */}
        <div className="bg-[#151c2e]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="border-b border-white/5 pb-3">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Sliders className="h-4.5 w-4.5 text-indigo-400" />
              {language === 'en' ? 'Manage Custom Transaction Sectors' : 'কোম্পানির আয় ও ব্যয় ক্যাটাগরি প্যানেল'}
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">
              {language === 'en' 
                ? 'Create, customize, and edit sectors which populate select choices across ledger accounts.'
                : 'সকল ব্যাংকিং লেনদেন ও কোম্পানির অন্যান্য খরচের হিসাব খাতের জন্য ইচ্ছেমতো ক্যাটাগরি এখানে তৈরি বা মুছে দিতে পারেন।'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[11px]">
            {/* Expense Categories */}
            <div className="space-y-3.5 bg-black/15 p-4 rounded-2xl border border-white/5">
              <h4 className="text-xs font-bold text-rose-450 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
                {language === 'en' ? 'Expense Categories (ব্যয় খাত)' : 'ব্যয়ের ক্যাটাগরি সমূহ'}
              </h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={language === 'en' ? 'Add category name...' : 'ব্যয়ের নতুন নাম লিখুন...'}
                  value={newExpenseCat}
                  onChange={(e) => setNewExpenseCat(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-rose-400 text-xs"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddExpenseCategory();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddExpenseCategory}
                  className="bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 w-10 h-10 rounded-xl transition flex items-center justify-center font-bold cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {expenseCats.map((cat) => (
                  <div key={cat} className="flex justify-between items-center bg-white/5 border border-white/5 hover:border-white/15 px-2.5 py-1.5 rounded-lg transition">
                    <span className="text-slate-300 truncate">{cat}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteExpenseCategory(cat)}
                      className="text-slate-400 hover:text-rose-400 transition ml-2 cursor-pointer"
                      title={language === 'en' ? 'Delete' : 'মুছে ফেলুন'}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Income Categories */}
            <div className="space-y-3.5 bg-black/15 p-4 rounded-2xl border border-white/5">
              <h4 className="text-xs font-bold text-emerald-450 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {language === 'en' ? 'Income / Payment Categories (আয় খাত)' : 'আয়ের ক্যাটাগরি সমূহ'}
              </h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={language === 'en' ? 'Add category name...' : 'আয়ের নতুন খাত লিখুন...'}
                  value={newIncomeCat}
                  onChange={(e) => setNewIncomeCat(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-400 text-xs"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddIncomeCategory();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddIncomeCategory}
                  className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 w-10 h-10 rounded-xl transition flex items-center justify-center font-bold cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {incomeCats.map((cat) => (
                  <div key={cat} className="flex justify-between items-center bg-white/5 border border-white/5 hover:border-white/15 px-2.5 py-1.5 rounded-lg transition">
                    <span className="text-slate-300 truncate">{cat}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteIncomeCategory(cat)}
                      className="text-slate-400 hover:text-emerald-400 transition ml-2 cursor-pointer"
                      title={language === 'en' ? 'Delete' : 'মুছে ফেলুন'}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Security gateway signin lock page simulation */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex justify-between items-start border-b border-white/5 pb-3">
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Lock className="h-4.5 w-4.5 text-indigo-400 animate-pulse" />
                {text.secPortal}
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">{text.simDesc}</p>
            </div>
            <button
              type="button"
              onClick={() => setShowCustomLoginSim(!showCustomLoginSim)}
              className="text-slate-300 hover:text-white transition focus:outline-none cursor-pointer"
            >
              {showCustomLoginSim ? (
                <span className="flex items-center gap-1 text-emerald-450 font-bold">
                  <span className="text-[11px] uppercase tracking-wider">{language === 'en' ? 'ACTIVE' : 'চালু'}</span>
                  <ToggleRight className="h-8 w-8 text-emerald-450" />
                </span>
              ) : (
                <span className="flex items-center gap-1 text-slate-500">
                  <span className="text-[11px] uppercase tracking-wider">{language === 'en' ? 'BYPASS' : 'বন্ধ'}</span>
                  <ToggleLeft className="h-8 w-8" />
                </span>
              )}
            </button>
          </div>

          <div className="bg-black/30 border border-white/5 p-4 rounded-2xl flex items-center gap-3.5 text-slate-300 leading-relaxed font-mono text-[11px]">
            <ShieldAlert className="h-5 w-5 text-indigo-300 shrink-0" />
            <span>
              {language === 'en' 
                ? 'When locked, users will enjoy a beautiful, modern secure entry gateway styled with your real logo and corporate branding data.'
                : 'এই ফিচারটি চালু রাখলে অ্যাপে ঢোকার মুহূর্তে একটি সুন্দর সাইন-ইন ইন্টারফেস প্রদর্শিত হবে যেখানে আপনার কোম্পানির নাম ও লোগো দৃশ্যমান থাকবে।'}
            </span>
          </div>

          <div className="border-t border-white/5 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-slate-200 font-black uppercase text-[10px] font-mono tracking-wider">
                {language === 'en' ? 'File Manager 4-Digit Security PIN' : 'ফাইল ম্যানেজার ৪-ডিজিটের সিকিউরিটি পিন'}
              </label>
              <p className="text-[10px] text-slate-450 mt-1 leading-relaxed">
                {language === 'en' 
                  ? 'Configure a 4-digit numeric code to protect corporate software releases and website backup files.'
                  : 'কোম্পানির সকল সফটওয়্যার কোড, ডাটাবেজ ব্যাকআপ ও এন্ট্রি ফাইলসমূহ লকড রাখতে ৪ সংখ্যার পাসওয়ার্ড এটি পরিবর্তন ও নিয়ন্ত্রণ করুন।'}
              </p>
            </div>
            <div>
              <input
                type="text"
                pattern="\d{4}"
                maxLength={4}
                required
                value={filePin}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/\D/g, '');
                  setFilePin(cleaned);
                }}
                className="w-full bg-[#161a29] border border-white/10 hover:border-white/15 focus:border-indigo-400 focus:bg-[#1a1e30] rounded-xl p-3 text-center text-sm font-black tracking-[0.5em] font-mono text-white outline-none"
                placeholder="1234"
              />
              <span className="text-[9px] text-slate-500 font-mono text-center block mt-1.5 uppercase font-bold tracking-wider">
                {language === 'en' ? 'Format: Exactly 4 digits (e.g., 2580)' : 'ফরম্যাট: ঠিক ৪টি সংখ্যা (যেমন: 2580)'}
              </span>
            </div>
          </div>
        </div>

        {/* Action controls submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3.5 px-6 rounded-2xl transition shadow-lg shadow-indigo-505/20 cursor-pointer"
          >
            <Save className="h-4.5 w-4.5" />
            {text.btn}
          </button>
        </div>

      </form>
    </div>
  );
}
