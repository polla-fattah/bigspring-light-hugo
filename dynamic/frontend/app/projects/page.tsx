import React from 'react';
import Link from 'next/link';
import { Layers, Calendar, Users, ArrowRight, Activity } from 'lucide-react';
import { fetchFromBackend } from '../../lib/api';

interface UnitSummary {
  id: string;
  title: string;
}

interface TeamMember {
  id: string;
  title: string;
  image: string | null;
}

interface Project {
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
}

export default async function ProjectsPage() {
  let projectList: Project[] = [];
  let errorMsg = '';

  try {
    projectList = await fetchFromBackend<Project[]>('/api/projects');
  } catch (err) {
    errorMsg = 'Could not load research projects list.';
  }

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title details */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-red-50 text-[var(--primary-maroon)] tracking-wider uppercase">
            SUE Project Log
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--secondary-blue)] tracking-tight">
            Scientific Research Projects
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Browse active and completed projects managed by researchers and research units inside Salahaddin University-Erbil.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl text-xs max-w-lg mx-auto text-center">
            {errorMsg}
          </div>
        )}

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projectList.map((project) => (
            <div 
              key={project.id} 
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm sue-card flex flex-col justify-between"
            >
              <div className="space-y-4">
                
                {/* Status Badges */}
                <div className="flex justify-between items-center">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wide ${
                    project.status === 'ongoing'
                      ? 'bg-amber-50 text-amber-700 border border-amber-100'
                      : 'bg-green-50 text-green-700 border border-green-100'
                  }`}>
                    {project.status}
                  </span>
                  {project.projectType && (
                    <span className="text-[10px] font-bold text-slate-400">
                      {project.projectType}
                    </span>
                  )}
                </div>

                {/* Project Title */}
                <div className="space-y-1.5">
                  <h3 className="text-base font-extrabold text-[var(--secondary-blue)] hover:text-[var(--primary-maroon)] transition-colors leading-snug">
                    <Link href={`/projects/${project.id}`}>
                      {project.title}
                    </Link>
                  </h3>
                  {project.unit && (
                    <p className="text-[10px] font-bold text-[var(--accent-gold)] uppercase tracking-wider">
                      Unit: {project.unit.title}
                    </p>
                  )}
                </div>

                {/* Description Preview */}
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                  {project.description || 'No project description available.'}
                </p>

                {/* Team Members List */}
                {project.team && project.team.length > 0 && (
                  <div className="pt-2">
                    <h5 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                      Research Team:
                    </h5>
                    <div className="flex -space-x-2 overflow-hidden">
                      {project.team.slice(0, 5).map((member) => (
                        <Link 
                          key={member.id} 
                          href={`/staff/${member.id}`} 
                          title={member.title}
                          className="inline-block w-8 h-8 rounded-full bg-slate-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-[var(--primary-maroon)] hover:scale-105 transition-all"
                        >
                          {member.title.charAt(0)}
                        </Link>
                      ))}
                      {project.team.length > 5 && (
                        <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[9px] font-bold text-slate-500">
                          +{project.team.length - 5}
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>

              {/* Footer action bar */}
              <div className="pt-5 border-t border-slate-100 mt-6 flex justify-between items-center text-xs font-bold">
                {project.year ? (
                  <span className="text-slate-455 flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Year: {project.year}</span>
                  </span>
                ) : (
                  <span className="text-slate-350">No timeline listed</span>
                )}
                
                <Link 
                  href={`/projects/${project.id}`}
                  className="text-[var(--primary-maroon)] hover:underline flex items-center space-x-1.5"
                >
                  <span>Project logs</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
