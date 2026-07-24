import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth, signOut } from '../../../auth';
import { fetchFromBackend } from '../../../lib/api';
import { 
  User, 
  Layers, 
  BookOpen, 
  Calendar, 
  Settings, 
  ShieldAlert, 
  LogOut, 
  FolderLock, 
  Clock, 
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';

export default async function AdminDashboardPage() {
  const session = await auth();

  // If not logged in, redirect to login page
  if (!session || !session.user) {
    redirect('/admin/login');
  }

  const user = session.user as any;
  const userRole = user.role || 'researcher';

  // Quick action options based on user roles
  const researcherActions = [
    { title: 'My Staff Profile', desc: 'Update public bio, research areas, and links.', href: '/admin/profile', icon: User },
    { title: 'Project Coordination', desc: 'View active projects and write coordination notes.', href: '/projects', icon: Layers },
    { title: 'Publishing Records', desc: 'View associated publications and submit data.', href: '/publications', icon: BookOpen },
    { title: 'Book Laboratory Equipment', desc: 'Schedule equipment hours and view bookings.', href: '/labs', icon: Calendar }
  ];

  const labStaffActions = [
    { title: 'Equipment Scheduling Inventory', desc: 'Manage laboratory equipment capacity and status.', href: '/labs', icon: Settings },
    { title: 'Manage Pending Reservations', desc: 'Approve or deny researcher reservation requests.', href: '/labs', icon: Clock },
  ];

  const superadminActions = [
    { title: 'Review Content Approvals', desc: 'Toggle draft mode for projects, staff profiles, and units.', href: '/units', icon: FolderLock },
    { title: 'System Configurations', desc: 'Change vision, mission, and homepage metadata.', href: '/', icon: Settings },
    { title: 'Research Datasets Registry', desc: 'Audit open data catalog uploads and accessibility.', href: '/datasets', icon: FileSpreadsheet },
  ];

  let staffDetails: any = null;
  if (user.staffId) {
    try {
      staffDetails = await fetchFromBackend<any>(`/api/staff/${user.staffId}`);
    } catch (err) {
      console.error('Failed to load researcher dashboard contributions:', err);
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Welcome Dashboard Profile Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                userRole === 'superadmin' ? 'bg-red-100 text-[var(--primary-maroon)]' : 
                userRole === 'lab_staff' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {userRole.replace('_', ' ')}
              </span>
              <span className="text-slate-350 text-xs font-semibold">Logged in securely</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[var(--secondary-blue)] tracking-tight">
              Welcome back, {user.name || 'SUE Researcher'}
            </h1>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Managing portal operations for email: <span className="text-[var(--secondary-blue)] font-bold">{user.email}</span>
            </p>
          </div>

          <form action={async () => {
            'use server';
            await signOut({ redirectTo: '/admin/login' });
          }}>
            <button className="flex items-center space-x-2 px-5 py-3 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-[var(--primary-maroon)] transition-all cursor-pointer">
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </form>
        </div>

        {/* Dashboard Grid Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1 & 2: Main workspace actions */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Researcher Console */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-[var(--secondary-blue)]">Researcher Workspace</h3>
                <p className="text-xs text-slate-400 font-medium">Standard options accessible for all SUE academic researchers.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {researcherActions.map((action) => (
                  <Link key={action.title} href={action.href} className="p-5 rounded-2xl border border-slate-150 bg-slate-50/50 hover:bg-white hover:border-[var(--primary-maroon)] group transition-all duration-300 flex flex-col justify-between h-40">
                    <div className="space-y-2">
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-[var(--primary-maroon)] group-hover:border-[var(--primary-maroon)] transition-colors">
                        <action.icon className="w-5 h-5" />
                      </div>
                      <h4 className="text-xs font-bold text-[var(--secondary-blue)]">{action.title}</h4>
                      <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{action.desc}</p>
                    </div>
                    <span className="text-[10px] font-extrabold text-[var(--primary-maroon)] group-hover:underline flex items-center space-x-1 self-end mt-2">
                      <span>Open console</span>
                      <span>→</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Draft Content Submissions */}
            {user.staffId && (
              <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-[var(--secondary-blue)]">Draft Content Submissions</h3>
                  <p className="text-xs text-slate-400 font-medium">Propose new research items to the repository catalog. Admins will verify submissions before they go live.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link href="/admin/submit/publication" className="p-5 rounded-2xl border border-slate-150 bg-slate-50/50 hover:bg-white hover:border-[var(--primary-maroon)] group transition-all duration-300 flex flex-col justify-between h-36">
                    <div className="space-y-2">
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-[var(--primary-maroon)] group-hover:border-[var(--primary-maroon)] transition-colors">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <h4 className="text-xs font-bold text-[var(--secondary-blue)]">Draft Publication Proposal</h4>
                      <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Register a research paper, article, or thesis draft.</p>
                    </div>
                    <span className="text-[10px] font-extrabold text-[var(--primary-maroon)] group-hover:underline flex items-center space-x-1 self-end mt-2">
                      <span>Propose draft</span>
                      <span>→</span>
                    </span>
                  </Link>
                  <Link href="/admin/submit/project" className="p-5 rounded-2xl border border-slate-150 bg-slate-50/50 hover:bg-white hover:border-[var(--primary-maroon)] group transition-all duration-300 flex flex-col justify-between h-36">
                    <div className="space-y-2">
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-[var(--primary-maroon)] group-hover:border-[var(--primary-maroon)] transition-colors">
                        <Layers className="w-5 h-5" />
                      </div>
                      <h4 className="text-xs font-bold text-[var(--secondary-blue)]">Draft Project Proposal</h4>
                      <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Propose a collaborative or funded research study draft.</p>
                    </div>
                    <span className="text-[10px] font-extrabold text-[var(--primary-maroon)] group-hover:underline flex items-center space-x-1 self-end mt-2">
                      <span>Propose draft</span>
                      <span>→</span>
                    </span>
                  </Link>
                </div>
              </div>
            )}

            {/* Role Restricted Consoles (Lab Staff / Superadmin) */}
            {(userRole === 'lab_staff' || userRole === 'superadmin') && (
              <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-[var(--secondary-blue)] flex items-center space-x-2">
                    <ShieldAlert className="w-5 h-5 text-[var(--accent-gold)]" />
                    <span>Elevated Privileges Control</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">Management dashboards matching your SUE organizational role access level.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Lab Staff items */}
                  {(userRole === 'lab_staff' || userRole === 'superadmin') && labStaffActions.map((action) => (
                    <Link key={action.title} href={action.href} className="p-5 rounded-2xl border border-slate-150 bg-slate-50/50 hover:bg-white hover:border-[var(--accent-gold)] group transition-all duration-300 flex flex-col justify-between h-40">
                      <div className="space-y-2">
                        <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-[var(--accent-gold)] group-hover:border-[var(--accent-gold)] transition-colors">
                          <action.icon className="w-5 h-5" />
                        </div>
                        <h4 className="text-xs font-bold text-[var(--secondary-blue)]">{action.title}</h4>
                        <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{action.desc}</p>
                      </div>
                      <span className="text-[10px] font-extrabold text-[var(--accent-gold)] group-hover:underline flex items-center space-x-1 self-end mt-2">
                        <span>Access dashboard</span>
                        <span>→</span>
                      </span>
                    </Link>
                  ))}

                  {/* Superadmin items */}
                  {userRole === 'superadmin' && superadminActions.map((action) => (
                    <Link key={action.title} href={action.href} className="p-5 rounded-2xl border border-slate-150 bg-slate-50/50 hover:bg-white hover:border-[var(--primary-maroon)] group transition-all duration-300 flex flex-col justify-between h-40">
                      <div className="space-y-2">
                        <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-[var(--primary-maroon)] group-hover:border-[var(--primary-maroon)] transition-colors">
                          <action.icon className="w-5 h-5" />
                        </div>
                        <h4 className="text-xs font-bold text-[var(--secondary-blue)]">{action.title}</h4>
                        <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{action.desc}</p>
                      </div>
                      <span className="text-[10px] font-extrabold text-[var(--primary-maroon)] group-hover:underline flex items-center space-x-1 self-end mt-2">
                        <span>Configure system</span>
                        <span>→</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {/* Associated Contributions Card */}
            {staffDetails && (
              <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-[var(--secondary-blue)]">My Research Contributions</h3>
                  <p className="text-xs text-slate-400 font-medium">Overview of your linked publications and collaborative projects in SURC.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Collaborative Projects List */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 flex justify-between">
                      <span>My Projects ({staffDetails.projects?.length || 0})</span>
                      <Link href="/projects" className="text-[10px] text-[var(--primary-maroon)] lowercase font-bold hover:underline">View all</Link>
                    </h4>
                    {(!staffDetails.projects || staffDetails.projects.length === 0) ? (
                      <p className="text-xs text-slate-400 font-medium italic">No active projects linked to your profile.</p>
                    ) : (
                      <div className="space-y-2">
                        {staffDetails.projects.map((proj: any) => (
                          <div key={proj.id} className="p-3 bg-slate-50 rounded-xl border border-slate-150 flex justify-between items-center">
                            <Link href={`/projects/${proj.id}`} className="text-xs font-bold text-[var(--secondary-blue)] hover:underline truncate max-w-[180px]">
                              {proj.title}
                            </Link>
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-red-50 text-[var(--primary-maroon)]">
                              {proj.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Publications List */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 flex justify-between">
                      <span>My Publications ({staffDetails.publications?.length || 0})</span>
                      <Link href="/publications" className="text-[10px] text-[var(--primary-maroon)] lowercase font-bold hover:underline">View all</Link>
                    </h4>
                    {(!staffDetails.publications || staffDetails.publications.length === 0) ? (
                      <p className="text-xs text-slate-400 font-medium italic">No publications cataloged under your profile.</p>
                    ) : (
                      <div className="space-y-2">
                        {staffDetails.publications.map((pub: any) => (
                          <div key={pub.id} className="p-3 bg-slate-50 rounded-xl border border-slate-150 flex justify-between items-center">
                            <Link href={`/publications/${pub.id}`} className="text-xs font-bold text-[var(--secondary-blue)] hover:underline truncate max-w-[180px]">
                              {pub.title}
                            </Link>
                            <span className="text-[9px] text-slate-400 font-bold">
                              {pub.year || '2024'}
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

          {/* Column 3: User Details & Guides */}
          <div className="space-y-8">
            
            {/* Session Stats card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-[var(--secondary-blue)] border-b border-slate-100 pb-4">
                Session Metadata
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">User ID</span>
                  <span className="text-slate-700 font-mono font-bold truncate max-w-[150px]">{user.id}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">User Role</span>
                  <span className="text-slate-700 font-bold capitalize">{userRole}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">Staff ID Profile Link</span>
                  <span className="text-slate-700 font-bold truncate max-w-[150px]">{user.staffId || 'Not linked to staff'}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">Session Status</span>
                  <span className="text-green-600 font-bold flex items-center space-x-1">
                    <CheckCircle className="w-3.5 h-3.5 inline" />
                    <span>Active</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick documentation guide */}
            <div className="glass-panel-dark text-white rounded-3xl p-8 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-[var(--accent-gold)]">
                Researcher Guide
              </h3>
              <ul className="text-[10px] space-y-3 leading-relaxed text-slate-350 list-disc pl-4 font-medium">
                <li>Make sure to populate your Personal Website, Scopus, Google Scholar, and ORCID links in your Staff profile to increase index visibility.</li>
                <li>Equipment reservations require lab staff validation. You will receive notification logs once approvals change status.</li>
                <li>For any credential changes or permission requests, coordinate with the unit supervisor or contact the Data Analysis Unit.</li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
