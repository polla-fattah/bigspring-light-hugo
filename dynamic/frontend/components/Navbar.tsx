'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Globe, ArrowUpRight, Menu, X, Landmark } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');
  const { data: session } = useSession();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Research Units', href: '/units' },
    { name: 'Researchers', href: '/staff' },
    { name: 'Projects', href: '/projects' },
    { name: 'Publications', href: '/publications' },
    { name: 'Labs', href: '/labs' },
    { name: 'Events', href: '/events' },
  ];

  const utilityLinks = [
    { name: 'Datasets', href: '/datasets' },
    { name: 'Regulations', href: '/regulations' },
    { name: 'Templates', href: '/templates' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full shadow-sm">
      {/* ── Maroon utility bar (university identity strip) ── */}
      <div className="bg-[var(--primary-maroon)] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-9 text-[11px] font-semibold tracking-wide">
            <a
              href="https://su.edu.krd"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 text-white/85 hover:text-white transition-colors"
            >
              <span>Salahaddin University-Erbil</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>

            <div className="flex items-center">
              <nav className="hidden sm:flex items-center">
                {utilityLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="px-3 py-1 text-white/85 hover:text-white hover:bg-white/10 rounded transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              {/* Language Swapper Dropdown Container */}
              <div className="relative lang-container py-1 ml-2 pl-3 border-l border-white/20">
                <button className="flex items-center space-x-1.5 text-white/85 hover:text-white transition-colors">
                  <Globe className="w-3.5 h-3.5" />
                  <span>{currentLang === 'EN' ? 'English' : currentLang === 'KU' ? 'Soranî' : 'العربية'}</span>
                </button>

                <div className="absolute right-0 mt-1 w-36 bg-white border border-[var(--border-color)] rounded-xl shadow-lg lang-dropdown py-1 overflow-hidden">
                  <button
                    onClick={() => setCurrentLang('EN')}
                    className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-[var(--maroon-wash)] hover:text-[var(--primary-maroon)] transition-colors block text-stone-700"
                  >
                    English
                  </button>
                  <button
                    onClick={() => setCurrentLang('KU')}
                    className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-[var(--maroon-wash)] hover:text-[var(--primary-maroon)] transition-colors block text-stone-700"
                  >
                    کوردی (Soranî)
                  </button>
                  <button
                    onClick={() => setCurrentLang('AR')}
                    className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-[var(--maroon-wash)] hover:text-[var(--primary-maroon)] transition-colors block text-stone-700"
                  >
                    العربية
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main navigation ── */}
      <div className="glass-panel border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[72px]">

            {/* Logo & SUE Identity */}
            <Link href="/" className="flex items-center space-x-3 group">
              <img 
                src="/logo.png" 
                alt="Salahaddin University-Erbil Research Center Logo" 
                className="h-12 w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-sm" 
              />
              <div className="flex flex-col leading-tight">
                <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-[var(--maroon-ink)]">
                  Research Center
                </span>
                <span className="text-[10px] font-sans font-bold text-[var(--primary-maroon)] tracking-[0.14em] uppercase">
                  Salahaddin University-Erbil
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex space-x-7">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-[13px] font-semibold text-stone-600 hover:text-[var(--primary-maroon)] transition-colors py-2 relative group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[var(--accent-gold)] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>

            {/* Action Tools */}
            <div className="hidden lg:flex items-center">
              {session ? (
                <Link
                  href="/admin/dashboard"
                  className="px-5 py-2.5 rounded-full text-xs font-bold sue-btn-secondary shadow"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/admin/login"
                  className="px-5 py-2.5 rounded-full text-xs font-bold sue-btn-primary shadow"
                >
                  Portal Access
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center space-x-2">
              <button
                onClick={() => setCurrentLang(prev => prev === 'EN' ? 'KU' : prev === 'KU' ? 'AR' : 'EN')}
                className="p-2 rounded-lg text-stone-500 hover:text-[var(--primary-maroon)] hover:bg-[var(--maroon-wash)] transition-colors"
              >
                <Globe className="w-5 h-5" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-stone-600 hover:text-[var(--primary-maroon)] hover:bg-[var(--maroon-wash)] transition-all"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Menu Panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[var(--border-color)] bg-white/97 backdrop-blur-md px-4 py-6 space-y-1 shadow-inner">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-base font-bold text-stone-700 hover:bg-[var(--maroon-wash)] hover:text-[var(--primary-maroon)] transition-all"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 mt-3 border-t border-[var(--border-color)] flex flex-col space-y-3 px-4">
              {utilityLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold text-stone-500 hover:text-[var(--primary-maroon)]"
                >
                  {link.name}
                </Link>
              ))}
              <a
                href="https://su.edu.krd"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-sm font-semibold text-stone-500 hover:text-[var(--primary-maroon)]"
              >
                <span>Main SUE Website</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
              {session ? (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-full text-sm font-bold sue-btn-secondary block"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-full text-sm font-bold sue-btn-primary block"
                >
                  Portal Access
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
