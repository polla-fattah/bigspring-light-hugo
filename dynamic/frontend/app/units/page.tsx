import React from 'react';
import Link from 'next/link';
import { Layers, ArrowRight, GitFork, Compass, ShieldCheck, Target, CheckCircle2, TrendingUp, Landmark, Award } from 'lucide-react';
import { fetchFromBackend } from '../../lib/api';

interface ResearchUnit {
  id: string;
  title: string;
  name: string;
  image: string | null;
  description: string | null;
}

export default async function UnitsPage() {
  let units: ResearchUnit[] = [];
  let errorMsg = '';

  try {
    units = await fetchFromBackend<ResearchUnit[]>('/api/units');
  } catch (err) {
    errorMsg = 'Could not load research units data.';
  }

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header summary */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-red-50 text-[var(--primary-maroon)] tracking-wider uppercase">
            Institutional Structure & Strategy
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--secondary-blue)] tracking-tight">
            Research Units & Governance
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            The Scientific Research Center at Salahaddin University-Erbil (SURC) operates under a unified organizational structure, connecting multidisciplinary research units, state-of-the-art laboratories, and strategic labor market objectives.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl text-xs max-w-lg mx-auto text-center">
            {errorMsg}
          </div>
        )}

        {/* 🏛️ 1. Visual Organizational Flow-Chart Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[var(--primary-maroon)] flex items-center justify-center">
              <GitFork className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[var(--secondary-blue)]">
                Organizational Hierarchy & Structure
              </h2>
              <p className="text-xs text-slate-500">
                Institutional reporting lines and operational oversight workflow at SURC.
              </p>
            </div>
          </div>

          {/* Flow Chart Diagram */}
          <div className="flex flex-col items-center space-y-6 pt-2">
            
            {/* Level 1: Presidency */}
            <div className="w-full max-w-md bg-gradient-to-r from-[var(--secondary-blue)] to-slate-800 text-white rounded-2xl p-4 text-center shadow-md border border-slate-700 space-y-1">
              <span className="text-[9px] font-extrabold uppercase text-[var(--accent-gold)] tracking-widest block">
                Executive Leadership
              </span>
              <h3 className="text-sm font-extrabold flex items-center justify-center space-x-2">
                <Landmark className="w-4 h-4 text-[var(--accent-gold)]" />
                <span>Salahaddin University-Erbil — University Presidency</span>
              </h3>
            </div>

            <div className="w-0.5 h-6 bg-slate-300"></div>

            {/* Level 2: Directorate General */}
            <div className="w-full max-w-lg bg-gradient-to-r from-[var(--primary-maroon)] to-rose-900 text-white rounded-2xl p-4 text-center shadow-md space-y-1">
              <span className="text-[9px] font-extrabold uppercase text-amber-200 tracking-widest block">
                Directorate General
              </span>
              <h3 className="text-sm font-extrabold">
                General Directorate of the Scientific Research Center (SURC)
              </h3>
            </div>

            <div className="w-0.5 h-6 bg-slate-300"></div>

            {/* Level 3: Dual Columns (Units & Laboratories) */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Specialized Research Units */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
                <h4 className="text-xs font-extrabold text-[var(--secondary-blue)] uppercase tracking-wider flex items-center space-x-2 border-b border-slate-200 pb-2">
                  <Layers className="w-4 h-4 text-[var(--primary-maroon)]" />
                  <span>Specialized Research Units</span>
                </h4>
                <ul className="space-y-2 text-xs font-semibold text-slate-700">
                  <li className="p-2 bg-white rounded-lg border border-slate-150 flex items-center justify-between">
                    <span>Environmental Monitoring & Climate Change (EMCCU)</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-green-100 text-green-800 rounded font-bold">Active</span>
                  </li>
                  <li className="p-2 bg-white rounded-lg border border-slate-150 flex items-center justify-between">
                    <span>Data Analysis & Artificial Intelligence Unit</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded font-bold">Active</span>
                  </li>
                  <li className="p-2 bg-white rounded-lg border border-slate-150 flex items-center justify-between">
                    <span>Development & Institutional Cooperation Unit</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded font-bold">Active</span>
                  </li>
                </ul>
              </div>

              {/* Core Research Laboratories */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
                <h4 className="text-xs font-extrabold text-[var(--secondary-blue)] uppercase tracking-wider flex items-center space-x-2 border-b border-slate-200 pb-2">
                  <Award className="w-4 h-4 text-[var(--primary-maroon)]" />
                  <span>Core Research Laboratories</span>
                </h4>
                <ul className="space-y-2 text-xs font-semibold text-slate-700">
                  <li className="p-2 bg-white rounded-lg border border-slate-150 flex items-center justify-between">
                    <span>Cancer Biology Laboratory (Dr. Treska Hassan)</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded font-bold">BSL-2</span>
                  </li>
                  <li className="p-2 bg-white rounded-lg border border-slate-150 flex items-center justify-between">
                    <span>Molecular Engineering Laboratory (Prof. Suhad Mustafa)</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-rose-100 text-rose-800 rounded font-bold">AREC</span>
                  </li>
                  <li className="p-2 bg-white rounded-lg border border-slate-150 flex items-center justify-between">
                    <span>Chemical Analysis & Nanotechnology Labs</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-cyan-100 text-cyan-800 rounded font-bold">Core</span>
                  </li>
                </ul>
              </div>

            </div>

            <div className="w-0.5 h-6 bg-slate-300"></div>

            {/* Level 4: Research Personnel */}
            <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl p-4 text-center space-y-1 shadow-sm">
              <span className="text-[9px] font-extrabold uppercase text-slate-400 tracking-widest block">
                Research Staff & Academic Fellows
              </span>
              <p className="text-xs font-bold text-[var(--secondary-blue)]">
                Principal Investigators, Environmental Researchers, Postgraduates & Volunteer Fellows
              </p>
            </div>

          </div>
        </div>

        {/* 🎯 2. 5-Year Strategic Plan & Activity Roadmap (2026–2030) */}
        <div className="bg-gradient-to-br from-slate-900 to-[var(--secondary-blue)] text-white rounded-3xl p-8 sm:p-12 shadow-md space-y-8">
          <div className="flex items-center justify-between border-b border-slate-700 pb-4">
            <div className="flex items-center space-x-3">
              <Compass className="w-6 h-6 text-[var(--accent-gold)]" />
              <div>
                <h2 className="text-lg font-extrabold text-white">
                  SURC 5-Year Strategic Roadmap (2026–2030)
                </h2>
                <p className="text-xs text-slate-300">
                  Aligning university research excellence with regional market demands and evidence-based governance.
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold bg-[var(--accent-gold)] text-slate-900 uppercase">
              Strategic Plan
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Pillar 1: Vision & Labour Market */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">
                1. Labour Market Alignment (بازاڕی کار)
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed">
                Directing postgraduate supervision and specialized technical workshops (60-hr ArcGIS Pro, BSL-2 Cell Culture, Molecular Cloning) to supply highly-skilled talent to Kurdistan Regional Government (KRG) ministries, pharmaceutical industries, and environmental consultancies.
              </p>
            </div>

            {/* Pillar 2: Monitoring & Follow-up */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-400/20 text-emerald-300 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-extrabold text-emerald-300 uppercase tracking-wider">
                2. Follow-Up & Monitoring (بەدواداچوون)
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed">
                Implementing standardized monitoring mechanisms for research project milestones, equipment booking lifecycle, ethics clearance review queues (Animal AREC, Human, Botanical), and mandatory 300,000 IQD lab deposit agreements.
              </p>
            </div>

            {/* Pillar 3: Publishing & Policy */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-400/20 text-cyan-300 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-extrabold text-cyan-300 uppercase tracking-wider">
                3. Publishing & Policy Advisory
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed">
                Establishing the flagship <em>Journal of Intelligent Spatial Data Science (JISDS)</em> in collaboration with Sapienza University of Rome, and issuing real-time climate dashboards (mountain snow-cover change in Zagros range) for governmental decision-makers.
              </p>
            </div>

          </div>
        </div>

        {/* Units Grid */}
        <div className="space-y-6">
          <h2 className="text-xl font-extrabold text-[var(--secondary-blue)] border-b border-slate-200 pb-3">
            Explore All Research Units
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {units.map((unit) => (
              <div 
                key={unit.id} 
                className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm sue-card flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 text-[var(--primary-maroon)] flex items-center justify-center">
                    <Layers className="w-6 h-6" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-[var(--accent-gold)] uppercase tracking-wider">
                      Unit ID: {unit.id.toUpperCase()}
                    </span>
                    <h3 className="text-lg font-extrabold text-[var(--secondary-blue)] line-clamp-1">
                      {unit.title}
                    </h3>
                  </div>
                  
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {unit.description || 'No description available for this SUE Research Unit.'}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">
                    Explore activities
                  </span>
                  <Link 
                    href={`/units/${unit.id}`}
                    className="w-9 h-9 rounded-lg bg-slate-55 hover:bg-[var(--primary-maroon)] text-slate-600 hover:text-white flex items-center justify-center transition-all"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

