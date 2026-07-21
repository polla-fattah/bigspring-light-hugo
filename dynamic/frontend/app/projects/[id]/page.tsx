import React from 'react';
import Link from 'next/link';
import { Layers, Calendar, Users, MessageSquare, ArrowLeft, Send } from 'lucide-react';
import { fetchFromBackend } from '../../../lib/api';

interface UnitSummary {
  id: string;
  title: string;
}

interface TeamMember {
  id: string;
  title: string;
  subtitle: string | null;
  image: string | null;
  titlePosition: string | null;
  email: string | null;
}

interface DiscussionMessage {
  id: number;
  message: string;
  createdAt: string;
  sender: {
    id: string;
    title: string;
    image: string | null;
  };
}

interface ProjectDetail {
  id: string;
  title: string;
  name: string;
  description: string | null;
  image: string | null;
  status: string;
  visibility: string;
  year: string | null;
  projectType: string | null;
  unit: UnitSummary | null;
  team: TeamMember[];
  discussionMessages: DiscussionMessage[];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  let detail: ProjectDetail | null = null;
  let errorMsg = '';

  try {
    detail = await fetchFromBackend<ProjectDetail>(`/api/projects/${id}`);
  } catch (err) {
    errorMsg = 'Could not load project details.';
  }

  if (errorMsg || !detail) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <p className="text-sm text-red-600 font-bold">{errorMsg || 'Project not found.'}</p>
          <Link href="/projects" className="sue-btn-primary px-6 py-2.5 rounded-xl text-xs font-bold block text-center">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Back Link */}
        <div>
          <Link href="/projects" className="text-xs font-bold text-slate-500 hover:text-[var(--primary-maroon)] flex items-center space-x-1.5 w-fit">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects list</span>
          </Link>
        </div>

        {/* Project Hero Details */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex flex-wrap gap-2 items-center">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wide ${
              detail.status === 'ongoing'
                ? 'bg-amber-50 text-amber-700 border border-amber-100'
                : 'bg-green-50 text-green-700 border border-green-100'
            }`}>
              {detail.status}
            </span>
            {detail.projectType && (
              <span className="text-[10px] font-bold text-slate-400">
                {detail.projectType}
              </span>
            )}
            {detail.year && (
              <span className="text-[10px] text-slate-400 flex items-center space-x-1 font-semibold ml-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Year: {detail.year}</span>
              </span>
            )}
          </div>

          <div className="space-y-2">
            {detail.unit && (
              <p className="text-xs font-bold text-[var(--accent-gold)] uppercase tracking-wider">
                Unit: {detail.unit.title}
              </p>
            )}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--secondary-blue)] tracking-tight">
              {detail.title}
            </h1>
          </div>

          <p className="text-sm text-slate-500 leading-relaxed max-w-4xl pt-2">
            {detail.description || 'No detailed project logging description is currently specified.'}
          </p>
        </div>

        {/* Dynamic bottom blocks layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Block: Team members */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-[var(--secondary-blue)] flex items-center space-x-2 border-b border-slate-100 pb-4">
                <Users className="w-5 h-5 text-[var(--primary-maroon)]" />
                <span>Research Team ({detail.team.length})</span>
              </h3>

              {detail.team.length === 0 ? (
                <p className="text-xs text-slate-400">No team members registered for this project.</p>
              ) : (
                <div className="space-y-4">
                  {detail.team.map((member) => (
                    <div key={member.id} className="flex items-center space-x-3 p-2.5 rounded-xl hover:bg-slate-50 border border-transparent transition-all">
                      <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {member.title.charAt(0)}
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="text-xs font-bold text-[var(--secondary-blue)] truncate">
                          <Link href={`/staff/${member.id}`} className="hover:underline">
                            {member.title}
                          </Link>
                        </h4>
                        <p className="text-[9px] text-slate-450 truncate mt-0.5">
                          {member.titlePosition || member.subtitle || 'Researcher'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Block: Discussion Board / Feedback logging */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 flex flex-col h-[400px] justify-between">
              
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[var(--secondary-blue)] flex items-center space-x-2 border-b border-slate-100 pb-4">
                  <MessageSquare className="w-5 h-5 text-[var(--primary-maroon)]" />
                  <span>Project Discussion Board ({detail.discussionMessages.length})</span>
                </h3>

                {/* Messages listing */}
                <div className="space-y-4 overflow-y-auto max-h-[220px] pr-2">
                  {detail.discussionMessages.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No message entries logged yet. Post a message to collaborate with the team.</p>
                  ) : (
                    detail.discussionMessages.map((msg) => (
                      <div key={msg.id} className="flex items-start space-x-3 text-xs">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-[var(--primary-maroon)] flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                          {msg.sender.title.charAt(0)}
                        </div>
                        <div className="bg-slate-50 border border-slate-150 p-3 rounded-2xl flex-grow space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-extrabold text-[var(--secondary-blue)]">{msg.sender.title}</span>
                            <span className="text-[9px] text-slate-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-slate-600 font-medium leading-relaxed">{msg.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Message Input Panel (Mock Client Action) */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-1.5 focus-within:ring-2 focus-within:ring-[var(--primary-maroon)] focus-within:border-transparent transition-all">
                  <input 
                    type="text" 
                    placeholder="Post a status update or team coordination note..."
                    className="w-full bg-transparent border-0 text-xs text-slate-700 placeholder-slate-400 focus:ring-0 focus:outline-none px-2 py-2"
                    disabled
                  />
                  <button className="p-2.5 rounded-lg bg-[var(--primary-maroon)] hover:bg-[var(--primary-maroon-hover)] text-white transition-colors" disabled>
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[10px] text-slate-350 mt-2 text-right">Must login to portal access to send messages.</p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
