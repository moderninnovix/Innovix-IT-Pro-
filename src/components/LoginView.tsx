import React, { useState } from 'react';
import { AppSettings } from '../types';
import { Lock, ShieldCheck, Mail, ArrowRight, UserCheck, HelpCircle, Users, Briefcase, KeyRound } from 'lucide-react';

interface LoginViewProps {
  settings: AppSettings;
  language: 'en' | 'bn';
  onLoginSuccess: (session: { role: 'Admin' | 'Employee' | 'Client'; id: string; name: string; email: string }) => void;
}

export default function LoginView({ settings, language, onLoginSuccess }: LoginViewProps) {
  const [activeRoleTab, setActiveRoleTab] = useState<'Admin' | 'Employee' | 'Client'>('Admin');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [errorMsg, setErrorMsg] = useState('');

  // Pre-configured mock credentials for easy bypass testing
  const mockEmployees = [
    { id: 'tm3', name: 'Tanvir Hossain', email: 'tanvir@innovix.com', role: 'Developer' },
    { id: 'tm2', name: 'Tasnim Jahan', email: 'tasnim@innovix.com', role: 'Project Manager' },
    { id: 'tm4', name: 'Fariha Kabir', email: 'fariha@innovix.com', role: 'Designer' },
  ];

  const mockClients = [
    { id: 'cl1', name: 'Rahat Chowdhury', companyName: 'Dhaka Agro Foods Ltd', email: 'rahat@agrofoods.bd' },
    { id: 'cl3', name: 'Imtiaz Ahmed', companyName: 'Dacca Cargo Services', email: 'imtiaz@daccacargo.com' },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === '' || password.trim() === '') {
      setErrorMsg(language === 'en' ? 'Please fill in credentials.' : 'দয়া করে সবগুলো ঘর পূরণ করুন।');
      return;
    }

    const lowerUser = username.toLowerCase().trim();

    if (activeRoleTab === 'Admin') {
      if (lowerUser === 'admin' && password === '123456') {
        onLoginSuccess({
          role: 'Admin',
          id: 'admin',
          name: settings.contactPerson || 'Zakir Hasan',
          email: settings.email || 'zakir@innovix-bd.com'
        });
      } else {
        setErrorMsg(language === 'en' ? 'Incorrect admin password.' : 'অ্যাডমিন ইউজারনেম বা পাসওয়ার্ড সঠিক নয়।');
      }
    } else if (activeRoleTab === 'Employee') {
      const match = mockEmployees.find(emp => emp.email.toLowerCase() === lowerUser);
      if (match && password === '123456') {
        onLoginSuccess({
          role: 'Employee',
          id: match.id,
          name: match.name,
          email: match.email
        });
      } else {
        setErrorMsg(language === 'en' ? 'Employee not found or wrong password (use 123456).' : 'টিম মেম্বার পাওয়া যায়নি অথবা পাসওয়ার্ড ভুল (পাসওয়ার্ড: 123456)।');
      }
    } else {
      const match = mockClients.find(cl => cl.email.toLowerCase() === lowerUser);
      if (match && password === '123456') {
        onLoginSuccess({
          role: 'Client',
          id: match.id,
          name: match.name,
          email: match.email
        });
      } else {
        setErrorMsg(language === 'en' ? 'Client not found or wrong password (use 123456).' : 'ক্লায়েন্ট পাওয়া যায়নি অথবা পাসওয়ার্ড ভুল (পাসওয়ার্ড: 123456)।');
      }
    }
  };

  const handleQuickLogin = (role: 'Admin' | 'Employee' | 'Client', id: string, name: string, email: string) => {
    onLoginSuccess({ role, id, name, email });
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans antialiased text-xs">
      
      {/* Visual cyber mesh background glowing rings */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] left-[30%] w-[50%] h-[50%] bg-purple-650/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* Animated Brand Emblem Header */}
        <div className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-xl shadow-indigo-500/30 ring-4 ring-white/5 animate-pulse">
            {settings.agencyLogoInitials || 'IX'}
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-black text-white tracking-tight uppercase">
              {settings.agencyName || 'BizFlow ERP'}
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
              {language === 'en' ? 'Multi-Role Secure Enterprise Gateway' : 'মাল্টি-রোল ভিত্তিক ইন্টিগ্রেটেড ইআরপি গেটওয়ে'}
            </p>
          </div>
        </div>

        {/* Roles Tab Controller */}
        <div className="bg-slate-900/60 p-1.5 rounded-2xl border border-white/5 flex gap-1">
          <button
            onClick={() => {
              setActiveRoleTab('Admin');
              setUsername('admin');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-xl text-center font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeRoleTab === 'Admin'
                ? 'bg-gradient-to-r from-blue-505 via-indigo-550 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-205'
            }`}
          >
            <KeyRound className="h-3.5 w-3.5" />
            <span>{language === 'en' ? 'Admin' : 'অ্যাডমিন'}</span>
          </button>
          <button
            onClick={() => {
              setActiveRoleTab('Employee');
              setUsername('tanvir@innovix.com');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-xl text-center font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeRoleTab === 'Employee'
                ? 'bg-gradient-to-r from-blue-505 via-indigo-550 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-205'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>{language === 'en' ? 'Employee' : 'এমপ্লয়ি'}</span>
          </button>
          <button
            onClick={() => {
              setActiveRoleTab('Client');
              setUsername('rahat@agrofoods.bd');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-xl text-center font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeRoleTab === 'Client'
                ? 'bg-gradient-to-r from-blue-505 via-indigo-550 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-205'
            }`}
          >
            <Briefcase className="h-3.5 w-3.5" />
            <span>{language === 'en' ? 'Client' : 'ক্লায়েন্ট'}</span>
          </button>
        </div>

        {/* Login form Card container */}
        <div className="bg-[#111625]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5">
          
          <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/15 px-3 py-1.5 rounded-xl font-mono justify-center">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>
              {language === 'en' 
                ? `${activeRoleTab.toUpperCase()} SECURE PORTAL CHANNEL` 
                : `${activeRoleTab === 'Admin' ? 'অ্যাডমিন' : activeRoleTab === 'Employee' ? 'এমপ্লয়ি' : 'ক্লায়েন্ট'} নিরাপদ গেটওয়ে কানেকশন`}
            </span>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-center font-bold font-mono">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username/Email Input */}
            <div>
              <label className="block text-slate-350 font-bold mb-1.5">
                {language === 'en' ? 'Gate Username / Signed Email' : 'প্রবেশদ্বার আইডি / রেজিস্টার্ড ইমেইল'}
              </label>
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl p-3 outline-none focus:border-indigo-400 focus:bg-white/10 transition-all font-mono"
                placeholder={activeRoleTab === 'Admin' ? 'e.g. admin' : 'e.g. user@innovix.com'}
              />
            </div>

            {/* Secret key Password Input */}
            <div>
              <label className="block text-slate-350 font-bold mb-1.5">
                {language === 'en' ? 'Secure Gateway Password' : 'নিরাপদ অ্যাক্সেস পাসওয়ার্ড'}
              </label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl p-3 outline-none focus:border-indigo-400 focus:bg-white/10 transition-all font-mono"
                placeholder="••••••"
              />
            </div>

            {/* Submit click control */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl transition shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer font-sans text-xs uppercase tracking-wider"
            >
              <span>{language === 'en' ? `Sign In as ${activeRoleTab}` : `${activeRoleTab === 'Admin' ? 'অ্যাডমিন' : activeRoleTab === 'Employee' ? 'এমপ্লয়ি' : 'ক্লায়েন্ট'} প্যানেলে লগইন`}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Quick Click Simulation Portals to jump roles easily */}
          <div className="border-t border-white/10 pt-4 space-y-2.5">
            <span className="block text-[10px] text-indigo-300 font-bold font-mono text-center uppercase tracking-wider">
              ⚡ {language === 'en' ? 'Instant Simulator Select' : 'ইনস্ট্যান্ট সিমুলেটর ক্লিক (দ্রুত ওয়ান-ক্লিক লগইন)'}
            </span>
            
            {activeRoleTab === 'Admin' && (
              <button 
                onClick={() => handleQuickLogin('Admin', 'admin', settings.contactPerson || 'Zakir Hasan', settings.email || 'zakir@innovix-bd.com')}
                className="w-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-300 p-2.5 rounded-xl font-mono text-[10px] text-left transition flex items-center justify-between"
              >
                <span>👤 admin (Password: 123456)</span>
                <span className="bg-blue-500/20 px-1.5 py-0.5 rounded text-blue-200">Admin Bypass &rarr;</span>
              </button>
            )}

            {activeRoleTab === 'Employee' && (
              <div className="space-y-1.5">
                {mockEmployees.map(emp => (
                  <button 
                    key={emp.id}
                    onClick={() => handleQuickLogin('Employee', emp.id, emp.name, emp.email)}
                    className="w-full bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 p-2.5 rounded-xl font-mono text-[10px] text-left transition flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-white block">{emp.name}</span>
                      <span className="text-[9px] text-slate-400">{emp.role} • {emp.email}</span>
                    </div>
                    <span className="bg-indigo-500/20 px-1.5 py-0.5 rounded text-indigo-200">Assign Work &rarr;</span>
                  </button>
                ))}
              </div>
            )}

            {activeRoleTab === 'Client' && (
              <div className="space-y-1.5">
                {mockClients.map(cl => (
                  <button 
                    key={cl.id}
                    onClick={() => handleQuickLogin('Client', cl.id, cl.name, cl.email)}
                    className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-350 p-2.5 rounded-xl font-mono text-[10px] text-left transition flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-white block">{cl.name}</span>
                      <span className="text-[9px] text-slate-400">{cl.companyName} • {cl.email}</span>
                    </div>
                    <span className="bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-300">View Invoices &rarr;</span>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer info branding details */}
        <div className="text-center space-y-1 font-mono text-[10px] text-slate-400">
          <p className="flex justify-center items-center gap-1.5 text-slate-500">
            <Mail className="h-3 w-3 inline text-indigo-400" />
            <span>Support: {settings.email || 'contact@innovix-bd.com'}</span>
          </p>
          <p>© {new Date().getFullYear()} {settings.agencyName || 'BizFlow IT Ltd'}. Uttara, Dhaka.</p>
        </div>

      </div>
    </div>
  );
}
