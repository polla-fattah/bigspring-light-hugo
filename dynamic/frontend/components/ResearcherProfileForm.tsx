'use client';

import React, { useState } from 'react';
import { updateStaffProfile } from '../app/staff/actions';
import { Loader2, CheckCircle2, User, Globe, Mail, Award, BookOpen } from 'lucide-react';

interface StaffDetail {
  id: string;
  title: string;
  subtitle: string | null;
  image: string | null;
  titlePosition: string | null;
  email: string | null;
  orcid: string | null;
  googleScholar: string | null;
  scopus: string | null;
  researchgate: string | null;
  personalWebsite: string | null;
  bio: string | null;
  description: string | null;
  researchAreas: string[];
}

interface Props {
  staff: StaffDetail;
}

export default function ResearcherProfileForm({ staff }: Props) {
  const [title, setTitle] = useState(staff.title);
  const [subtitle, setSubtitle] = useState(staff.subtitle || '');
  const [image, setImage] = useState(staff.image || '');
  const [titlePosition, setTitlePosition] = useState(staff.titlePosition || '');
  const [email, setEmail] = useState(staff.email || '');
  const [orcid, setOrcid] = useState(staff.orcid || '');
  const [googleScholar, setGoogleScholar] = useState(staff.googleScholar || '');
  const [scopus, setScopus] = useState(staff.scopus || '');
  const [researchgate, setResearchgate] = useState(staff.researchgate || '');
  const [personalWebsite, setPersonalWebsite] = useState(staff.personalWebsite || '');
  const [bio, setBio] = useState(staff.bio || '');
  const [description, setDescription] = useState(staff.description || '');
  const [researchAreasStr, setResearchAreasStr] = useState(staff.researchAreas.join(', '));
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    const areas = researchAreasStr
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    try {
      await updateStaffProfile(staff.id, {
        title,
        subtitle: subtitle || null,
        image: image || null,
        titlePosition: titlePosition || null,
        email: email || null,
        orcid: orcid || null,
        googleScholar: googleScholar || null,
        scopus: scopus || null,
        researchgate: researchgate || null,
        personalWebsite: personalWebsite || null,
        bio: bio || null,
        description: description || null,
        researchAreas: areas,
      });

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || 'Failed to update profile details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {success && (
        <div className="flex items-center space-x-2 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold p-4 rounded-xl">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span>Your researcher profile has been updated successfully! Changes are live on your public page.</span>
        </div>
      )}

      {error && (
        <div className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 p-4 rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Box 1: Core Details */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-[var(--secondary-blue)] border-b border-slate-100 pb-4 flex items-center space-x-2">
            <User className="w-5 h-5 text-[var(--primary-maroon)]" />
            <span>Core Researcher Info</span>
          </h3>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">Full Name / Academic Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent bg-white transition-all"
                placeholder="e.g. Dr. Samir Bilal"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">Academic Subtitle</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent bg-white transition-all"
                placeholder="e.g. Lecturer in Software Engineering"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">Profile Image / Avatar URL</label>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-xs font-extrabold text-[var(--primary-maroon)] overflow-hidden border border-slate-200 shadow-inner">
                  {image ? (
                    <img 
                      src={image} 
                      alt="Preview" 
                      className="w-full h-full object-cover" 
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    title.charAt(0) || 'U'
                  )}
                </div>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent bg-white transition-all"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">Administrative Position (Optional)</label>
              <input
                type="text"
                value={titlePosition}
                onChange={(e) => setTitlePosition(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent bg-white transition-all"
                placeholder="e.g. Head of Data Analysis Unit"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">Public Contact Email</label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 placeholder-slate-455 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent transition-all"
                  placeholder="e.g. researcher@su.edu.krd"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">Research Focus Areas (Comma separated)</label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Award className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={researchAreasStr}
                  onChange={(e) => setResearchAreasStr(e.target.value)}
                  className="block w-full pl-10 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 placeholder-slate-455 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent transition-all"
                  placeholder="e.g. Machine Learning, Kurdish NLP, Data Mining"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Box 2: Academic & Research Indices */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-[var(--secondary-blue)] border-b border-slate-100 pb-4 flex items-center space-x-2">
            <Globe className="w-5 h-5 text-[var(--primary-maroon)]" />
            <span>Academic Registry Profiles & Website</span>
          </h3>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">Personal/Faculty Web URL</label>
              <input
                type="url"
                value={personalWebsite}
                onChange={(e) => setPersonalWebsite(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent bg-white transition-all"
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">ORCID Identifier URL</label>
              <input
                type="url"
                value={orcid}
                onChange={(e) => setOrcid(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent bg-white transition-all"
                placeholder="https://orcid.org/0000-0000-0000-0000"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">Google Scholar Profile URL</label>
              <input
                type="url"
                value={googleScholar}
                onChange={(e) => setGoogleScholar(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent bg-white transition-all"
                placeholder="https://scholar.google.com/citations?user=..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">Scopus Author ID URL</label>
              <input
                type="url"
                value={scopus}
                onChange={(e) => setScopus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent bg-white transition-all"
                placeholder="https://www.scopus.com/authid/detail.uri?authorId=..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">ResearchGate Profile URL</label>
              <input
                type="url"
                value={researchgate}
                onChange={(e) => setResearchgate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent bg-white transition-all"
                placeholder="https://www.researchgate.net/profile/..."
              />
            </div>
          </div>
        </div>

      </div>

      {/* Box 3: Descriptions & Bios */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-sm font-bold text-[var(--secondary-blue)] border-b border-slate-100 pb-4 flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-[var(--primary-maroon)]" />
          <span>Professional Biography & Research Summary</span>
        </h3>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600">Short Bio Statement (Displays in list directories)</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent bg-white h-24"
              placeholder="Provide a brief summary profile..."
            ></textarea>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600">Detailed Research Overview (Displays on profile page)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent bg-white h-44"
              placeholder="Provide detailed descriptions of your research achievements, publication history details, and focus..."
            ></textarea>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center space-x-2 px-8 py-4 bg-[var(--primary-maroon)] hover:bg-[var(--primary-maroon-hover)] text-white text-xs font-bold rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Updating Profile Records...</span>
            </>
          ) : (
            <span>Save Profile Updates</span>
          )}
        </button>
      </div>

    </form>
  );
}
