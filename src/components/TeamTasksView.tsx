import React, { useState } from 'react';
import { TeamMember, Task, TaskPriority, TaskStatus } from '../types';
import { Plus, Users, Calendar, Clock, AlertCircle, FileCheck, CheckCircle2, RefreshCw, X, Sparkles } from 'lucide-react';

interface TeamTasksViewProps {
  team: TeamMember[];
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onUpdateTaskStatus: (taskId: string, status: TaskStatus, submissionNote?: string) => void;
  language: 'en' | 'bn';
}

export default function TeamTasksView({ team, tasks, onAddTask, onUpdateTaskStatus, language }: TeamTasksViewProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeProfileId, setActiveProfileId] = useState<string>('tm1'); // Default to Admin
  
  // New Task state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedToId, setAssignedToId] = useState('tm3');
  const [dueDate, setDueDate] = useState('2026-06-15');
  const [priority, setPriority] = useState<TaskPriority>('Medium');

  // Submit task notes state
  const [isSubmittingTaskId, setIsSubmittingTaskId] = useState<string | null>(null);
  const [submissionNote, setSubmissionNote] = useState('');

  const submitNewTaskForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !assignedToId) return;
    onAddTask({
      title,
      description,
      assignedToId,
      dueDate,
      priority,
      status: 'Pending'
    });
    // reset
    setTitle('');
    setDescription('');
    setAssignedToId('tm3');
    setDueDate('2026-06-15');
    setPriority('Medium');
    setShowAddModal(false);
  };

  const handleProgressSubmission = (taskId: string) => {
    onUpdateTaskStatus(taskId, 'Submitted', submissionNote);
    setSubmissionNote('');
    setIsSubmittingTaskId(null);
  };

  const activeEmployee = team.find(m => m.id === activeProfileId);

  // Filter tasks based on selected profile (if acting as that employee. Admin sees all tasks.)
  const displayedTasks = activeEmployee?.role === 'Admin' || activeEmployee?.role === 'Project Manager'
    ? tasks 
    : tasks.filter(t => t.assignedToId === activeProfileId);

  const text = {
    en: {
      teamTitle: 'Team Directory & Action Hub',
      assignTitle: 'Assign New Task To Team',
      profileSim: 'Simulate User Profile',
      taskHeader: 'Active Task Checklist',
      assignTask: 'Delegate Task',
      taskTitle: 'Task Headline/Goal',
      desc: 'Description & Scope of Work',
      dueDate: 'Target Deadline',
      priority: 'Priority Level',
      assignee: 'Responsible Team Member',
      submitBtn: 'Delegate Task',
      noTasks: 'No active tasks found for selected layout.',
      asEmployee: 'You are now simulating:',
      ownerReview: 'Pending Approval Tasks',
      approve: 'Accept Work',
      reject: 'Request Revision',
      submitLabel: 'Submit Finished Task',
      subPrompt: 'Describe what you completed, link repos or notes:',
      complete: 'Completed'
    },
    bn: {
      teamTitle: 'কোম্পানি টিম ডিরেক্টরি ও টাস্ক ফোরাম',
      assignTitle: 'নতুন টাস্ক বা দায়িত্ব বরাদ্দ করুন',
      profileSim: 'সদস্য প্রোফাইল পরিবর্তন করুন',
      taskHeader: 'দায়িত্ব ও টাস্কসমূহ',
      assignTask: 'নতুন টাস্ক দিন',
      taskTitle: 'টাস্কের শিরোনাম',
      desc: 'কাজের বিস্তারিত বিবরণ ও স্কোপ',
      dueDate: 'জমা দেওয়ার শেষ সময়',
      priority: 'গুরুত্ব / অগ্রাধিকার',
      assignee: 'দ্বায়িত্বপ্রাপ্ত টিম মেম্বার',
      submitBtn: 'টাস্ক বরাদ্দ করুন',
      noTasks: 'বর্তমানে কোনো একটিভ কাজ নেই।',
      asEmployee: 'আপনি বর্তমানে দেখছেন:',
      ownerReview: 'অনুমোদনের জন্য পেন্ডিং কাজ',
      approve: 'কাজ বুঝিয়ে নিন (Approve)',
      reject: 'পুনরায় কাজ করতে বলুন (Revision)',
      submitLabel: 'কাজ জমা দিন (Submit)',
      subPrompt: 'সম্পূর্ণ কাজের একটি লিংক বা নোট লিখুন:',
      complete: 'সম্পন্ন হয়েছে'
    }
  }[language];

  return (
    <div className="space-y-6">
      {/* Simulation Banner */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-lg text-xs">
        <div className="flex items-center gap-3">
          <div className="bg-[#6366f1]/15 p-2.5 rounded-xl text-indigo-300 border border-indigo-500/20">
            <RefreshCw className="h-5 w-5 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-indigo-300/80 font-mono">{text.profileSim}</h4>
            <p className="text-sm font-bold text-white">
              {text.asEmployee} <span className="text-indigo-300 font-mono underline">{activeEmployee?.name} ({activeEmployee?.role})</span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {team.map(member => (
            <button
              key={member.id}
              onClick={() => setActiveProfileId(member.id)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                activeProfileId === member.id 
                  ? 'bg-indigo-600/30 border border-indigo-400/55 text-indigo-200' 
                  : 'bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300'
              }`}
            >
              {member.name.split(' ')[0]} ({member.role === 'Admin' ? 'CEO' : member.role})
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Hand: Team Dashboard List */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl text-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white text-base">{language === 'en' ? 'Active Team' : 'টিম মেম্বার্স'}</h3>
              <Users className="h-4.5 w-4.5 text-slate-400" />
            </div>
            <div className="space-y-4">
              {team.map(member => {
                const totalAssigned = tasks.filter(t => t.assignedToId === member.id).length;
                const completed = tasks.filter(t => t.assignedToId === member.id && t.status === 'Completed').length;

                return (
                  <div 
                    key={member.id} 
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      activeProfileId === member.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5 hover:border-white/10 bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={member.avatar} alt={member.name} referrerPolicy="no-referrer" className="h-10 w-10 rounded-xl object-cover" />
                      <div>
                        <h4 className="font-bold text-white text-sm">{member.name}</h4>
                        <span className="text-[10px] bg-white/5 text-slate-300 border border-white/10 px-2.5 py-0.5 rounded-full font-mono">
                          {member.role}
                        </span>
                      </div>
                    </div>
                    <div className="text-right font-mono text-xs">
                      <div className="font-bold text-slate-200">{completed}/{totalAssigned}</div>
                      <div className="text-[9px] text-slate-400">{language === 'en' ? 'Tasks' : 'সম্পন্ন টাস্ক'}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick delegate button for admins */}
          {(activeEmployee?.role === 'Admin' || activeEmployee?.role === 'Project Manager') && (
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/15"
            >
              <Plus className="h-5 w-5" />
              {text.assignTask}
            </button>
          )}
        </div>

        {/* Right Hand: Interactive tasks board */}
        <div className="lg:col-span-2 space-y-6 text-xs">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl">
            <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
              <Clock className="h-4.5 w-4.5 text-slate-400" />
              {text.taskHeader} - <span className="text-indigo-300 font-mono font-black">{displayedTasks.length}</span>
            </h3>

            {displayedTasks.length === 0 ? (
              <p className="text-center py-10 text-slate-400 italic text-sm">{text.noTasks}</p>
            ) : (
              <div className="space-y-4">
                {displayedTasks.map(task => {
                  const assignee = team.find(m => m.id === task.assignedToId);
                  
                  return (
                    <div key={task.id} className="border border-white/10 hover:border-white/15 p-5 rounded-2xl bg-white/5 shadow-md space-y-3 transition-all">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                        <div>
                          <h4 className="font-bold text-white text-base">{task.title}</h4>
                          <p className="text-xs text-slate-350 mt-1 leading-relaxed">{task.description}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase border ${
                            task.priority === 'High' ? 'bg-rose-500/15 text-rose-400 border-rose-500/20' :
                            task.priority === 'Medium' ? 'bg-amber-500/15 text-amber-400 border-amber-500/20' : 'bg-white/5 text-slate-300 border-white/10'
                          }`}>
                            {task.priority}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase border ${
                            task.status === 'Completed' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' :
                            task.status === 'Submitted' ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/20' :
                            task.status === 'In Progress' ? 'bg-blue-500/15 text-blue-400 border-blue-500/20' : 'bg-white/5 text-slate-400 border-white/10'
                          }`}>
                            {task.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-t border-white/10 pt-3 text-slate-400">
                        <div className="flex items-center gap-2">
                          <img src={assignee?.avatar} alt={assignee?.name} referrerPolicy="no-referrer" className="h-5 w-5 rounded-full object-cover" />
                          <span className="font-bold text-indigo-200">{assignee?.name}</span>
                        </div>
                        <div className="flex items-center gap-1 font-mono text-[11px]">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{text.dueDate}: <strong className="text-slate-200">{task.dueDate}</strong></span>
                        </div>
                      </div>

                      {/* Submission commentary info if available */}
                      {task.submissionNote && (
                        <div className="mt-2 bg-black/30 p-3 rounded-lg border border-white/5 text-xs text-slate-300">
                          <strong className="block font-bold mb-1 text-white">
                            {language === 'en' ? 'Employee submission notes:' : 'জমা দেয়ার বিবরণ ও মন্তব্য:'}
                          </strong>
                          "{task.submissionNote}"
                        </div>
                      )}

                      {/* Direct action panel for simulation */}
                      <div className="flex justify-end gap-2.5 pt-1">
                        
                        {/* 1. As Employee: submit completed parts */}
                        {activeProfileId === task.assignedToId && task.status !== 'Completed' && task.status !== 'Submitted' && (
                          <>
                            {task.status === 'Pending' && (
                              <button
                                onClick={() => onUpdateTaskStatus(task.id, 'In Progress')}
                                className="text-xs bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 text-indigo-300 font-bold py-1.5 px-3 rounded-lg transition-all cursor-pointer"
                              >
                                {language === 'en' ? 'Accept / Start Work' : 'কাজ শুরু করুন'}
                              </button>
                            )}
                            {task.status === 'In Progress' && (
                              <button
                                onClick={() => setIsSubmittingTaskId(task.id)}
                                className="text-xs bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 text-amber-300 font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                              >
                                <Sparkles className="h-3 w-3" />
                                {text.submitLabel}
                              </button>
                            )}
                          </>
                        )}

                        {/* 2. As Owner/PM: review and accept submissions */}
                        {(activeEmployee?.role === 'Admin' || activeEmployee?.role === 'Project Manager') && task.status === 'Submitted' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => onUpdateTaskStatus(task.id, 'Completed')}
                              className="text-xs bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-emerald-300 py-1.5 px-3 rounded-lg font-bold transition-all cursor-pointer"
                            >
                              {text.approve}
                            </button>
                            <button
                              onClick={() => {
                                // Push back to In progress with revision request
                                onUpdateTaskStatus(task.id, 'In Progress', 'Revision Request: Please refine code delivery.');
                              }}
                              className="text-xs bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-300 py-1.5 px-3 rounded-lg font-bold transition-all cursor-pointer"
                            >
                              {text.reject}
                            </button>
                          </div>
                        )}
                        
                      </div>

                      {/* Floating mini form for submitting notes */}
                      {isSubmittingTaskId === task.id && (
                        <div className="mt-3 bg-black/40 p-4 rounded-xl border border-white/10 space-y-3 shadow-inner">
                          <label className="block text-xs font-bold text-amber-400">{text.subPrompt}</label>
                          <textarea
                            value={submissionNote}
                            onChange={(e) => setSubmissionNote(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-amber-400"
                            placeholder="e.g. Completed page designs. Git link: github.com/innovix/ecommerce-design"
                            rows={2}
                          />
                          <div className="flex justify-end gap-2 text-xs font-bold pt-1">
                            <button 
                              onClick={() => setIsSubmittingTaskId(null)}
                              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 text-slate-350 transition"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={() => handleProgressSubmission(task.id)}
                              className="px-4 py-1.5 bg-amber-500/25 border border-amber-400/30 hover:bg-amber-500/35 text-amber-300 rounded-lg transition"
                            >
                              Send Deliverables
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Task Creation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in text-xs">
          <div className="bg-[#151c2e]/95 backdrop-blur-2xl border border-white/10 rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
            <h3 className="text-lg font-black text-white mb-4">{text.assignTitle}</h3>
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
            <form onSubmit={submitNewTaskForm} className="space-y-4 mt-2">
              <div>
                <label className="block font-bold text-slate-300 mb-1">{text.taskTitle} *</label>
                <input 
                  type="text" 
                  required 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 outline-none focus:border-indigo-400 text-white placeholder-slate-400 font-sans"
                  placeholder="e.g. Set up database indices for transactions"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">{text.desc} *</label>
                <textarea 
                  required 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 outline-none focus:border-indigo-400 text-xs text-white placeholder-slate-400 font-sans"
                  placeholder="Explain requirements, deliverables, and specific rules..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">{text.dueDate} *</label>
                  <input 
                    type="date" 
                    required 
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 outline-none focus:border-indigo-400 font-mono text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">{text.priority} *</label>
                  <select 
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 outline-none focus:border-indigo-400 text-white bg-slate-900 cursor-pointer"
                  >
                    <option value="Low" className="bg-slate-900">Low</option>
                    <option value="Medium" className="bg-slate-900">Medium</option>
                    <option value="High" className="bg-slate-900">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">{text.assignee} *</label>
                <select 
                  value={assignedToId}
                  onChange={(e) => setAssignedToId(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 outline-none focus:border-indigo-400 text-white bg-slate-900 cursor-pointer"
                >
                  {team.filter(m => m.role !== 'Admin').map(m => (
                    <option key={m.id} value={m.id} className="bg-slate-900">{m.name} ({m.role})</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-750 text-white font-bold py-3 px-4 rounded-xl transition shadow-lg shadow-indigo-505/10 cursor-pointer text-sm"
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
