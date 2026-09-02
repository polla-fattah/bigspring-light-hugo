'use client';

import React, { useState } from 'react';
import { 
  Dna, 
  FlaskConical, 
  Microscope, 
  Activity, 
  Target, 
  Search, 
  Flame, 
  Database,
  CheckCircle2,
  Wrench,
  Sparkles
} from 'lucide-react';

interface PlatformDomain {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  badge: string;
  gradient: string;
  description: string;
  techniques: string[];
  equipment: string[];
  researchFocus?: string[];
}

const domains: PlatformDomain[] = [
  {
    id: 'cell-culture',
    title: 'Cell Culture',
    subtitle: 'Biosafety Level 2 Mammalian Cell Manipulation',
    icon: FlaskConical,
    badge: 'BSL-2 Facility',
    gradient: 'from-amber-500/10 to-red-500/10 text-amber-700 border-amber-200',
    description: 'Supports the maintenance, propagation, and experimental manipulation of mammalian cell lines under BSL-2 conditions for cancer biology research.',
    techniques: [
      'Mammalian cell culture',
      'Aseptic cell handling',
      'Cell passaging and maintenance',
      'Cell counting and viability assessment',
      'Cryopreservation and cell recovery',
      'Experimental drug treatment',
      'Cell-based functional assays'
    ],
    equipment: [
      'Class II Biosafety Cabinet',
      'CO₂ Incubators',
      'Automated Cell Counter / Hemocytometer',
      'Inverted Phase-Contrast Microscope',
      'Liquid Nitrogen Storage System',
      'Refrigerators and Freezers (-20°C / 4°C)',
      'Water Purification System'
    ]
  },
  {
    id: 'molecular-biology',
    title: 'Molecular Biology',
    subtitle: 'Nucleic Acid Analysis & Quantitative Gene Expression',
    icon: Dna,
    badge: 'Genomics & qPCR',
    gradient: 'from-blue-500/10 to-cyan-500/10 text-blue-700 border-blue-200',
    description: 'Supports molecular investigations of cancer-related genes and cellular pathways through nucleic acid analysis and gene expression studies.',
    techniques: [
      'DNA extraction',
      'RNA extraction',
      'Nucleic acid quantification',
      'cDNA synthesis',
      'Conventional PCR amplification',
      'Quantitative Real-Time PCR (qPCR)',
      'Gene expression profiling'
    ],
    equipment: [
      'Quantitative PCR (qPCR) System',
      'PCR Thermal Cyclers',
      'NanoDrop Spectrophotometer',
      'High-Speed Refrigerated Centrifuges',
      'Microcentrifuges & Vortex Mixers',
      'Dry Block Heater',
      'Cold Storage Systems'
    ]
  },
  {
    id: 'protein-analysis',
    title: 'Protein Analysis',
    subtitle: 'Proteomics, Western Blotting & Signaling Pathways',
    icon: Activity,
    badge: 'Proteomics Core',
    gradient: 'from-purple-500/10 to-indigo-500/10 text-purple-700 border-purple-200',
    description: 'Supports the investigation of protein expression, signaling pathways, and molecular mechanisms involved in cancer development and progression.',
    techniques: [
      'Protein extraction & lysis',
      'SDS-PAGE electrophoresis',
      'Western blotting immunodetection',
      'Enzyme-Linked Immunosorbent Assay (ELISA)',
      'Protein quantification & Bradford assays',
      'Chemiluminescent protein visualization',
      'Protein expression analysis'
    ],
    equipment: [
      'SDS-PAGE Electrophoresis System',
      'Western Blot Transfer Apparatus',
      'High-Resolution Gel & Blot Scanner',
      'Multi-Mode Microplate Reader',
      'Refrigerated Microcentrifuges',
      'Ultrasonic Homogenizer / Sonicator',
      'Rocker & Shaker Platforms',
      'Precision pH Meter'
    ]
  },
  {
    id: 'cell-imaging',
    title: 'Cell Imaging',
    subtitle: 'High-Resolution Fluorescence & Live-Cell Microscopy',
    icon: Microscope,
    badge: 'Fluorescence Core',
    gradient: 'from-emerald-500/10 to-teal-500/10 text-emerald-700 border-emerald-200',
    description: 'Provides advanced microscopic imaging for cellular morphology, fluorescence-based experiments, and live-cell observations.',
    techniques: [
      'Bright-field microscopy',
      'Phase-contrast microscopy',
      'Multicolor fluorescence microscopy',
      'Cellular morphology analysis',
      'Cell proliferation & apoptosis tracking',
      'Digital image acquisition & documentation'
    ],
    equipment: [
      'Inverted Research Fluorescence Microscope',
      'High-Sensitivity Digital Scientific Camera',
      'Image Acquisition & Quantitative Analysis Software',
      'Live-Cell Environmental Incubation System',
      'Dedicated Dark Room Facility',
      'ChemiDoc Gel Documentation System'
    ]
  },
  {
    id: 'cancer-therapeutics',
    title: 'Cancer Therapeutics & Drug Screening',
    subtitle: 'Anticancer Compound & Cytotoxicity Evaluation',
    icon: Target,
    badge: 'Drug Discovery',
    gradient: 'from-rose-500/10 to-pink-500/10 text-rose-700 border-rose-200',
    description: 'Supports the evaluation of novel anticancer compounds and therapeutic interventions using in vitro experimental models.',
    techniques: [
      'High-throughput drug sensitivity assays',
      'Cellular viability assays (MTT/CCK-8)',
      'Cytotoxicity & IC50 determinations',
      'Dose-response curve analysis',
      'Combination therapy synergistic studies',
      'Experimental therapeutic evaluation'
    ],
    equipment: [
      'CO₂ Cell Culture Incubators',
      'Class II Biosafety Cabinet',
      'Absorbance & Fluorescence Microplate Reader',
      'Automated Cell Counter',
      'Inverted Fluorescence Microscope',
      'Refrigerated Benchtop Centrifuge'
    ]
  },
  {
    id: 'biomarker-discovery',
    title: 'Biomarker Discovery',
    subtitle: 'Diagnostic & Prognostic Biomarker Validation',
    icon: Search,
    badge: 'Biomarkers Core',
    gradient: 'from-teal-500/10 to-emerald-500/10 text-teal-700 border-teal-200',
    description: 'Supports the identification and validation of molecular biomarkers for early cancer diagnosis, prognosis, and therapeutic monitoring.',
    techniques: [
      'Gene expression profiling',
      'Molecular biomarker validation',
      'Circulating DNA/RNA quantification',
      'Protein biomarker immunoassay validation',
      'Quantitative molecular diagnostic assays'
    ],
    equipment: [
      'Real-Time Quantitative PCR System',
      'Gel & Blot Imaging System',
      'Proteomic Analysis Apparatus',
      'Precision Molecular Biology Suite'
    ]
  },
  {
    id: 'experimental-oncology',
    title: 'Experimental Oncology',
    subtitle: 'Mechanistic Studies in Tumor Microenvironment & Resistance',
    icon: Flame,
    badge: 'Translational Research',
    gradient: 'from-red-500/10 to-orange-500/10 text-red-700 border-red-200',
    description: 'Supports research to understand the molecular and cellular mechanisms underlying cancer initiation, progression, metastasis, and therapeutic resistance.',
    researchFocus: [
      'Tumor Biology',
      'Cancer Cell Signaling',
      'Tumor Microenvironment',
      'Cell Proliferation & Apoptosis',
      'Metastasis Mechanisms',
      'Cancer Genetics & Epigenetics',
      'Precision Oncology',
      'Translational Cancer Research'
    ],
    techniques: [
      'Cell culture manipulation',
      'Molecular gene expression analysis',
      'Protein signaling pathway analysis',
      'Cellular imaging & migration assays',
      'Functional cellular phenotype assays',
      'Experimental therapeutic studies'
    ],
    equipment: [
      'Complete Suite of Cell Culture & Molecular Biology Systems',
      'High-End Live Cell Microscopy Platform'
    ]
  },
  {
    id: 'biobanking',
    title: 'Sample Processing & Biobanking',
    subtitle: 'Cryopreservation & Specimen Repository Management',
    icon: Database,
    badge: 'Biobanking Repository',
    gradient: 'from-slate-500/10 to-gray-500/10 text-slate-700 border-slate-200',
    description: 'Supports standardized processing, preservation, and long-term storage of biological samples for oncology research.',
    techniques: [
      'Biological sample preparation & fractionation',
      'Cellular cryopreservation workflows',
      'Ultra-low temperature DNA/RNA storage',
      'Biological sample barcode cataloging',
      'Long-term specimen preservation'
    ],
    equipment: [
      'Ultra-Low Temperature (-80°C) Deep Freezer',
      'Heavy-Duty -20°C Freezers',
      'Laboratory Refrigerators (4°C)',
      'Liquid Nitrogen Cryo-Storage System',
      'Standardized Biobanking Management System'
    ]
  }
];

export default function CancerBiologyPlatforms() {
  const [activeTab, setActiveTab] = useState<string>('cell-culture');
  const activeDomain = domains.find(d => d.id === activeTab) || domains[0];

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-8 my-8">
      
      {/* Title & Header */}
      <div className="border-b border-slate-100 pb-6 space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-red-50 text-[var(--primary-maroon)] border border-red-100 tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Specialized Research Capabilities</span>
          </span>
          <span className="text-xs font-bold text-slate-400">8 Core Research Capabilities</span>
        </div>
        <h2 className="text-2xl font-extrabold text-[var(--secondary-blue)] tracking-tight">
          Cancer Biology Laboratory Capabilities
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
          Explore the state-of-the-art research techniques, experimental models, and specialized laboratory instrumentation available in the Cancer Biology Laboratory.
        </p>
      </div>

      {/* Tabs list */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {domains.map((dom) => {
          const Icon = dom.icon;
          const isActive = dom.id === activeTab;
          return (
            <button
              key={dom.id}
              onClick={() => setActiveTab(dom.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center space-x-2 transition-all cursor-pointer border ${
                isActive 
                  ? 'bg-[var(--primary-maroon)] text-white border-[var(--primary-maroon)] shadow-md' 
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-[var(--primary-maroon)]'}`} />
              <span>{dom.title}</span>
            </button>
          );
        })}
      </div>

      {/* Domain Active Card */}
      <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200/80 space-y-6 animate-fade-in">
        
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-200/60 pb-5">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-[var(--primary-maroon)] shrink-0">
              <activeDomain.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-extrabold text-[var(--secondary-blue)]">{activeDomain.title}</h3>
                <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border ${activeDomain.gradient}`}>
                  {activeDomain.badge}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-semibold">{activeDomain.subtitle}</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          {activeDomain.description}
        </p>

        {/* Research Focus (if applicable) */}
        {activeDomain.researchFocus && (
          <div className="space-y-2">
            <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Target className="w-3.5 h-3.5 text-[var(--primary-maroon)]" />
              <span>Core Research Focus Areas</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {activeDomain.researchFocus.map((focus, i) => (
                <span key={i} className="text-[10px] font-bold bg-white text-[var(--primary-maroon)] border border-red-100 px-3 py-1 rounded-lg shadow-2xs">
                  {focus}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          {/* Available Techniques */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
            <h4 className="text-xs font-extrabold text-[var(--secondary-blue)] flex items-center space-x-2 border-b border-slate-100 pb-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Available Techniques & Assays</span>
            </h4>
            <ul className="space-y-2">
              {activeDomain.techniques.map((tech, idx) => (
                <li key={idx} className="text-xs font-semibold text-slate-600 flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary-maroon)] mt-1.5 shrink-0"></span>
                  <span>{tech}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Supporting Instruments */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
            <h4 className="text-xs font-extrabold text-[var(--secondary-blue)] flex items-center space-x-2 border-b border-slate-100 pb-2.5">
              <Wrench className="w-4 h-4 text-amber-600" />
              <span>Supporting Equipment & Instrumentation</span>
            </h4>
            <ul className="space-y-2">
              {activeDomain.equipment.map((eq, idx) => (
                <li key={idx} className="text-xs font-semibold text-slate-600 flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                  <span>{eq}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
