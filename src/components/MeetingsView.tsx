import React, { useState } from 'react';
import { Meeting, TeamMember, Task } from '../types';
import { Video, Calendar, Clock, Plus, Users, Play, X, Sparkles, Send, FileText, FileCheck, CheckCircle2 } from 'lucide-react';

interface MeetingsViewProps {
  meetings: Meeting[];
  team: TeamMember[];
  onAddMeeting: (newMeeting: Omit<Meeting, 'id' | 'isCompleted'>) => void;
  onAutoAddGeneratedTasks: (suggestedTasks: Omit<Task, 'id' | 'createdAt'>[]) => void;
  language: 'en' | 'bn';
}

interface AiAnalysisResult {
  summary: string;
  actionPoints: string[];
  suggestedTasks: {
    title: string;
    priority: 'Low' | 'Medium' | 'High';
    assignedTo: string; // e.g. 'Developer' or 'Designer'
  }[];
}

export default function MeetingsView({ meetings, team, onAddMeeting, onAutoAddGeneratedTasks, language }: MeetingsViewProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeBoardroomMeeting, setActiveBoardroomMeeting] = useState<Meeting | null>(null);

  // New Meeting form state
  const [title, setTitle] = useState('');
  const [dateTime, setDateTime] = useState('2026-06-03T11:00');
  const [duration, setDuration] = useState<number>(30);
  const [agenda, setAgenda] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(['tm1']);

  // Boardroom interactive logging states
  const [discussionNotes, setDiscussionNotes] = useState(
    "Hasib (Admin): Let's review the Stripe webhook delay.\n" +
    "Tanvir (Developer): I am rewriting the payment confirmation database hook today.\n" +
    "Fariha (Designer): Figma designs for checkout page are ready for review."
  );
  const [aiAnalysis, setAiAnalysis] = useState<AiAnalysisResult | null>(null);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [taskAddedFeedback, setTaskAddedFeedback] = useState(false);

  const handleSubmitMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !agenda || selectedParticipants.length === 0) return;
    onAddMeeting({
      title,
      dateTime,
      duration,
      agenda,
      participants: selectedParticipants
    });
    // Reset
    setTitle('');
    setDateTime('2026-06-03T11:00');
    setDuration(30);
    setAgenda('');
    setSelectedParticipants(['tm1']);
    setShowAddModal(false);
  };

  const toggleParticipant = (memberId: string) => {
    if (selectedParticipants.includes(memberId)) {
      setSelectedParticipants(selectedParticipants.filter(id => id !== memberId));
    } else {
      setSelectedParticipants([...selectedParticipants, memberId]);
    }
  };

  // call server-side Gemini summarize API
  const analyzeBoardroomDiscussion = async () => {
    if (!activeBoardroomMeeting || !discussionNotes.trim()) return;
    setIsAiAnalyzing(true);
    setAiAnalysis(null);
    setTaskAddedFeedback(false);

    try {
      const response = await fetch('/api/gemini/meeting-summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meetingTitle: activeBoardroomMeeting.title,
          agenda: activeBoardroomMeeting.agenda,
          discussionNotes: discussionNotes
        })
      });
      const data = await response.json();
      if (data && data.summary) {
        setAiAnalysis(data);
      }
    } catch (error) {
      console.error("Meeting recap AI error:", error);
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  // Append AI tasks to general task management logic
  const handleInjectAiSuggestedTasks = () => {
    if (!aiAnalysis || aiAnalysis.suggestedTasks.length === 0) return;
    
    // Map raw suggestions to team list
    const mappedTasks = aiAnalysis.suggestedTasks.map(t => {
      // Find suitable team member ID matching target role keyword (e.g. Developer -> tm3, Designer -> tm4)
      let matchedMemberId = 'tm3'; // default to Tanvir (Developer)
      const keyword = t.assignedTo.toLowerCase();
      if (keyword.includes('design') || keyword.includes('art') || keyword.includes('figma')) {
        matchedMemberId = 'tm4'; // Fariha
      } else if (keyword.includes('test') || keyword.includes('qa') || keyword.includes('bug')) {
        matchedMemberId = 'tm5'; // Sadman
      } else if (keyword.includes('manage') || keyword.includes('coord')) {
        matchedMemberId = 'tm2'; // Tasnim
      }

      return {
        title: t.title,
        description: `Suggested automatically during meeting: "${activeBoardroomMeeting?.title}". Discussion points: "${t.title}".`,
        assignedToId: matchedMemberId,
        dueDate: '2026-06-15',
        priority: t.priority,
        status: 'Pending' as const
      };
    });

    onAutoAddGeneratedTasks(mappedTasks);
    setTaskAddedFeedback(true);
  };

  const text = {
    en: {
      header: 'Virtual Tech Boardrooms',
      scheduler: 'Register Company Session',
      addBtn: 'Schedule Session',
      title: 'Meeting Focus Area',
      time: 'Date & Clock Time',
      duration: 'Planned Duration (Min)',
      agenda: 'Active Board Strategy Context',
      participants: 'Session Participants',
      submitBtn: 'Schedule Meeting',
      joinBoard: 'Join Boardroom',
      noMeetings: 'No sessions scheduled currently.',
      logs: 'Collaborative Board Minutes & Notes',
      aiSummary: 'Gemini Executive Session Recaps',
      suggestedTasks: 'Gemini Technical Tasks suggestions',
      convertTasks: 'Accept & Delegate Tasks',
      tasksDelegated: 'Tasks successfully added to Scrum Board!'
    },
    bn: {
      header: 'ভার্চুয়াল টেক বোর্ডরুম ও মিটিং',
      scheduler: 'নতুন টিম সেশন শিডিউল করুন',
      addBtn: 'মিটিং শিডিউল করুন',
      title: 'মিটিংয়ের বিষয়বস্তু',
      time: 'তারিখ ও সময়',
      duration: 'মেয়াদ (মিনিট)',
      agenda: 'আলোচনার এজেন্ডা',
      participants: 'মিটিংয়ে উপস্থিত টিম মেম্বার্স',
      submitBtn: 'মিটিং রেজিস্টার করুন',
      joinBoard: 'বোর্ডরুমে যোগ দিন',
      noMeetings: 'বর্তমানে কোনো মিটিং শিডিউল করা নেই।',
      logs: 'রিয়েল-টাইম মিটিং ডিলবারেশন ও নোটস',
      aiSummary: 'জেমিনি এআই এডিটরিয়াল রিক্যাপ',
      suggestedTasks: 'মিটিং থেকে সুপারিশকৃত টিম কাজ',
      convertTasks: 'কাজসমূহ টিমকে বরাদ্দ করুন',
      tasksDelegated: 'সব কাজ সফলভাবে টাস্ক বোর্ডে যুক্ত হয়েছে!'
    }
  }[language];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-5 gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">{text.header}</h2>
          <p className="text-sm text-slate-400 mt-1">
            {language === 'en' 
              ? 'Coordinate alignment meetings and leverage server-side Gemini to extract summary deliverables.' 
              : 'টিমদের নিয়ে মিটিং আয়োজন করুন এবং জেমিনি এআই এর সাহায্যে আলোচনার সারাংশ ও স্বয়ংক্রিয় টাস্ক তৈরি করুন।'}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl transition text-sm shadow-lg shadow-indigo-505/20 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          {text.addBtn}
        </button>
      </div>

      {/* Main Grid: Pending Sessions list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        
        {/* Left Hand: Meetings scheduled */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-bold font-mono uppercase text-indigo-300 tracking-wider">
            {language === 'en' ? 'Planned company calls' : 'অনলাইন আলোচনা তালিকা'}
          </h3>
          
          {meetings.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-4">{text.noMeetings}</p>
          ) : (
            <div className="space-y-3">
              {meetings.map((meet) => (
                <div key={meet.id} className="bg-white/5 border border-white/10 hover:border-white/15 hover:bg-white/10 rounded-2xl p-4 transition-all space-y-3 shadow-xl">
                  <div className="flex justify-between items-start">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase border ${meet.isCompleted ? 'bg-white/5 text-slate-405 border-white/5' : 'bg-rose-500/15 text-rose-450 border border-rose-505/25 animate-pulse'}`}>
                      {meet.isCompleted ? (language === 'en' ? 'Completed' : 'সম্পন্ন') : (language === 'en' ? 'Live Scheduled' : 'লাইভ শিডিউল')}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">{meet.duration} Min</span>
                  </div>

                  <div>
                     <h4 className="font-bold text-white text-sm">{meet.title}</h4>
                     <p className="text-xs text-slate-355 mt-1 line-clamp-2 leading-relaxed">{meet.agenda}</p>
                  </div>

                  <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                    <Calendar className="h-3 w-3 shrink-0" />
                    <span className="text-slate-200">{meet.dateTime.replace('T', ' ')}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2.5 border-t border-white/5">
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {meet.participants.map(pid => {
                        const m = team.find(mb => mb.id === pid);
                        return m ? (
                          <img 
                            key={pid} 
                            src={m.avatar} 
                            alt={m.name} 
                            title={m.name} 
                            referrerPolicy="no-referrer"
                            className="inline-block h-5 w-5 rounded-full ring-2 ring-slate-800 object-cover" 
                          />
                        ) : null;
                      })}
                    </div>
                    <button
                      onClick={() => {
                        setActiveBoardroomMeeting(meet);
                        setAiAnalysis(null);
                        setTaskAddedFeedback(false);
                      }}
                      className="text-xs bg-indigo-500/25 hover:bg-indigo-500/35 border border-indigo-400/30 text-indigo-300 font-bold py-1 px-3 rounded-lg flex items-center gap-1 transition cursor-pointer"
                    >
                      <Video className="h-3 w-3" />
                      {text.joinBoard}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Hand: Interactive boardroom active frame */}
        <div className="lg:col-span-2 text-xs">
          {activeBoardroomMeeting ? (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6">
              
              {/* Active room banner */}
              <div className="flex justify-between items-start border-b border-white/10 pb-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-[#6366f1]/15 rounded-xl flex items-center justify-center text-indigo-300 border border-indigo-400/20 shrink-0">
                    <Video className="h-5 w-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-base">{activeBoardroomMeeting.title}</h3>
                    <p className="text-xs text-indigo-300 font-bold">Agenda: {activeBoardroomMeeting.agenda}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveBoardroomMeeting(null)} 
                  className="text-slate-400 hover:text-white transition shrink-0 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Discussion logs notes text field */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-350 font-mono">{text.logs}</label>
                <textarea
                  value={discussionNotes}
                  onChange={(e) => setDiscussionNotes(e.target.value)}
                  rows={6}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-xs font-mono outline-none focus:border-slate-400 focus:bg-white/10 leading-relaxed text-white"
                  placeholder="Type real-time discussions or copy-paste transcripts here..."
                />
              </div>

              {/* Ask Gemini buttons */}
              <div className="flex justify-end">
                <button
                  onClick={analyzeBoardroomDiscussion}
                  disabled={isAiAnalyzing}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl transition text-xs cursor-pointer shadow-lg shadow-indigo-505/20"
                >
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  {isAiAnalyzing ? 'Gemini parsing notes...' : 'Summarize & Auto-Assign Tasks (AI)'}
                </button>
              </div>

              {/* Gemini response pane */}
              {aiAnalysis && (
                <div className="bg-black/35 border border-indigo-500/20 backdrop-blur-md text-white rounded-3xl p-6 space-y-5 shadow-2xl animate-fade-in">
                  
                  {/* Summary */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase text-indigo-300 font-mono tracking-wider flex items-center gap-2">
                      <FileText className="h-4 w-4 text-indigo-400" />
                      {text.aiSummary}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{aiAnalysis.summary}</p>
                  </div>

                  <hr className="border-white/10" />

                  {/* Actions checklist */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-xs font-black uppercase text-slate-400 font-mono tracking-wider">Key Takeaways</h4>
                      <ul className="space-y-1 text-xs text-slate-350 font-mono pl-3 list-disc">
                        {aiAnalysis.actionPoints.map((pt, idx) => (
                          <li key={idx} className="leading-relaxed text-slate-300">{pt}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Auto suggested tasks mapping */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-black uppercase text-indigo-300 font-mono tracking-wider">
                          {text.suggestedTasks}
                        </h4>
                        {!taskAddedFeedback && (
                          <button
                            onClick={handleInjectAiSuggestedTasks}
                            className="bg-indigo-500/25 border border-indigo-400/50 hover:bg-indigo-500/35 hover:text-white text-[10px] font-bold px-2.5 py-1 rounded-md transition cursor-pointer"
                          >
                            {text.convertTasks}
                          </button>
                        )}
                      </div>

                      {taskAddedFeedback ? (
                        <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 p-2.5 rounded-xl text-xs flex items-center gap-2 font-bold">
                          <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-450" />
                          <span>{text.tasksDelegated}</span>
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                          {aiAnalysis.suggestedTasks.map((t, idx) => (
                            <div key={idx} className="bg-white/5 p-2.5 rounded-xl border border-white/5 flex justify-between items-center text-xs gap-3">
                              <div>
                                <span className="font-bold text-slate-200 block">{t.title}</span>
                                <span className="text-[10px] text-slate-400 font-mono">Assigned role: {t.assignedTo}</span>
                              </div>
                              <span className="text-[9px] font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/25 uppercase font-mono shrink-0">
                                {t.priority}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}

            </div>
          ) : (
            <div className="border border-dashed border-white/10 bg-white/5 backdrop-blur-md rounded-3xl p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-3 min-h-[300px]">
              <Video className="h-8 w-8 text-slate-400 animate-pulse" />
              <p className="text-sm max-w-sm leading-relaxed">
                {language === 'en' 
                  ? 'Click "Join Boardroom" on any planned meeting to trigger live boardroom logging and AI summaries.' 
                  : 'যেকোনো মিটিংয়ের ডুপ্লিকেট বোর্ডরুমে প্রবেশ করতে "বোর্ডরুমে যোগ দিন" বাটনে ক্লিক করুন।'}
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Add meeting modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#151c2e]/95 backdrop-blur-2xl border border-white/10 rounded-3xl w-full max-w-md p-6 shadow-2xl relative text-xs text-white">
            <h3 className="text-lg font-black text-white mb-4">{text.scheduler}</h3>
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <form onSubmit={handleSubmitMeeting} className="space-y-4 text-xs mt-2">
              <div>
                <label className="block text-slate-300 font-bold mb-1">{text.title} *</label>
                <input 
                  type="text" 
                  required 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl p-2.5 outline-none focus:border-indigo-400 focus:bg-white/10"
                  placeholder="e.g. Milestone 2 Sprint Planning"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">{text.time} *</label>
                  <input 
                    type="datetime-local" 
                    required 
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl p-2 outline-none focus:border-indigo-400 font-mono focus:bg-white/10"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">{text.duration} *</label>
                  <input 
                    type="number" 
                    required 
                    value={duration || ''}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl p-2 outline-none focus:border-indigo-400 font-mono focus:bg-white/10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">{text.agenda} *</label>
                <input 
                  type="text" 
                  required 
                  value={agenda}
                  onChange={(e) => setAgenda(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl p-2.5 outline-none focus:border-indigo-400 focus:bg-white/10"
                  placeholder="State the deliverables or outcomes needed."
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">{text.participants} (Select Multiple)</label>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {team.map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => toggleParticipant(m.id)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition duration-200 cursor-pointer ${
                        selectedParticipants.includes(m.id)
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/15'
                      }`}
                    >
                      {m.name.split(' ')[0]} ({m.role})
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 px-4 rounded-xl transition hover:from-blue-600 hover:to-indigo-700 shadow-md shadow-indigo-500/10 cursor-pointer"
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
