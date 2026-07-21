'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Globe, ArrowUpRight, Menu, X, Landmark, Search, BookOpen, Layers } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Research Units', href: '/units' },
    { name: 'Researchers', href: '/staff' },
    { name: 'Projects', href: '/projects' },
    { name: 'Publications', href: '/publications' },
    { name: 'Labs & Equipment', href: '/labs' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel shadow-sm border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo & SUE Identity */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[var(--primary-maroon)] text-white shadow-md">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <Link href="/" className="font-extrabold text-lg sm:text-xl tracking-tight text-[var(--secondary-blue)] flex flex-col leading-tight">
                <span>Salahaddin University</span>
                <span className="text-xs font-semibold text-[var(--primary-maroon)] tracking-wider uppercase">Research Center</span>
              </Link>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-slate-600 hover:text-[var(--primary-maroon)] transition-colors py-2 relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--primary-maroon)] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Action Tools & Switchers */}
          <div className="hidden lg:flex items-center space-x-6">
            
            {/* Main SUE Portal Back-Link */}
            <a 
              href="https://su.edu.krd" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-bold text-slate-500 hover:text-[var(--secondary-blue)] flex items-center space-x-1 border-r border-slate-300 pr-5 transition-colors"
            >
              <span>Main SUE Website</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            {/* Language Swapper Dropdown Container */}
            <div className="relative lang-container py-2">
              <button className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-[var(--primary-maroon)] transition-colors">
                <Globe className="w-4 h-4" />
                <span>{currentLang === 'EN' ? 'ENGLISH' : currentLang === 'KU' ? 'SORANÎ' : 'العربية'}</span>
              </button>
              
              {/* Dropdown panel */}
              <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-200 rounded-xl shadow-lg lang-dropdown py-1 overflow-hidden">
                <button 
                  onClick={() => setCurrentLang('EN')}
                  className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-55 hover:text-[var(--primary-maroon)] transition-colors block text-slate-700"
                >
                  English
                </button>
                <button 
                  onClick={() => setCurrentLang('KU')}
                  className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-55 hover:text-[var(--primary-maroon)] transition-colors block text-slate-700"
                >
                  کوردی (Soranî)
                </button>
                <button 
                  onClick={() => setCurrentLang('AR')}
                  className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-55 hover:text-[var(--primary-maroon)] transition-colors block text-slate-700"
                >
                  العربية
                </button>
              </div>
            </div>

            {/* Premium Admin Console Login */}
            <Link 
              href="/admin/login" 
              className="px-5 py-2.5 rounded-xl text-xs font-bold sue-btn-primary"
            >
              Portal Access
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-4">
            {/* Quick Lang Switcher for mobile */}
            <button 
              onClick={() => setCurrentLang(prev => prev === 'EN' ? 'KU' : prev === 'KU' ? 'AR' : 'EN')}
              className="p-2 rounded-lg text-slate-500 hover:text-[var(--primary-maroon)] hover:bg-slate-100 transition-colors"
            >
              <Globe className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-[var(--primary-maroon)] hover:bg-slate-100 transition-all"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 py-6 space-y-3 shadow-inner">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-xl text-base font-bold text-slate-700 hover:bg-[var(--bg-neutral-light)] hover:text-[var(--primary-maroon)] transition-all"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-100 flex flex-col space-y-3 px-4">
            <a 
              href="https://su.edu.krd" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-between text-sm font-semibold text-slate-500 hover:text-[var(--secondary-blue)]"
            >
              <span>Main SUE Website</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 rounded-xl text-sm font-bold sue-btn-primary block"
            >
              Portal Access
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
