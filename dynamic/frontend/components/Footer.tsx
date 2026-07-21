import React from 'react';
import Link from 'next/link';
import { Landmark, MapPin, Mail, Phone, ExternalLink, Database } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    resources: [
      { name: 'Research Units', href: '/units' },
      { name: 'Specialized Labs', href: '/labs' },
      { name: 'Equipment Bookings', href: '/labs#booking' },
      { name: 'Public Dataset Catalogs', href: '/datasets' },
    ],
    governance: [
      { name: 'Ethics & Guidelines', href: '/regulations' },
      { name: 'Proposal Templates & Forms', href: '/templates' },
      { name: 'Research Priorities', href: '/#priorities' },
      { name: 'Administrative Policies', href: '/regulations#policies' },
    ],
    university: [
      { name: 'Salahaddin University Home', href: 'https://su.edu.krd' },
      { name: 'SUE Research Repository', href: 'https://su.edu.krd/research' },
      { name: 'College of Engineering', href: 'https://engineering.su.edu.krd' },
      { name: 'Erbil Science Portals', href: 'https://su.edu.krd/science' },
    ]
  };

  return (
    <footer className="bg-[var(--secondary-blue)] text-slate-300 border-t-4 border-[var(--primary-maroon)] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* SUE Emblem & Summary */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-white">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--primary-maroon)] shadow">
                <Landmark className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg tracking-tight">Salahaddin University</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              The Research Center at Salahaddin University-Erbil manages high-impact scientific inquiry, supports interdisciplinary collaborations, and operates state-of-the-art laboratory infrastructure in the Kurdistan Region of Iraq.
            </p>
            <div className="flex space-x-3 pt-2">
              {/* Mock Social Badges */}
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-[var(--primary-maroon)] text-white flex items-center justify-center transition-colors">
                <span className="font-bold text-xs">RG</span>
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-[var(--primary-maroon)] text-white flex items-center justify-center transition-colors">
                <span className="font-bold text-xs">GS</span>
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-[var(--primary-maroon)] text-white flex items-center justify-center transition-colors">
                <Database className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links: Resources */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-5 border-l-2 border-[var(--primary-maroon)] pl-3">
              Research Infrastructure
            </h4>
            <ul className="space-y-3 text-xs">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white hover:underline transition-all">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links: Governance & Forms */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-5 border-l-2 border-[var(--primary-maroon)] pl-3">
              Guidelines & Forms
            </h4>
            <ul className="space-y-3 text-xs">
              {footerLinks.governance.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white hover:underline transition-all">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* University Networks & Contacts */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-5 border-l-2 border-[var(--primary-maroon)] pl-3">
              University Network
            </h4>
            <ul className="space-y-3 text-xs mb-6">
              {footerLinks.university.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-white hover:underline flex items-center space-x-1"
                  >
                    <span>{link.name}</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </li>
              ))}
            </ul>
            
            {/* Contact widget */}
            <div className="space-y-2.5 text-xs text-slate-400 pt-2 border-t border-slate-800">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[var(--primary-maroon)] flex-shrink-0 mt-0.5" />
                <span>Kirkuk Road, College of Engineering Campus, Erbil, Kurdistan Region, Iraq</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[var(--primary-maroon)] flex-shrink-0" />
                <a href="mailto:research.center@su.edu.krd" className="hover:text-white transition-colors">
                  research.center@su.edu.krd
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 space-y-4 md:space-y-0">
          <div>
            <span>© {currentYear} Salahaddin University-Erbil. All rights reserved.</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span>Developed by the SUE Research Center Team</span>
            <span className="text-slate-700">|</span>
            <span className="font-semibold text-slate-400">Data Analysis Unit (DAC)</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
