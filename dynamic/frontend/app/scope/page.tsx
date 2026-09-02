import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Dna, 
  Leaf, 
  Cpu, 
  Users, 
  Globe2, 
  ShieldCheck, 
  Lightbulb, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight,
  GraduationCap,
  Sparkles
} from 'lucide-react';

export const metadata = {
  title: 'Academic Scope & Mission | SUE Research Center',
  description: 'Multidisciplinary scope, core academic domains, research infrastructure, and governance standards at Salahaddin University-Erbil Research Center.'
};

export default function ScopePage() {
  const domains = [
    {
      title: 'Biomedical & Health Sciences',
      icon: Dna,
      color: 'bg-red-50 text-[var(--primary-maroon)] border-red-100',
      items: [
        'Molecular biology and genetics',
        'Cancer biology and precision oncology',
        'Biotechnology and biomedical engineering',
        'Immunology and infectious diseases',
        'Genomics, transcriptomics, proteomics, and metabolomics',
        'Personalized and precision medicine',
        'Drug discovery and translational medicine',
        'Public health and epidemiology'
      ]
    },
    {
      title: 'Environmental & Sustainability Sciences',
      icon: Leaf,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-100',
      items: [
        'Environmental monitoring and assessment',
        'Climate change and ecological resilience',
        'Water, soil, and air quality analysis',
        'Environmental biotechnology',
        'Biodiversity conservation',
        'Sustainable resource management',
        'Renewable energy and green technologies'
      ]
    },
    {
      title: 'Artificial Intelligence & Digital Innovation',
      icon: Cpu,
      color: 'bg-blue-50 text-blue-800 border-blue-100',
      items: [
        'Artificial intelligence and machine learning',
        'Bioinformatics and computational biology',
        'Data science and big data analytics',
        'Digital health technologies',
        'Intelligent decision-support systems',
        'Automation and smart laboratory technologies',
        'Scientific computing and predictive modeling'
      ]
    },
    {
      title: 'Social Sciences & Public Policy',
      icon: Users,
      color: 'bg-purple-50 text-purple-800 border-purple-100',
      items: [
        'Evidence-based policy development',
        'Social innovation',
        'Community health and development',
        'Education research',
        'Economic and social impact assessment',
        'Behavioral sciences',
        'Sustainable development studies'
      ]
    },
    {
      title: 'Language, Culture & Scientific Communication',
      icon: Globe2,
      color: 'bg-amber-50 text-amber-900 border-amber-100',
      items: [
        'Kurdish language research & NLP',
        'Scientific translation',
        'Digital humanities',
        'Science communication',
        'Research dissemination',
        'Academic publishing support'
      ]
    },
    {
      title: 'Innovation & Knowledge Transfer',
      icon: Lightbulb,
      color: 'bg-indigo-50 text-indigo-800 border-indigo-100',
      items: [
        'Technology transfer & patent generation',
        'Intellectual property development',
        'Startup incubation & consultancy',
        'Industry-sponsored research',
        'Good Laboratory Practice (GLP)',
        'FAIR data principles & open science'
      ]
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Hero */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-6 text-center max-w-4xl mx-auto">
          <span className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase bg-red-50 text-[var(--primary-maroon)] border border-red-100 tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Salahaddin University Academic Institutional Scope</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--secondary-blue)] tracking-tight">
            Academic Scope &amp; Institutional Mission
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            The Research Center at Salahaddin University-Erbil is a multidisciplinary institution dedicated to advancing scientific discovery, innovation, and evidence-based solutions through high-quality research, education, and collaboration.
          </p>
        </div>

        {/* Institutional Mission & Infrastructure Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-[var(--secondary-blue)] flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Building2 className="w-5 h-5 text-[var(--primary-maroon)]" />
              <span>Multidisciplinary Charter</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The Center supports basic, applied, and translational research across biomedical sciences, molecular engineering, cancer biology, artificial intelligence, environmental monitoring, social sciences, and Kurdish language studies. Equipped with modern laboratories and advanced analytical facilities, the Center fosters interdisciplinary collaboration and capacity building while adhering to the highest international standards of ethics, biosafety, and scientific integrity.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-[var(--secondary-blue)] flex items-center space-x-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="w-5 h-5 text-[var(--primary-maroon)]" />
              <span>Research Quality &amp; Integrity</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              All research activities are conducted according to internationally recognized standards through ethical review, biosafety compliance, quality assurance, research governance, Good Laboratory Practice (GLP), Responsible Conduct of Research (RCR), and FAIR data principles.
            </p>
          </div>
        </div>

        {/* 6 Core Academic Domains */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-extrabold text-[var(--secondary-blue)]">Core Academic Domains</h2>
            <p className="text-xs text-slate-500">Multidisciplinary focus areas driving scientific inquiries and societal solutions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {domains.map((dom, idx) => {
              const Icon = dom.icon;
              return (
                <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between sue-card">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${dom.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-extrabold text-[var(--secondary-blue)]">{dom.title}</h3>
                    </div>

                    <ul className="space-y-2 pt-2 border-t border-slate-100">
                      {dom.items.map((item, i) => (
                        <li key={i} className="text-xs font-semibold text-slate-600 flex items-start space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Explore Links */}
        <div className="bg-[var(--secondary-blue)] rounded-3xl p-8 sm:p-12 text-white text-center space-y-6">
          <h2 className="text-2xl font-bold">Discover Research Units &amp; Core Laboratories</h2>
          <p className="text-xs text-slate-300 max-w-xl mx-auto">
            Explore our specialized research units, query analytical laboratory equipment, and view researcher profiles across Salahaddin University-Erbil.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/units" className="px-6 py-3 rounded-full text-xs font-bold sue-btn-gold">
              Explore Research Units
            </Link>
            <Link href="/labs" className="px-6 py-3 rounded-full text-xs font-bold border border-white/30 text-white hover:bg-white/10">
              Book Core Equipment
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
