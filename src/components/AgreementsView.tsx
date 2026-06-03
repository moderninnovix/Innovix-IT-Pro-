import React, { useState } from 'react';
import { TeamMember, AppSettings, Agreement } from '../types';
import { 
  FileText, 
  Sparkles, 
  Plus, 
  Users, 
  ShieldCheck, 
  Clock, 
  Trash2, 
  Signature, 
  Printer, 
  Send,
  Loader2,
  CheckCircle,
  FileCheck,
  AlertCircle
} from 'lucide-react';

interface AgreementsViewProps {
  agreements: Agreement[];
  team: TeamMember[];
  settings: AppSettings;
  language: 'en' | 'bn';
  onAddAgreement: (newAg: Agreement) => void;
  onUpdateAgreement: (updated: Agreement) => void;
  onDeleteAgreement: (id: string) => void;
}

export default function AgreementsView({
  agreements,
  team,
  settings,
  language,
  onAddAgreement,
  onUpdateAgreement,
  onDeleteAgreement
}: AgreementsViewProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [selectedAgreement, setSelectedAgreement] = useState<Agreement | null>(null);
  
  // Form states
  const [employeeId, setEmployeeId] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [customTerms, setCustomTerms] = useState('');
  const [argLanguage, setArgLanguage] = useState<'bn' | 'en'>(language || 'bn');
  
  // AI Generation States
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [generationError, setGenerationError] = useState('');
  const [editorText, setEditorText] = useState('');

  // Sign State
  const [adminSignName, setAdminSignName] = useState(settings.contactPerson || '');

  // Select Employee object
  const selectedEmpObj = team.find(t => t.id === employeeId);

  // Filter out admins from employee list if needed
  const remoteStaff = team.filter(t => t.role !== 'Admin');

  const txt = {
    title: language === 'en' ? 'Remote Work Agreements Hub' : 'রিমোট কর্মচুক্তি ও দায়বদ্ধতা হাব',
    subTitle: language === 'en' ? 'Draft, sign, and store legally-bilingual work contracts for remote employees.' : 'সহজে রিমোট ডেভেলপার বা টিম মেম্বারদের জন্য এআই দ্বারা প্রফেশনাল আইনগত ও দায়বদ্ধতা চুক্তিপত্র তৈরি করুন।',
    newBtn: language === 'en' ? 'New Legal Agreement' : 'নতুন কর্মচুক্তি তৈরি করুন',
    activeAg: language === 'en' ? 'Active Agreements' : 'চলতি চুক্তিপত্রসমূহ',
    noAgreements: language === 'en' ? 'No work agreements drafted yet.' : 'এখনো কোনো চুক্তিপত্র বা আইনি দলিল তৈরি করা হয়নি।',
    statusDraft: language === 'en' ? 'Draft' : 'খসড়া',
    statusSent: language === 'en' ? 'Sent' : 'প্রেরিত',
    statusSigned: language === 'en' ? 'Signed Legally' : 'আইনগত সইকৃত',
    statusTerminated: language === 'en' ? 'Terminated' : 'বাতিলকৃত',
    empName: language === 'en' ? 'Employee Name' : 'কর্মকর্তার নাম',
    project: language === 'en' ? 'Assigned Project' : 'অর্পিত প্রজেক্ট',
    roleLabel: language === 'en' ? 'Designated Role' : 'নিবন্ধিত পদবী',
    created: language === 'en' ? 'Created At' : 'তৈরির তারিখ',
    actions: language === 'en' ? 'Operations' : 'কার্যক্রম',
    viewDoc: language === 'en' ? 'View Agreement' : 'চুক্তিপত্র দেখুন',
    aiGenerator: language === 'en' ? 'Zakir\'s AI Agreement Architect' : 'অ্যাডমিন এআই কর্মচুক্তি আর্কিটেক্ট',
    step1: language === 'en' ? '1. Select Remote Employee' : '১. রিমোট কর্মকর্তা নির্বাচন করুন',
    step2: language === 'en' ? '2. Define Project Assignment' : '২. অর্পিত প্রজেক্ট ও বিবরণ',
    step3: language === 'en' ? '3. Feed Agreement Terms & Secrecy Guidance to AI' : '৩. চুক্তি ভঙ্গ, জরিমানা ও গোপনীয়তার বিষয়ে এআই-কে বলুন',
    placeholderTerms: language === 'en' 
      ? 'e.g. He must complete within 2 months. 10% penalty inside ledger accounts for delays or server leaks. All source code must be hand-delivered to official server. 15-day free debugging bug-fix support...' 
      : 'যেমন: তাকে ২ মাসের মধ্যে কাজটি শেষ করতে হবে। বিলম্ব হলে মোট পেমেন্ট থেকে ১০,০০০ টাকা কেটে নেওয়া হবে এবং কোনো কোড বাইরের কারোর সাথে শেয়ার করা যাবে না। সকল সোর্স কোড কোম্পানির হোস্টিংয়ে সরাসরি আপলোড করতে হবে...',
    generateBtn: language === 'en' ? 'Draft Legally via Gemini AI' : 'জেমিনি এআই দ্বারা খসড়া তৈরি করুন',
    generatingText: language === 'en' ? 'Consulting Legal Frameworks via Gemini Real-time ...' : 'জেমিনি ৩.৫ প্রফেশনাল আইনি মডেল দ্বারা কর্মচুক্তিটি খসড়া করা হচ্ছে ...',
    signAdminTitle: language === 'en' ? 'Affix Admin Digital Signature' : 'অ্যাডমিন / কোম্পানির ডিজিটাল স্বাক্ষর প্রদান করুন',
    signAdminBtn: language === 'en' ? 'Legally Sign & Execute' : 'আইনগতভাবে সই ও চালু করুন',
    sendToEmp: language === 'en' ? 'Save and Send to Employee' : 'সংরক্ষণ করুন এবং কর্মকর্তা বিভাগে প্রেরন করুন',
    backBtn: language === 'en' ? 'Back' : 'পেছনে যান',
    signNameLabel: language === 'en' ? 'Your Full Legal Name / Designation' : 'আপনার পূর্ণ আইনি নাম এবং পদবী (স্বাক্ষর)',
    signSuccess: language === 'en' ? 'Successfully Signed' : 'সফলভাবে স্বাক্ষর করা হয়েছে',
    downloadReport: language === 'en' ? 'Print / Save PDF Copy' : 'কাগজের কপি প্রিন্ট / পিডিএফ ডাউনলোড',
    signedStatusDesc: language === 'en' ? 'This document is digital-signed by both contracting parties' : 'এই চুক্তিটি কোম্পানি ও কর্মকর্তা উভয়ের ডিজিটাল স্বাক্ষর দ্বারা আইনত কার্যকর আছে।'
  };

  const handleGenerateViaAI = async () => {
    if (!employeeId || !projectName) {
      setGenerationError(language === 'en' ? 'Please select an employee and project first.' : 'অনুগ্রহ করে প্রথমে একজন কর্মকর্তা এবং প্রজেক্ট নির্বাচন করুন।');
      return;
    }

    setIsGenerating(true);
    setGenerationError('');
    setGeneratedText('');

    try {
      const response = await fetch('/api/gemini/agreement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName,
          employeeName: selectedEmpObj?.name || 'Developer',
          employeeRole: selectedEmpObj?.role || 'Developer',
          companyName: settings.agencyName,
          description: projectDescription,
          terms: customTerms,
          language: argLanguage
        })
      });

      if (!response.ok) {
        throw new Error('Server returned error response');
      }

      const data = await response.json();
      setGeneratedText(data.agreementText || '');
      setEditorText(data.agreementText || '');
    } catch (err) {
      console.error(err);
      setGenerationError(language === 'en' ? 'Failed to generate agreement via AI. Please check server api key.' : 'অ্যাডমিন এআই দ্বারা চুক্তিপত্র তৈরি করা ব্যর্থ হয়েছে। অনুগ্রহ করে সেটিংস ও জেমিনি এপিআই কি যাচাই করুন।');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAndSend = () => {
    const freshAg: Agreement = {
      id: `ag-${Date.now()}`,
      companyName: settings.agencyName,
      employeeId,
      employeeName: selectedEmpObj?.name || 'Developer',
      employeeRole: selectedEmpObj?.role || 'Developer',
      projectName,
      projectDescription,
      agreementText: editorText || generatedText,
      legalTermsSummary: customTerms,
      createdAt: new Date().toISOString(),
      status: 'Sent',
      adminSignature: `Signed Digitally by ${adminSignName} [CEO/Admin, ${settings.agencyName}]`,
      signedAt: new Date().toISOString()
    };

    onAddAgreement(freshAg);
    setIsCreating(false);
    // Reset states
    setEmployeeId('');
    setProjectName('');
    setProjectDescription('');
    setCustomTerms('');
    setGeneratedText('');
    setEditorText('');
  };

  const handleAdminSign = (agId: string) => {
    const found = agreements.find(a => a.id === agId);
    if (!found) return;

    const signature = `Signed Digitally by ${adminSignName} [CEO/Admin, ${settings.agencyName}]`;
    const updated: Agreement = {
      ...found,
      adminSignature: signature,
      status: found.employeeSignature ? 'Signed' : found.status,
      signedAt: new Date().toISOString()
    };

    onUpdateAgreement(updated);
    if (selectedAgreement?.id === agId) {
      setSelectedAgreement(updated);
    }
  };

  const triggerPrint = () => {
    window.print();
  };

  // Simple legal markdown highlighting
  const renderDocumentWithHighlight = (mdText: string) => {
    if (!mdText) return null;
    const lines = mdText.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="text-sm font-black text-white mt-5 mb-2 font-display uppercase tracking-wide border-b border-white/5 pb-1">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={idx} className="text-base font-black text-indigo-300 mt-6 mb-3 font-display uppercase border-b border-indigo-500/20 pb-1">{line.replace('## ', '')}</h3>;
      }
      if (line.startsWith('# ')) {
        return <h2 key={idx} className="text-lg font-black text-indigo-400 text-center mb-6 font-display uppercase tracking-widest">{line.replace('# ', '')}</h2>;
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={idx} className="font-bold text-white text-xs my-2">{line.replace(/\*\*/g, '')}</p>;
      }
      return <p key={idx} className="text-[11px] text-slate-350 leading-relaxed my-2.5 whitespace-pre-wrap">{line}</p>;
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-xs text-slate-100">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 border border-white/5 p-6 rounded-3xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/5 rounded-full filter blur-xl pointer-events-none" />
        <div className="space-y-1">
          <h2 className="text-lg font-black text-white font-display flex items-center gap-2">
            <ShieldCheck className="h-5.5 w-5.5 text-blue-400" />
            <span>{txt.title}</span>
          </h2>
          <p className="text-slate-400 text-[10.5px] max-w-xl">{txt.subTitle}</p>
        </div>

        {!isCreating && !selectedAgreement && (
          <button
            onClick={() => setIsCreating(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-2.5 px-5 rounded-xl transition flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/15"
          >
            <Plus className="h-4 w-4" />
            <span>{txt.newBtn}</span>
          </button>
        )}
      </div>

      {/* Main conditional rendering views */}
      {isCreating ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          
          {/* Col 1: Form settings */}
          <div className="lg:col-span-5 bg-[#121626]/95 border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h3 className="font-bold text-white font-mono text-[10.5px] uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                <span>{txt.aiGenerator}</span>
              </h3>
              <button
                onClick={() => setIsCreating(false)}
                className="text-[10px] text-slate-400 hover:text-white cursor-pointer font-mono"
              >
                ✕ {txt.backBtn}
              </button>
            </div>

            {/* Step 1 */}
            <div className="space-y-1.5">
              <label className="block text-slate-350 font-bold font-mono text-[10px] uppercase">{txt.step1}</label>
              <select
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-white outline-none focus:border-indigo-500 transition font-mono"
              >
                <option value="" className="bg-[#121626] text-slate-300">-- Choose Employee --</option>
                {remoteStaff.map(emp => (
                  <option key={emp.id} value={emp.id} className="bg-[#121626]">
                    {emp.name} ({emp.role})
                  </option>
                ))}
              </select>
              {selectedEmpObj && (
                <div className="bg-[#191f36]/40 p-2.5 border border-white/5 rounded-xl text-[10px] text-slate-400 flex flex-wrap gap-2 justify-between">
                  <div><strong>{txt.roleLabel}:</strong> {selectedEmpObj.role}</div>
                  <div><strong>Salary Grade:</strong> ৳{selectedEmpObj.salaryAmount.toLocaleString()}/mo</div>
                </div>
              )}
            </div>

            {/* Step 2 */}
            <div className="space-y-1.5">
              <label className="block text-slate-350 font-bold font-mono text-[10px] uppercase">{txt.step2}</label>
              <input
                type="text"
                placeholder="e.g. ERP Inventory Dashboard Integration"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-white outline-none focus:border-indigo-500 transition font-mono"
              />
              <textarea
                rows={2}
                placeholder="Provide short scope of work details..."
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-white outline-none focus:border-indigo-500 transition font-mono"
              />
            </div>

            {/* Step 3 */}
            <div className="space-y-1.5">
              <label className="block text-slate-350 font-bold font-mono text-[10px] uppercase">{txt.step3}</label>
              <textarea
                rows={4}
                placeholder={txt.placeholderTerms}
                value={customTerms}
                onChange={(e) => setCustomTerms(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-white outline-none focus:border-indigo-500 transition text-[10px] leading-relaxed"
              />
            </div>

            {/* Language & Action */}
            <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row gap-3 justify-between items-center">
              <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
                <button
                  type="button"
                  onClick={() => setArgLanguage('bn')}
                  className={`px-3 py-1.5 rounded-lg text-[9.5px] font-bold transition font-mono cursor-pointer ${
                    argLanguage === 'bn' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  কর্পোরেট বাংলা
                </button>
                <button
                  type="button"
                  onClick={() => setArgLanguage('en')}
                  className={`px-3 py-1.5 rounded-lg text-[9.5px] font-bold transition font-mono cursor-pointer ${
                    argLanguage === 'en' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Legal English
                </button>
              </div>

              <button
                type="button"
                onClick={handleGenerateViaAI}
                disabled={isGenerating}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/10"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4.5 w-4.5 text-yellow-300" />
                    <span>{txt.generateBtn}</span>
                  </>
                )}
              </button>
            </div>

            {generationError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-rose-300 font-mono text-[10px]">
                <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                <span>{generationError}</span>
              </div>
            )}
          </div>

          {/* Col 2: Markdown Editor and Action list */}
          <div className="lg:col-span-7 bg-[#121626]/95 border border-white/10 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="font-mono text-[10px] font-black text-white uppercase tracking-wider">
                  📝 Generated Legal Contract Document Text Editor
                </span>
                <span className="text-[9px] text-slate-400 italic">
                  Modify terms manually before executing
                </span>
              </div>

              {isGenerating ? (
                <div className="h-80 bg-slate-900/60 rounded-xl border border-white/5 flex flex-col items-center justify-center text-slate-400 space-y-3 p-5 text-center">
                  <div className="w-8 h-8 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
                  <p className="font-mono text-[10.5px] text-slate-300 max-w-sm">{txt.generatingText}</p>
                </div>
              ) : generatedText ? (
                <textarea
                  rows={20}
                  value={editorText}
                  onChange={(e) => setEditorText(e.target.value)}
                  className="w-full bg-[#0d101e] border border-white/10 p-4 rounded-xl text-slate-205 focus:border-indigo-400 text-[10px] font-mono leading-relaxed"
                />
              ) : (
                <div className="h-80 bg-[#0d101e]/60 rounded-xl border border-white/5 flex flex-col items-center justify-center text-slate-500 italic p-5 text-center">
                  <FileText className="h-10 w-10 text-slate-700 mb-2" />
                  <p className="text-[10px] max-w-sm">No draft document has been generated yet. Complete the steps on the left and trigger the AI agent draft engine to build a customized remote employee contract.</p>
                </div>
              )}
            </div>

            {generatedText && !isGenerating && (
              <div className="pt-4 border-t border-white/5 space-y-4">
                {/* Sign panel */}
                <div className="bg-slate-900 p-3 rounded-xl border border-white/5 space-y-2">
                  <span className="block text-[9.5px] font-mono text-indigo-400 font-bold uppercase tracking-wider">{txt.signAdminTitle}</span>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder={txt.signNameLabel}
                        value={adminSignName}
                        onChange={(e) => setAdminSignName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 p-2 rounded-lg text-white font-mono text-[10px]"
                      />
                    </div>
                    <button
                      onClick={handleSaveAndSend}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-2 px-5 rounded-lg transition text-[11px]"
                    >
                      {txt.sendToEmp}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      ) : selectedAgreement ? (
        /* Agreement Detail Document Scroll View */
        <div className="bg-[#121626] border border-white/10 rounded-2xl p-6 space-y-6 animate-fade-in print:bg-white print:text-black print:border-none print:shadow-none">
          
          {/* Header Controls */}
          <div className="flex justify-between items-center border-b border-white/5 pb-4 print:hidden">
            <button
              onClick={() => setSelectedAgreement(null)}
              className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              ← {txt.backBtn}
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={triggerPrint}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition text-[10px] border border-white/5 cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>{txt.downloadReport}</span>
              </button>
              
              {!selectedAgreement.adminSignature && (
                <button
                  onClick={() => handleAdminSign(selectedAgreement.id)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition text-[10px]"
                >
                  <Signature className="h-3.5 w-3.5" />
                  <span>{txt.signAdminBtn}</span>
                </button>
              )}
            </div>
          </div>

          {/* Legal Scrollable Board */}
          <div className="bg-[#0b0e1b] border border-white/10 p-8 rounded-2xl max-w-4xl mx-auto shadow-inner min-h-[450px] print:bg-transparent print:border-none print:p-0 print:m-0">
            {/* Stamp Logo top block */}
            <div className="flex flex-col items-center justify-center text-center border-b border-indigo-500/20 pb-6 mb-6 print:border-black/20">
              <div className="w-12 h-12 bg-indigo-600/10 border-2 border-indigo-500/30 rounded-full flex items-center justify-center font-serif text-lg text-indigo-400 font-extrabold shadow-sm select-none mb-3 print:border-black print:text-black">
                {settings.agencyLogoInitials || 'IX'}
              </div>
              <h1 className="text-sm font-black uppercase text-white font-mono tracking-widest print:text-black">
                {settings.agencyName}
              </h1>
              <p className="text-[9px] text-slate-455 font-mono tracking-widest mt-0.5 uppercase print:text-slate-650">
                OFFICIAL REMOTE OPERATIONS FRAMEWORK CONTRACT
              </p>
            </div>

            {/* Document Content */}
            <div className="space-y-4 font-sans max-w-3xl mx-auto text-slate-200 prose prose-invert print:text-black">
              {renderDocumentWithHighlight(selectedAgreement.agreementText)}
            </div>

            {/* Signature Footers */}
            <div className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t border-white/10 max-w-3xl mx-auto print:border-black/20">
              {/* Admin Sign */}
              <div className="space-y-3">
                <span className="block text-[9px] uppercase font-black tracking-wider text-slate-450 font-mono print:text-slate-600">Company Witness Digital stamp:</span>
                {selectedAgreement.adminSignature ? (
                  <div className="bg-[#0f172a]/80 border border-emerald-500/15 p-4 rounded-xl space-y-1.5 backdrop-blur-md relative overflow-hidden print:border-transparent print:p-2">
                    <div className="absolute top-0 right-0 w-8 h-8 rounded-bl-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 print:hidden">
                      <FileCheck className="h-4.5 w-4.5" />
                    </div>
                    <span className="block font-serif text-xs italic text-indigo-300 font-black tracking-wide print:text-black">{selectedAgreement.adminSignature}</span>
                    <span className="block text-[8px] font-mono text-slate-400">Signed Legally via Admin Token</span>
                    <span className="block text-[8px] font-mono text-indigo-400">Timestamp: {new Date(selectedAgreement.createdAt).toLocaleString()}</span>
                  </div>
                ) : (
                  <div className="h-16 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-slate-500 italic text-[10px] print:border-black/20">
                    Awaiting Company Digital Signature
                  </div>
                )}
              </div>

              {/* Employee Sign */}
              <div className="space-y-3">
                <span className="block text-[9px] uppercase font-black tracking-wider text-slate-455 font-mono print:text-slate-600">Employee Digital Witness signature:</span>
                {selectedAgreement.employeeSignature ? (
                  <div className="bg-[#0f172a]/80 border border-emerald-500/15 p-4 rounded-xl space-y-1.5 backdrop-blur-md relative overflow-hidden print:border-transparent print:p-2">
                    <div className="absolute top-0 right-0 w-8 h-8 rounded-bl-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 print:hidden">
                      <FileCheck className="h-4.5 w-4.5" />
                    </div>
                    <span className="block font-serif text-xs italic text-emerald-300 font-black tracking-wide print:text-black">{selectedAgreement.employeeSignature}</span>
                    <span className="block text-[8px] font-mono text-slate-400">Certified Digital Thumbprint Verified</span>
                    {selectedAgreement.signedAt && <span className="block text-[8px] font-mono text-emerald-400">Executed: {new Date(selectedAgreement.signedAt).toLocaleString()}</span>}
                  </div>
                ) : (
                  <div className="h-16 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-slate-500 italic text-[10px] print:border-black/20">
                    Awaiting Employee Signature Token
                  </div>
                )}
              </div>
            </div>

            {selectedAgreement.status === 'Signed' && (
              <div className="mt-8 p-3 rounded-xl bg-emerald-900/10 border border-emerald-500/15 text-center text-[10px] text-emerald-450 font-bold tracking-wide flex items-center justify-center gap-2 max-w-lg mx-auto print:hidden">
                <CheckCircle className="h-4 w-4" />
                <span>{txt.signedStatusDesc}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Agreements Table list view */
        <div className="bg-[#111526]/90 border border-white/10 rounded-2xl p-5 space-y-4 animate-fade-in">
          
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="font-mono text-[10px] font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <FileCheck className="h-4 w-4 text-indigo-400" />
              <span>{txt.activeAg} ({agreements.length})</span>
            </span>
          </div>

          {agreements.length === 0 ? (
            <div className="py-16 text-center text-slate-500 italic flex flex-col items-center justify-center bg-slate-900/10 border border-white/5 rounded-2xl">
              <FileText className="h-11 w-11 text-slate-705 mb-2 animate-pulse" />
              <p className="text-[10.5px] max-w-sm">{txt.noAgreements}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-bold font-mono text-[10px] uppercase">
                    <th className="p-3">{txt.empName}</th>
                    <th className="p-3">{txt.project}</th>
                    <th className="p-3">{txt.created}</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">{txt.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {agreements.map((ag) => (
                    <tr key={ag.id} className="hover:bg-white/2 transition">
                      <td className="p-3">
                        <span className="block font-bold text-white text-sm">{ag.employeeName}</span>
                        <span className="block text-[10px] text-indigo-400 font-mono mt-0.5">{ag.employeeRole}</span>
                      </td>
                      <td className="p-3">
                        <span className="block font-bold text-slate-200">{ag.projectName}</span>
                        <span className="block text-[10.5px] text-slate-400 truncate max-w-xs mt-0.5" title={ag.projectDescription}>
                          {ag.projectDescription || 'No description provided'}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-400">
                        {new Date(ag.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded text-[9.5px] font-bold font-mono tracking-wide ${
                          ag.status === 'Signed' ? 'bg-emerald-500/15 text-emerald-400' :
                          ag.status === 'Sent' ? 'bg-indigo-500/15 text-indigo-400 animate-pulse' :
                          ag.status === 'Terminated' ? 'bg-rose-500/15 text-rose-450' :
                          'bg-slate-500/15 text-slate-400'
                        }`}>
                          {ag.status === 'Signed' ? txt.statusSigned :
                           ag.status === 'Sent' ? txt.statusSent :
                           ag.status === 'Terminated' ? txt.statusTerminated :
                           txt.statusDraft}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedAgreement(ag)}
                            className="bg-[#21273d] hover:bg-[#2b334d] text-indigo-300 font-bold px-3 py-1.5 rounded-lg text-[10px] cursor-pointer transition flex items-center gap-1 border border-white/5 font-mono"
                          >
                            <span>{txt.viewDoc}</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              if (confirm(language === 'en' ? 'Are you sure you want to delete this agreement archive?' : 'আপনি কি সত্যি এই চুক্তিপত্রটি ডিলিট করতে চান?')) {
                                onDeleteAgreement(ag.id);
                              }
                            }}
                            className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 p-2 rounded-lg transition cursor-pointer border border-rose-500/10"
                            title={language === 'en' ? 'Delete Contract' : 'ডিলিট করুন'}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
