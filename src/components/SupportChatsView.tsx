import React, { useState } from 'react';
import { Client, ChatMessage, TeamMember } from '../types';
import FileUploader, { AttachmentPreview } from './FileUploader';
import { MessageSquare, Send, Paperclip, User, Sparkles, Building } from 'lucide-react';

interface SupportChatsViewProps {
  chats: ChatMessage[];
  clients: Client[];
  team: TeamMember[];
  language: 'en' | 'bn';
  onSendChatMessage: (receiverId: string, message: string, attachments?: { name: string; url: string; type: string }[]) => void;
}

export default function SupportChatsView({
  chats,
  clients,
  team,
  language,
  onSendChatMessage,
}: SupportChatsViewProps) {
  // Can chat with either a client or an employee
  const [activeCategory, setActiveCategory] = useState<'employees' | 'clients'>('clients');
  const [activeParticipantId, setActiveParticipantId] = useState<string>('');
  const [typedMessage, setTypedMessage] = useState('');

  // Attachments in chat
  const [showChatAttachments, setShowChatAttachments] = useState(false);
  const [chatAttachedFiles, setChatAttachedFiles] = useState<{ name: string; url: string; type: string }[]>([]);

  // If no participant selected, select the first one in list
  const currentCategoryParticipants = activeCategory === 'clients' ? clients : team;
  const selectedParticipant = currentCategoryParticipants.find(p => p.id === activeParticipantId) || currentCategoryParticipants[0];

  // Dynamically ensure a valid active participant ID is selected
  React.useEffect(() => {
    if (currentCategoryParticipants.length > 0 && (!activeParticipantId || !currentCategoryParticipants.some(p => p.id === activeParticipantId))) {
      setActiveParticipantId(currentCategoryParticipants[0].id);
    }
  }, [activeCategory, currentCategoryParticipants, activeParticipantId]);

  // Filter messages exchanged with selected participant
  const activeChats = chats.filter(c => 
    (c.senderId === 'admin' && c.receiverId === activeParticipantId) ||
    (c.senderId === activeParticipantId && c.receiverId === 'admin')
  );

  const handleSendMessage = () => {
    if (!typedMessage.trim() && chatAttachedFiles.length === 0) return;
    if (!activeParticipantId) return;

    onSendChatMessage(activeParticipantId, typedMessage, chatAttachedFiles);
    setTypedMessage('');
    setChatAttachedFiles([]);
    setShowChatAttachments(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in text-xs text-slate-100 print:hidden">
      {/* Overview Card */}
      <div className="bg-gradient-to-r from-indigo-950/45 via-slate-900/50 to-blue-900/25 p-5 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-505/20 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-300 shadow-md shrink-0">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white tracking-wide uppercase font-mono">
              {language === 'en' ? 'Support & CRM Chat Hub' : 'কন্ট্রোল ও সাপোর্ট চ্যাট হাব'}
            </h2>
            <p className="text-[10px] text-slate-400 font-sans mt-0.5">
              {language === 'en' 
                ? 'Central Direct Messaging interface to monitor and reply to clients requirement posts and employees reports.' 
                : 'সকল ক্লায়েন্ট এবং এমপ্লয়িদের সাথে সরাসরি চ্যাট, ফাইল পাঠানো এবং কাজের আপডেট দেখার এডমিন বোর্ড।'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#111625]/90 border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row h-[460px]">
        {/* Left Side Navigation: Category toggles & Participant List */}
        <div className="w-full md:w-64 bg-slate-900/40 border-r border-white/10 flex flex-col shrink-0">
          {/* Category Toggle Tabs */}
          <div className="flex border-b border-white/5 bg-black/10 p-1.5 gap-1">
            <button
              onClick={() => {
                setActiveCategory('clients');
                setActiveParticipantId('');
              }}
              className={`flex-1 py-1.5 rounded-lg font-bold text-center text-[10px] cursor-pointer transition uppercase tracking-wider ${
                activeCategory === 'clients' ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'en' ? 'Clients' : 'গ্রাহক / ক্লায়েন্ট'}
            </button>
            <button
              onClick={() => {
                setActiveCategory('employees');
                setActiveParticipantId('');
              }}
              className={`flex-1 py-1.5 rounded-lg font-bold text-center text-[10px] cursor-pointer transition uppercase tracking-wider ${
                activeCategory === 'employees' ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'en' ? 'Employees' : 'সহকারী সহকারী'}
            </button>
          </div>

          {/* Participant List Stream */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {currentCategoryParticipants.map(participant => {
              const isActive = participant.id === activeParticipantId;
              const subText = 'role' in participant ? participant.role : (participant as Client).projectName;
              return (
                <button
                  key={participant.id}
                  onClick={() => setActiveParticipantId(participant.id)}
                  className={`w-full text-left p-3 rounded-xl font-bold flex items-center gap-2.5 transition cursor-pointer ${
                    isActive 
                      ? 'bg-white/10 text-white border border-white/10 shadow-xs' 
                      : 'text-slate-400 hover:text-white hover:bg-white/4'
                  }`}
                >
                  <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                    activeCategory === 'clients' ? 'bg-emerald-450 animate-pulse' : 'bg-teal-400'
                  }`} />
                  <div className="truncate text-xs">
                    <span>{participant.name}</span>
                    <span className="block text-[8.5px] font-mono text-slate-450 normal-case truncate">{subText}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Chat Stream window */}
        <div className="flex-grow flex flex-col bg-black/5">
          {selectedParticipant ? (
            <>
              {/* Header section info */}
              <div className="p-3.5 border-b border-white/5 flex justify-between items-center bg-black/15">
                <div>
                  <span className="text-[9px] font-mono font-bold block text-indigo-300 uppercase tracking-widest">
                    {activeCategory === 'clients' ? 'Secure Client CRM Line' : 'Direct Staff Pipeline'}
                  </span>
                  <span className="text-[11px] font-bold text-white block mt-0.5">
                    {selectedParticipant.name} {'projectName' in selectedParticipant ? `(${selectedParticipant.projectName})` : ''}
                  </span>
                </div>
              </div>

              {/* Messages container stream */}
              <div className="flex-grow overflow-y-auto p-4 space-y-3">
                {activeChats.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-slate-500 italic font-mono text-center flex-col gap-1.5 py-12">
                    <MessageSquare className="h-6 w-6 text-slate-700 animate-pulse" />
                    <span>No chat logs exchanged with this account yet.<br />Send a secure file or update note using the drawer below.</span>
                  </div>
                ) : (
                  activeChats.map(message => {
                    const isMe = message.senderId === 'admin';
                    return (
                      <div 
                        key={message.id} 
                        className={`flex flex-col max-w-[280px] md:max-w-md ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                      >
                        <div className="flex items-center gap-1.5 text-[8.5px] text-slate-450 font-mono mb-1">
                          <span className="font-bold text-slate-350">{isMe ? 'You (Administrator)' : message.senderName}</span>
                          <span>•</span>
                          <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className={`p-3 rounded-2xl text-[11px] leading-relaxed font-sans whitespace-pre-wrap ${
                          isMe 
                            ? 'bg-gradient-to-tr from-indigo-600 to-indigo-750 text-white rounded-tr-none' 
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

              {/* Chat Send Controls with File Upload toggle */}
              <div className="border-t border-white/5 bg-black/25 flex flex-col p-2 space-y-2">
                {showChatAttachments && (
                  <div className="bg-[#191e2b] border border-[#ffffff]/10 rounded-xl p-3 animate-fade-in text-[11px]">
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
                    title="Attach files to message"
                  >
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <input
                    type="text"
                    value={typedMessage}
                    onChange={(e) => setTypedMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={language === 'en' ? 'Type direct support message...' : 'এখানে আপনার বার্তা লিখুন...'}
                    className="flex-grow bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-indigo-400 text-xs font-sans"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl cursor-pointer transition shrink-0 flex items-center justify-center shadow-lg shadow-indigo-650/10"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 font-mono italic">
              Please register or select a target participant first.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
