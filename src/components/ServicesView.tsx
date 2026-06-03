import React, { useState } from 'react';
import { Service } from '../types';
import { Layers, Plus, DollarSign, Clock, Check, X } from 'lucide-react';

interface ServicesViewProps {
  services: Service[];
  onAddService: (newService: Omit<Service, 'id'>) => void;
  language: 'en' | 'bn';
}

export default function ServicesView({ services, onAddService, language }: ServicesViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Development' | 'Design' | 'Marketing' | 'Support' | 'Consulting'>('Development');
  const [basePrice, setBasePrice] = useState<number>(0);
  const [duration, setDuration] = useState('');

  const handleAddNewService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || basePrice <= 0) return;
    onAddService({
      name,
      description,
      category,
      basePrice,
      duration: duration || 'Flexible'
    });
    setName('');
    setDescription('');
    setCategory('Development');
    setBasePrice(0);
    setDuration('');
    setShowAddForm(false);
  };

  const text = {
    en: {
      servicesTitle: 'Company IT Service Catalogues',
      desc: 'Set corporate base rates and standard implementation duration for system projects.',
      addBtn: 'Offer New Service Pack',
      addTitle: 'Configure New Service Pack',
      name: 'Service Package Name',
      srvDesc: 'Service Deliverables Description',
      pricing: 'Base Standard Fee ($)',
      duration: 'Implementation Schedule',
      category: 'Strategic Category',
      submitBtn: 'Add to Store Catalog',
      durationLabel: 'Duration Estimate',
    },
    bn: {
      servicesTitle: 'কোম্পানি সার্ভিস ক্যাটালগ ও প্যাকেজেস',
      desc: 'আপনার আইটি কোম্পানির বিভিন্ন সেবাসমূহ (ওয়েব ডেভেলপমেন্ট, সিকিউরিটি অডিট) এর বেস বাজেট ও সময় নির্ধারণ করুন।',
      addBtn: 'নতুন সার্ভিস প্যাক যুক্ত করুন',
      addTitle: 'নতুন আইটি সার্ভিস প্যাক কনফিগার করুন',
      name: 'সার্ভিসের নাম',
      srvDesc: 'সার্ভিসের বিস্তারিত বিবরণ',
      pricing: 'বেস রেট / ফী ($)',
      duration: 'আনুমানিক সম্পন্ন করার মেয়াদ',
      category: 'কৌশলগত বিভাগ',
      submitBtn: 'সার্ভিস ক্যাটালগে যুক্ত করুন',
      durationLabel: 'ডিউরেশন',
    }
  }[language];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-5 gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">{text.servicesTitle}</h2>
          <p className="text-sm text-slate-400 mt-1">{text.desc}</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl transition text-sm shadow-lg shadow-indigo-505/20 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          {text.addBtn}
        </button>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {services.map((service) => (
          <div key={service.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl relative hover:border-white/15 hover:bg-white/10 transition-all space-y-4">
            <span className={`absolute top-6 right-6 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
              service.category === 'Development' ? 'bg-blue-500/15 text-blue-300 border-blue-500/25' :
              service.category === 'Design' ? 'bg-purple-500/15 text-purple-300 border-purple-500/25' :
              service.category === 'Consulting' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25' : 'bg-white/5 text-slate-300 border-white/10'
            }`}>
              {service.category}
            </span>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-white pr-20">{service.name}</h3>
              <p className="text-xs text-slate-350 leading-relaxed pr-6">{service.description}</p>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs font-mono">
              <div className="flex items-center gap-1 text-emerald-400 font-black text-lg">
                <DollarSign className="h-4.5 w-4.5 text-slate-400 shrink-0 inline" />
                <span>${service.basePrice.toLocaleString()}+</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                <span>{text.durationLabel}: <strong className="text-white">{service.duration}</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Catalog Pack Dialog */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in text-xs">
          <div className="bg-[#151c2e]/95 backdrop-blur-2xl border border-white/10 rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
            <h3 className="text-lg font-black text-white mb-4">{text.addTitle}</h3>
            <button 
              onClick={() => setShowAddForm(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
            <form onSubmit={handleAddNewService} className="space-y-4 mt-2">
              <div>
                <label className="block font-bold text-slate-300 mb-1">{text.name} *</label>
                <input 
                  type="text" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 outline-none focus:border-indigo-400 text-white placeholder-slate-400"
                  placeholder="e.g. Flutter Mobile App Development"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">{text.srvDesc} *</label>
                <textarea 
                  required 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 outline-none focus:border-indigo-400 text-xs text-white placeholder-slate-400"
                  placeholder="List standard scope, deliverables, database setup..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-3 font-sans">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">{text.category}</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white bg-slate-900 cursor-pointer"
                  >
                    <option value="Development" className="bg-slate-900">Development</option>
                    <option value="Design" className="bg-slate-900">Design</option>
                    <option value="Consulting" className="bg-slate-900">Consulting</option>
                    <option value="Marketing" className="bg-slate-900">Marketing</option>
                    <option value="Support" className="bg-slate-900">Support</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">{text.pricing} *</label>
                  <input 
                    type="number" 
                    required 
                    value={basePrice || ''}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 font-mono text-white placeholder-slate-400"
                    placeholder="e.g. 2500"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">{text.duration}</label>
                <input 
                  type="text" 
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white placeholder-slate-400"
                  placeholder="e.g. 3-6 Weeks"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-750 text-white font-bold py-3 px-4 rounded-xl transition shadow-lg shadow-indigo-505/10 cursor-pointer text-sm font-sans"
              >
                {text.submitBtn}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
