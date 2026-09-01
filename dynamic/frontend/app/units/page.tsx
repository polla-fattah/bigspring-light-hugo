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

interface CoreLab {
  id: string;
  title: string;
  name: string;
  platforms?: string[];
  supervisor?: {
    id: string;
    title: string;
    email: string;
  } | null;
}

export default async function UnitsPage() {
  let units: ResearchUnit[] = [];
  let labs: CoreLab[] = [];
  let errorMsg = '';

  try {
    const [unitsData, labsData] = await Promise.all([
      fetchFromBackend<ResearchUnit[]>('/api/units', {}, []),
      fetchFromBackend<CoreLab[]>('/api/labs', {}, [])
    ]);
    units = unitsData;
    labs = labsData;
  } catch (err) {
    errorMsg = 'Could not load research units or core laboratories data.';
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

