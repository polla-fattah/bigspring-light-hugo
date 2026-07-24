import React from 'react';
import Link from 'next/link';
import { 
  Search, 
  Layers, 
  BookOpen, 
  Settings, 
  Users, 
  Calendar, 
  FileText, 
  Shield, 
  ArrowRight, 
  FileCheck, 
  Cpu, 
  Globe, 
  Award,
  BookOpenCheck
} from 'lucide-react';

export default function Home() {
  const stats = [
    { label: 'Research Units', count: '8', desc: 'Specialized focus areas', icon: Layers },
    { label: 'Faculty Researchers', count: '45+', desc: 'Experts & instructors', icon: Users },
    { label: 'Scientific Publications', count: '120+', desc: 'Indexed journals & theses', icon: BookOpen },
    { label: 'Specialized Laboratories', count: '12+', desc: 'State-of-the-art facilities', icon: Settings },
  ];

  const priorities = [
    { 
      title: 'Data Analysis & Informatics', 
      desc: 'Advancing research in computational data mining, low-resource Kurdish NLP models, and machine learning systems.',
      unit: 'Informatics Unit',
      icon: Cpu
    },
    { 
      title: 'Environmental & Water Studies', 
      desc: 'Developing innovative solutions for regional water quality, carbon footprints, and sustainable urban infrastructure.',
      unit: 'Water & Environment Unit',
      icon: Globe
    },
    { 
      title: 'Low-Resource Kurdish NLP', 
      desc: 'Preserving and digitizing Kurdish textual heritage through modern AI models, OCR, and language technologies.',
      unit: 'Data Analysis Center',
      icon: BookOpenCheck
    },
    { 
      title: 'Regional History & Preservation', 
      desc: 'Focusing on Kurdish historical archives, local architectural studies, and heritage documentation.',
      unit: 'Heritage Unit',
      icon: Award
    }
  ];

  const quickResources = [
    { title: 'Research Ethics Guidelines', type: 'Regulation', size: '2.5 MB', link: '/regulations' },
    { title: 'Research Proposal Application Form', type: 'Form template', size: '0.3 MB', link: '/templates' },
    { title: 'Laboratory Equipment Safety Code', type: 'Policy', size: '1.2 MB', link: '/regulations' },
  ];

  return (
    <div className="bg-slate-55 flex flex-col min-h-screen">
      
      {/* 1. HERO SECTION WITH GRADIENT BACKGROUND */}
      <section className="relative text-white overflow-hidden py-24 sm:py-32 sue-gradient-bg border-b border-slate-900/10">
        
        {/* Decorative Grid Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08)_0%,transparent_80%)]"></div>
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Headline Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-extrabold bg-[var(--accent-gold)] text-[var(--secondary-blue)] tracking-wider uppercase animate-pulse-soft">
                Scientific Advancement
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Salahaddin University <br className="hidden sm:inline" />
                <span className="text-[var(--accent-gold)]">Research Center</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Pioneering scientific discovery, coordinating state-of-the-art laboratory equipment bookings, and publishing regional research outputs at the forefront of Kurdistan's academic ecosystem.
              </p>
              
              {/* Dynamic search bar */}
              <div className="max-w-xl mx-auto lg:mx-0 pt-4">
                <form action="/search" method="GET" className="flex bg-white/10 backdrop-blur-md rounded-2xl p-1.5 border border-white/20 shadow-lg focus-within:ring-2 focus-within:ring-[var(--accent-gold)] focus-within:border-transparent transition-all">
                  <div className="flex items-center pl-3 pr-2 text-slate-300">
                    <Search className="w-5 h-5" />
                  </div>
                  <input 
                    type="text" 
                    name="q"
                    placeholder="Search researchers, projects, publications, labs or datasets..." 
                    className="w-full bg-transparent border-0 text-white placeholder-slate-350 text-sm focus:ring-0 focus:outline-none py-2.5 px-1"
                  />
                  <button type="submit" className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[var(--accent-gold)] hover:bg-[var(--accent-gold-hover)] text-[var(--secondary-blue)] transition-colors shadow cursor-pointer">
                    Search
                  </button>
                </form>
                <p className="text-xs text-slate-300 mt-2.5 flex items-center justify-center lg:justify-start space-x-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--accent-gold)]"></span>
                  <span>Fully indexed by PostgreSQL full-text search engine</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
                <Link href="/units" className="px-6 py-3.5 rounded-xl text-sm font-bold bg-white text-[var(--secondary-blue)] hover:bg-slate-100 transition-all text-center">
                  Explore Units
                </Link>
                <Link href="/labs" className="px-6 py-3.5 rounded-xl text-sm font-bold border border-white/30 text-white hover:bg-white/10 transition-all text-center">
                  Book Equipment
                </Link>
              </div>
            </div>

            {/* Right Card Panel Column */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="glass-panel-dark text-white rounded-3xl p-8 space-y-6 shadow-2xl relative">
                <div className="absolute top-0 right-0 transform translate-x-3 -translate-y-3 w-16 h-16 bg-[var(--primary-maroon)] rounded-full blur-2xl opacity-50"></div>
                <h3 className="text-lg font-bold text-[var(--accent-gold)] flex items-center space-x-2 border-b border-white/10 pb-4">
                  <Layers className="w-5 h-5" />
                  <span>Center Mission & Vision</span>
                </h3>
                <blockquote className="text-sm italic leading-relaxed text-slate-200">
                  "Salahaddin University Research Center is dedicated to supporting advanced data analytics, scientific laboratory protocols, and computational linguistics to elevate regional policy and scientific standing."
                </blockquote>
                <div className="flex items-center space-x-3 pt-2">
                  <div className="w-10 h-10 rounded-full bg-slate-700/50 border border-white/20 flex items-center justify-center font-bold text-xs">
                    SUE
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Office of the Director</h5>
                    <p className="text-[10px] text-slate-400">Research Management, Salahaddin University-Erbil</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. STATS COMPONENT */}
      <section className="relative z-20 -mt-12 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 sm:p-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            {stats.map((stat, i) => (
              <div key={stat.label} className={`flex items-start space-x-4 ${i > 0 ? 'sm:pl-6 lg:pl-8' : ''} ${i > 0 ? 'pt-6 sm:pt-0' : ''}`}>
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50 text-[var(--primary-maroon)]">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-[var(--secondary-blue)] tracking-tight">
                    {stat.count}
                  </div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mt-1">
                    {stat.label}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {stat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. RESEARCH PRIORITIES GRID */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="priorities">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-extrabold text-[var(--primary-maroon)] uppercase tracking-widest">
            Institutional Priorities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--secondary-blue)] tracking-tight">
            Strategic Research Focus Areas
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Salahaddin University Research Center coordinates priority studies mapping environmental resilience, computational data analysis, and heritage digitizations in Iraq.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {priorities.map((item) => (
            <div 
              key={item.title} 
              className="bg-white rounded-3xl p-8 border border-slate-200/80 sue-card flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50 text-[var(--primary-maroon)]">
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-[var(--accent-gold)] uppercase tracking-wider">
                    {item.unit}
                  </span>
                  <h3 className="text-lg font-extrabold text-[var(--secondary-blue)]">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
              
              <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-xs font-bold text-[var(--primary-maroon)]">
                <span>View priority map</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. DOCUMENTS & RESOURCES */}
      <section className="py-16 bg-slate-100 border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column Text */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold text-[var(--primary-maroon)] uppercase tracking-wider">
                Academic Governance
              </span>
              <h2 className="text-3xl font-extrabold text-[var(--secondary-blue)] tracking-tight">
                Forms, Regulations <br />& Ethics Codes
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Access official administrative files, proposal application templates, and laboratory booking codes. Researchers must conform with these safety guidelines when conducting investigations.
              </p>
              <div className="pt-2">
                <Link href="/regulations" className="inline-flex items-center space-x-1.5 text-xs font-bold text-[var(--primary-maroon)] hover:underline">
                  <span>Explore all governance files</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Column Files Grid */}
            <div className="lg:col-span-7 space-y-4">
              {quickResources.map((file) => (
                <div 
                  key={file.title} 
                  className="bg-white rounded-2xl p-5 border border-slate-250/70 hover:border-slate-300 shadow-sm flex items-center justify-between transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 text-[var(--primary-maroon)] flex items-center justify-center flex-shrink-0">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[var(--secondary-blue)]">
                        {file.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {file.type} • {file.size}
                      </p>
                    </div>
                  </div>
                  <Link 
                    href={file.link} 
                    className="p-2 rounded-lg text-slate-400 hover:text-[var(--primary-maroon)] hover:bg-slate-50 transition-colors"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
