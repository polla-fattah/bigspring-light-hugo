import React from 'react';
import Link from 'next/link';
import {
  Search,
  Layers,
  ArrowRight,
  FileCheck,
  Cpu,
  Globe,
  Award,
  BookOpenCheck
} from 'lucide-react';

export default function Home() {
  const stats = [
    { label: 'Research Units', count: '8', desc: 'Specialized focus areas' },
    { label: 'Researchers', count: '45+', desc: 'Experts & instructors' },
    { label: 'Publications', count: '120+', desc: 'Indexed journals & theses' },
    { label: 'Laboratories', count: '12+', desc: 'State-of-the-art facilities' },
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
    <div className="flex flex-col min-h-screen">

      {/* 1. HERO — deep maroon academic banner */}
      <section className="relative text-white overflow-hidden pt-24 sm:pt-28 pb-14 sm:pb-16 sue-gradient-bg">

        {/* Fine grid + vignette overlays */}
        <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(35,7,14,0.45)_100%)]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Headline Column */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left animate-fade-up">

              <h1 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-bold tracking-tight leading-[1.15]">
                Research Center
                <span className="block mt-1.5 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-gold)] via-[#e8cd8b] to-[var(--accent-gold)]">
                  Salahaddin University-Erbil
                </span>
              </h1>

              <p className="font-sans text-sm sm:text-base text-rose-100/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Pioneering scientific discovery, coordinating state-of-the-art laboratory equipment bookings, and publishing regional research outputs at the forefront of Kurdistan&apos;s academic ecosystem.
              </p>

              {/* Dynamic search bar */}
              <div className="max-w-xl mx-auto lg:mx-0 pt-1">
                <form action="/search" method="GET" className="flex bg-white rounded-full p-1.5 shadow-2xl shadow-black/25 focus-within:ring-4 focus-within:ring-[var(--accent-gold)]/40 transition-all">
                  <div className="flex items-center pl-4 pr-2 text-stone-400">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="q"
                    placeholder="Search researchers, projects, publications, labs..."
                    className="w-full bg-transparent border-0 text-[var(--maroon-ink)] placeholder-stone-400 font-sans text-xs sm:text-sm focus:ring-0 focus:outline-none py-2 px-1"
                  />
                  <button type="submit" className="px-5 py-2 rounded-full text-xs font-sans font-bold sue-btn-primary cursor-pointer">
                    Search
                  </button>
                </form>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2 font-sans">
                <Link href="/units" className="px-7 py-3.5 rounded-full text-sm font-bold sue-btn-gold text-center shadow-lg">
                  Explore Units
                </Link>
                <Link href="/labs" className="px-7 py-3.5 rounded-full text-sm font-bold border border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all text-center">
                  Book Equipment
                </Link>
              </div>
            </div>

            {/* Right Card Panel Column */}
            <div className="lg:col-span-5 hidden lg:block animate-fade-up">
              <div className="glass-panel-dark text-white rounded-3xl p-8 space-y-6 shadow-2xl relative">
                <div className="absolute top-0 right-0 transform translate-x-3 -translate-y-3 w-20 h-20 bg-[var(--accent-gold)] rounded-full blur-3xl opacity-30"></div>
                <h3 className="text-lg font-display font-bold text-[var(--accent-gold)] flex items-center space-x-2 border-b border-white/10 pb-4">
                  <Layers className="w-5 h-5" />
                  <span>Center Mission &amp; Vision</span>
                </h3>
                <blockquote className="font-display text-[15px] italic leading-relaxed text-rose-100/85">
                  &ldquo;Salahaddin University Research Center is dedicated to supporting advanced data analytics, scientific laboratory protocols, and computational linguistics to elevate regional policy and scientific standing.&rdquo;
                </blockquote>
                <div className="flex items-center space-x-3 pt-2">
                  <div className="w-10 h-10 rounded-full bg-[var(--primary-maroon)] ring-1 ring-[var(--accent-gold)]/50 flex items-center justify-center font-bold text-xs">
                    SUE
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Office of the Director</h5>
                    <p className="text-[10px] text-rose-100/60">Research Management, Salahaddin University-Erbil</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Figures rail — forms the base of the hero */}
          <div className="mt-16 sm:mt-20 border-t border-white/15 grid grid-cols-2 lg:grid-cols-4 gap-y-10">
            {stats.map((stat, i) => {
              // 2-up on small screens, 4-up on large — a hairline only where a column
              // starts mid-row, so no row ever opens with a stray rule.
              const divider =
                i === 1 || i === 3
                  ? 'border-l border-white/12 pl-6 lg:pl-8'
                  : i === 2
                    ? 'lg:border-l lg:border-white/12 lg:pl-8'
                    : '';

              return (
                <div key={stat.label} className={`pt-8 ${divider}`}>
                  <div className="text-4xl sm:text-[2.75rem] font-display font-bold text-[var(--accent-gold)] tracking-tight leading-none">
                    {stat.count}
                  </div>
                  <h3 className="text-[11px] font-bold text-white uppercase tracking-[0.15em] mt-3.5">
                    {stat.label}
                  </h3>
                  <p className="text-[11px] text-rose-100/50 mt-1.5">
                    {stat.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 3. RESEARCH PRIORITIES GRID */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="priorities">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="font-sans text-[11px] font-extrabold text-[var(--primary-maroon)] uppercase tracking-[0.18em]">
            Institutional Priorities
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--maroon-ink)] tracking-tight">
            Strategic Research Focus Areas
          </h2>
          <div className="sue-gold-rule mx-auto"></div>
          <p className="text-sm text-stone-500 leading-relaxed">
            Salahaddin University Research Center coordinates priority studies mapping environmental resilience, computational data analysis, and heritage digitizations in Iraq.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {priorities.map((item) => (
            <div
              key={item.title}
              className="group bg-white rounded-3xl p-8 border border-[var(--border-color)] sue-card flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--primary-maroon)] to-[var(--accent-gold)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--maroon-wash)] text-[var(--primary-maroon)] group-hover:bg-[var(--primary-maroon)] group-hover:text-white transition-colors">
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-[var(--accent-gold)] uppercase tracking-[0.14em]">
                    {item.unit}
                  </span>
                  <h3 className="text-xl font-display font-bold text-[var(--maroon-ink)]">
                    {item.title}
                  </h3>
                </div>
                <p className="text-[13px] text-stone-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-6 border-t border-[var(--border-color)] mt-6 flex items-center justify-between text-xs font-bold text-[var(--primary-maroon)]">
                <span>View priority map</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. DOCUMENTS & RESOURCES */}
      <section className="py-20 bg-[var(--maroon-wash)] border-y border-[var(--maroon-wash-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Column Text */}
            <div className="lg:col-span-5 space-y-5">
              <span className="font-sans text-[11px] font-extrabold text-[var(--primary-maroon)] uppercase tracking-[0.18em]">
                Academic Governance
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--maroon-ink)] tracking-tight leading-tight">
                Forms, Regulations<br />&amp; Ethics Codes
              </h2>
              <div className="sue-gold-rule"></div>
              <p className="text-[13px] text-stone-500 leading-relaxed">
                Access official administrative files, proposal application templates, and laboratory booking codes. Researchers must conform with these safety guidelines when conducting investigations.
              </p>
              <div className="pt-2">
                <Link href="/regulations" className="inline-flex items-center space-x-2 px-6 py-3 rounded-full text-xs font-bold sue-btn-primary shadow">
                  <span>Explore all governance files</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Column Files Grid */}
            <div className="lg:col-span-7 space-y-4">
              {quickResources.map((file) => (
                <Link
                  key={file.title}
                  href={file.link}
                  className="group bg-white rounded-2xl p-5 border border-[var(--border-color)] hover:border-[var(--primary-maroon)]/30 shadow-sm hover:shadow-md flex items-center justify-between transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-11 h-11 rounded-xl bg-[var(--maroon-wash)] text-[var(--primary-maroon)] group-hover:bg-[var(--primary-maroon)] group-hover:text-white flex items-center justify-center flex-shrink-0 transition-colors">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-[var(--maroon-ink)] group-hover:text-[var(--primary-maroon)] transition-colors">
                        {file.title}
                      </h4>
                      <p className="text-[10px] text-stone-400 mt-0.5">
                        {file.type} • {file.size}
                      </p>
                    </div>
                  </div>
                  <div className="p-2 rounded-lg text-stone-300 group-hover:text-[var(--primary-maroon)] transition-colors">
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
