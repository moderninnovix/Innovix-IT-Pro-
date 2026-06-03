import React, { useState } from 'react';
import { Send, Sparkles, HelpCircle, FileText, FileSpreadsheet, ArrowRightCircle } from 'lucide-react';

interface AiPartnerViewProps {
  language: 'en' | 'bn';
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function AiPartnerView({ language }: AiPartnerViewProps) {
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'assistant', content: language === 'en' 
      ? "Greetings! I am BizFlow IT AI Advisor. How can I optimize your team tasks, client billing, or software roadmaps today?" 
      : "শুভকামনা! আমি বিজফ্লো আইটি এআই পার্টনার। আপনার কোম্পানির প্রজেক্ট প্রপোজাল তৈরি, আইটি বাজেট নির্ধারণ, বা রোডম্যাপ তৈরিতে আমি কীভাবে সাহায্য করতে পারি?" }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Preset Shortcuts
  const presets = [
    { 
      label: language === 'en' ? 'Create Software Proposal' : 'সফ্টওয়্যার চুক্তিনামা ল্যাম্প',
      prompt: "Draft a modern polite 1-page Client Proposal Outline for a Custom Hospital Inventory ERP with budget $3000, 5 milestones and complete team guidelines."
    },
    { 
      label: language === 'en' ? 'Generate Sprint Plan' : '৫ সপ্তাহের স্প্রিন্ট প্ল্যান তৈরি',
      prompt: "Generate a detailed 5-week Agile Sprint implementation plan for a food delivery React Mobile app."
    },
    { 
      label: language === 'en' ? 'Bengali IT Project Contract' : 'বাংলাদেশী আইটি চুক্তিপত্র',
      prompt: "আইটি সফটওয়্যার তৈরির জন্য একটি প্রিমিয়াম ৫ দফার বাংলা আইটি চুক্তিপত্র টেমপ্লেট ড্রাফট করুন যেখানে মালিকানা, পেমেন্ট বিলম্ব ও সোর্স কোড ডেলিভারি স্পষ্ট থাকবে।"
    },
  ];

  const triggerChatSubmit = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    setIsGenerating(true);
    setPrompt('');
    
    // Add user message to history
    const userMsg: ChatMessage = { role: 'user', content: textToSend };
    const currentHist = [...chatHistory, userMsg];
    setChatHistory(currentHist);

    try {
      const response = await fetch('/api/gemini/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          chatHistory: currentHist.slice(-8) // Send recent context limits
        })
      });
      const data = await response.json();
      if (data && data.text) {
        setChatHistory(prev => [...prev, { role: 'assistant', content: data.text }]);
      } else {
        setChatHistory(prev => [...prev, { role: 'assistant', content: "I encountered an issue processing that. Please check your credentials." }]);
      }
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [...prev, { role: 'assistant', content: "Failed to connect with server endpoints." }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const text = {
    en: {
      title: 'Gemini IT Strategy Ally',
      subtitle: 'Ask Gemini questions regarding agile development charges, technical roadmaps, contract frameworks, or BD startup laws.',
      inputPlaceholder: 'Command Gemini to help your venture...',
      presetsHeader: 'Dhaka Tech Startup presets'
    },
    bn: {
      title: 'জেমিনি এআই বিজনেস পার্টনার',
      subtitle: 'আইটি কোম্পানির যেকোনো ব্যবসায়িক পরামর্শ, ক্লায়েন্ট প্রজেক্ট বাজেট, ৫ সপ্তাহের স্প্রিন্ট বা চুক্তিপত্র বিন্যাস করতে জেমিনিকে জিজ্ঞেস করুন।',
      inputPlaceholder: 'আপনার আইটি ব্যবসার কোনো প্রপোজাল তৈরি বা কাজের তালিকা লিখতে নির্দেশনা দিন...',
      presetsHeader: 'আইটি কোম্পানি রেডি-মেড প্রেসেটস'
    }
  }[language];

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-xs">
      {/* Room header */}
      <div className="border-b border-white/10 pb-5">
        <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-indigo-400 animate-pulse" />
          {text.title}
        </h2>
        <p className="text-sm text-slate-400 mt-1 leading-relaxed">{text.subtitle}</p>
      </div>

      {/* Shortcuts Grid */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-305 font-mono">{text.presetsHeader}</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {presets.map((ps, idx) => (
            <button
              key={idx}
              onClick={() => triggerChatSubmit(ps.prompt)}
              className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-400 rounded-xl text-left text-xs transition flex justify-between items-center group font-medium text-slate-200 cursor-pointer shadow-lg hover:shadow-indigo-505/10"
            >
              <span>{ps.label}</span>
              <ArrowRightCircle className="h-4 w-4 text-slate-400 group-hover:text-indigo-400 transition shrink-0 ml-2 animate-pulse" />
            </button>
          ))}
        </div>
      </div>

      {/* Chat messages viewport */}
      <div className="bg-[#151c2e]/70 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col h-[450px]">
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-0 text-xs">
          {chatHistory.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`p-4 rounded-2xl max-w-[80%] leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-tr-none shadow-lg shadow-indigo-505/20' 
                  : 'bg-white/5 border border-white/10 text-slate-100 rounded-tl-none whitespace-pre-wrap'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isGenerating && (
            <div className="flex justify-start">
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex items-center gap-2 text-xs text-slate-400">
                <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-indigo-400 border-t-transparent" />
                <span>Thinking & drafting solution...</span>
              </div>
            </div>
          )}
        </div>

        {/* Form Submission input */}
        <form 
          onSubmit={(e) => { e.preventDefault(); triggerChatSubmit(prompt); }} 
          className="border-t border-white/10 pt-4 mt-4 flex gap-3 shrink-0"
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={text.inputPlaceholder}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-slate-400 focus:bg-white/10 text-white"
          />
          <button
            type="submit"
            disabled={isGenerating || !prompt.trim()}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white h-11 px-5 rounded-xl transition flex items-center justify-center disabled:opacity-50 font-bold cursor-pointer transition shadow-lg shadow-indigo-505/20"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
