'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  Download,
  Layers,
  Award,
  ExternalLink
} from 'lucide-react';

interface FormItem {
  id: string | number;
  title: string;
  category: string;
  subCategory?: string | null;
  formType?: string | null;
  description?: string | null;
  filePath?: string | null;
  fileUrl?: string | null;
  fileFormat?: string | null;
  fileSize?: string | null;
  draft: boolean;
}

interface RegulationItem {
  id: string | number;
  title: string;
  category: string;
  subCategory?: string | null;
  description?: string | null;
  filePath?: string | null;
  fileUrl?: string | null;
  draft: boolean;
}

interface UnitItem {
  id: string;
  title: string;
  name: string;
  description?: string | null;
  draft: boolean;
}

interface LabItem {
  id: string;
  title: string;
  name: string;
  description?: string | null;
  platforms?: string[];
  draft: boolean;
}

interface Props {
  initialForms: FormItem[];
  initialRegulations: RegulationItem[];
  initialUnits: UnitItem[];
  initialLabs: LabItem[];
}

export default function MasterAdminConsoleClient({ 
  initialForms, 
  initialRegulations,
  initialUnits,
  initialLabs
}: Props) {
  const [activeTab, setActiveTab] = useState<'units' | 'labs' | 'forms' | 'regulations'>('units');
  const [forms, setForms] = useState<FormItem[]>(initialForms);
  const [regulations, setRegulations] = useState<RegulationItem[]>(initialRegulations);
  const [units, setUnits] = useState<UnitItem[]>(initialUnits);
  const [labs, setLabs] = useState<LabItem[]>(initialLabs);

  const [isAdding, setIsAdding] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New item form state
  const [newId, setNewId] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newSubCategory, setNewSubCategory] = useState('');
  const [newFileUrl, setNewFileUrl] = useState('');
  const [newFileFormat, setNewFileFormat] = useState('PDF');
  const [newDescription, setNewDescription] = useState('');
  const [newPlatforms, setNewPlatforms] = useState('');
  const [newDraft, setNewDraft] = useState(false);

  const resetFormFields = () => {
    setNewId('');
    setNewTitle('');
    setNewCategory('');
    setNewSubCategory('');
    setNewFileUrl('');
    setNewFileFormat('PDF');
    setNewDescription('');
    setNewPlatforms('');
    setNewDraft(false);
    setIsAdding(false);
  };

  // Toggle Draft / Published
  const toggleDraft = async (type: 'units' | 'labs' | 'forms' | 'regulations', id: string | number, currentDraft: boolean) => {
    try {
      const endpoint = type === 'units' ? `/api/units/${id}` :
                       type === 'labs' ? `/api/labs/${id}` :
                       type === 'forms' ? `/api/forms/${id}` : `/api/regulations/${id}`;
      
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draft: !currentDraft })
      });
      
      if (res.ok) {
        if (type === 'units') setUnits(units.map(u => u.id === id ? { ...u, draft: !currentDraft } : u));
        if (type === 'labs') setLabs(labs.map(l => l.id === id ? { ...l, draft: !currentDraft } : l));
        if (type === 'forms') setForms(forms.map(f => f.id === id ? { ...f, draft: !currentDraft } : f));
        if (type === 'regulations') setRegulations(regulations.map(r => r.id === id ? { ...r, draft: !currentDraft } : r));
        setFeedbackMsg({ type: 'success', text: `Item draft status updated.` });
      }
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: 'Failed to update draft status.' });
    }
  };

  // Delete Item
  const deleteItem = async (type: 'units' | 'labs' | 'forms' | 'regulations', id: string | number) => {
    if (!confirm(`Are you sure you want to delete this ${type.slice(0, -1)}?`)) return;
    try {
      const endpoint = type === 'units' ? `/api/units/${id}` :
                       type === 'labs' ? `/api/labs/${id}` :
                       type === 'forms' ? `/api/forms/${id}` : `/api/regulations/${id}`;
      
      const res = await fetch(endpoint, { method: 'DELETE' });
      if (res.ok) {
        if (type === 'units') setUnits(units.filter(u => u.id !== id));
        if (type === 'labs') setLabs(labs.filter(l => l.id !== id));
        if (type === 'forms') setForms(forms.filter(f => f.id !== id));
        if (type === 'regulations') setRegulations(regulations.filter(r => r.id !== id));
        setFeedbackMsg({ type: 'success', text: `${type.slice(0, -1)} deleted successfully.` });
      }
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: `Failed to delete ${type.slice(0, -1)}.` });
    }
  };

  // Create Item
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMsg(null);

    if (activeTab === 'units') {
      try {
        const res = await fetch('/api/units', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: newId.toLowerCase().replace(/\s+/g, '-'),
            title: newTitle,
            name: newTitle,
            description: newDescription || null,
            draft: newDraft
          })
        });
        if (res.ok) {
          const created = await res.json();
          setUnits([created, ...units]);
          setFeedbackMsg({ type: 'success', text: 'New Research Unit created successfully!' });
          resetFormFields();
        }
      } catch (err) {
        setFeedbackMsg({ type: 'error', text: 'Error creating research unit.' });
      }
    } else if (activeTab === 'labs') {
      try {
        const res = await fetch('/api/labs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: newId.toLowerCase().replace(/\s+/g, '-'),
            title: newTitle,
            name: newTitle,
            description: newDescription || null,
            platforms: newPlatforms ? newPlatforms.split(',').map(p => p.trim()) : [],
            draft: newDraft
          })
        });
        if (res.ok) {
          const created = await res.json();
          setLabs([created, ...labs]);
          setFeedbackMsg({ type: 'success', text: 'New Core Laboratory created successfully!' });
          resetFormFields();
        }
      } catch (err) {
        setFeedbackMsg({ type: 'error', text: 'Error creating core laboratory.' });
      }
    } else if (activeTab === 'forms') {
      try {
        const res = await fetch('/api/forms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: newTitle,
            category: newCategory || 'General Forms',
            subCategory: newSubCategory || null,
            description: newDescription || null,
            fileUrl: newFileUrl || '/forms/SUE_Human_Research_Form (2).docx',
            fileFormat: newFileFormat,
            draft: newDraft
          })
        });
        if (res.ok) {
          const created = await res.json();
          setForms([created, ...forms]);
          setFeedbackMsg({ type: 'success', text: 'New form template created successfully!' });
          resetFormFields();
        }
      } catch (err) {
        setFeedbackMsg({ type: 'error', text: 'Error creating form template.' });
      }
    } else {
      try {
        const res = await fetch('/api/regulations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: newTitle,
            category: newCategory || 'Institutional Governance',
            description: newDescription || null,
            fileUrl: newFileUrl || '/policies/SURC_Research_Center_Policy.pdf',
            draft: newDraft
          })
        });
        if (res.ok) {
          const created = await res.json();
          setRegulations([created, ...regulations]);
          setFeedbackMsg({ type: 'success', text: 'New regulation policy created successfully!' });
          resetFormFields();
        }
      } catch (err) {
        setFeedbackMsg({ type: 'error', text: 'Error creating regulation policy.' });
      }
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Feedback Banner */}
      {feedbackMsg && (
        <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center space-x-2 ${
          feedbackMsg.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          {feedbackMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Control Tabs & Action Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        
        <div className="grid grid-cols-2 sm:flex space-x-0 sm:space-x-2 gap-2 w-full lg:w-auto">
          <button
            onClick={() => setActiveTab('units')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'units' ? 'bg-[var(--primary-maroon)] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Specialized Units ({units.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('labs')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'labs' ? 'bg-purple-800 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Core Laboratories ({labs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('forms')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'forms' ? 'bg-[var(--secondary-blue)] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Forms ({forms.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('regulations')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'regulations' ? 'bg-slate-800 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Policies ({regulations.length})</span>
          </button>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-[var(--accent-gold)] text-slate-900 hover:bg-amber-400 flex items-center space-x-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New {
            activeTab === 'units' ? 'Research Unit' :
            activeTab === 'labs' ? 'Core Laboratory' :
            activeTab === 'forms' ? 'Form Template' : 'Policy Regulation'
          }</span>
        </button>
      </div>

      {/* Creation Drawer / Card */}
      {isAdding && (
        <form onSubmit={handleCreate} className="bg-white rounded-3xl p-8 border-2 border-[var(--primary-maroon)] shadow-md space-y-6">
          <h3 className="text-sm font-extrabold text-[var(--secondary-blue)] border-b border-slate-100 pb-3">
            Add New {
              activeTab === 'units' ? 'Specialized Research Unit' :
              activeTab === 'labs' ? 'Core Research Laboratory' :
              activeTab === 'forms' ? 'Downloadable Form Template' : 'Governance Policy'
            }
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {(activeTab === 'units' || activeTab === 'labs') && (
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Unique Slug / ID *</label>
                <input 
                  type="text" 
                  required
                  value={newId}
                  onChange={e => setNewId(e.target.value)}
                  placeholder="e.g. emccu or cancer-biology" 
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-semibold"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Title *</label>
              <input 
                type="text" 
                required
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. Environmental Monitoring & Climate Change Unit" 
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-semibold"
              />
            </div>

            {(activeTab === 'forms' || activeTab === 'regulations') && (
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Category *</label>
                <input 
                  type="text" 
                  required
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  placeholder="e.g. Ethics Review Application" 
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-semibold"
                />
              </div>
            )}

            {(activeTab === 'forms' || activeTab === 'regulations') && (
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">File Download Path / URL *</label>
                <input 
                  type="text" 
                  required
                  value={newFileUrl}
                  onChange={e => setNewFileUrl(e.target.value)}
                  placeholder="e.g. /forms/SUE_Human_Research_Form (2).docx" 
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-semibold"
                />
              </div>
            )}

            {activeTab === 'labs' && (
              <div className="space-y-1.5 md:col-span-2">
                <label className="font-bold text-slate-700">Specialized Platforms (Comma-Separated)</label>
                <input 
                  type="text" 
                  value={newPlatforms}
                  onChange={e => setNewPlatforms(e.target.value)}
                  placeholder="e.g. BSL-2 Cell Culture, qPCR Molecular Biology, SDS-PAGE Protein Analysis" 
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-semibold"
                />
              </div>
            )}

            <div className="space-y-1.5 md:col-span-2">
              <label className="font-bold text-slate-700">Description / Scope Overview</label>
              <textarea 
                rows={3}
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
                placeholder="Provide operational guidelines, scope, or details..." 
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-semibold"
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input 
                type="checkbox" 
                checked={newDraft}
                onChange={e => setNewDraft(e.target.checked)}
                className="w-4 h-4 text-[var(--primary-maroon)] rounded"
              />
              <span>Save as Draft (Hide from public website)</span>
            </label>

            <div className="flex space-x-3">
              <button 
                type="button" 
                onClick={resetFormFields}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[var(--primary-maroon)] text-white hover:bg-red-900 shadow-sm"
              >
                Save Item
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Items List Cards */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
        
        <h3 className="text-sm font-extrabold text-[var(--secondary-blue)] border-b border-slate-100 pb-3">
          Manage {
            activeTab === 'units' ? 'Specialized Research Units' :
            activeTab === 'labs' ? 'Core Laboratories' :
            activeTab === 'forms' ? 'Downloadable Form Templates' : 'Governance Regulations'
          }
        </h3>

        {activeTab === 'units' && (
          <div className="space-y-4">
            {units.map(unit => (
              <div key={unit.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                      unit.draft ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {unit.draft ? 'Draft' : 'Active'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID: {unit.id}</span>
                  </div>
                  <h4 className="text-xs font-extrabold text-[var(--secondary-blue)]">{unit.title}</h4>
                  <p className="text-[10px] text-slate-500 font-medium line-clamp-2">{unit.description || 'No description.'}</p>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-center">
                  <button
                    onClick={() => toggleDraft('units', unit.id, unit.draft)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold flex items-center space-x-1 transition-all ${
                      unit.draft ? 'bg-slate-200 text-slate-700 hover:bg-green-100 hover:text-green-800' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    }`}
                  >
                    {unit.draft ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{unit.draft ? 'Publish' : 'Set Draft'}</span>
                  </button>

                  <a 
                    href={`/units/${unit.id}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 text-[10px] font-bold flex items-center space-x-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => deleteItem('units', unit.id)}
                    className="p-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'labs' && (
          <div className="space-y-4">
            {labs.map(lab => (
              <div key={lab.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                      lab.draft ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {lab.draft ? 'Draft' : 'Laboratory'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID: {lab.id}</span>
                  </div>
                  <h4 className="text-xs font-extrabold text-[var(--secondary-blue)]">{lab.title}</h4>
                  <p className="text-[10px] text-slate-500 font-medium line-clamp-2">{lab.description || 'No description.'}</p>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-center">
                  <button
                    onClick={() => toggleDraft('labs', lab.id, lab.draft)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold flex items-center space-x-1 transition-all ${
                      lab.draft ? 'bg-slate-200 text-slate-700 hover:bg-green-100 hover:text-green-800' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    }`}
                  >
                    {lab.draft ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{lab.draft ? 'Publish' : 'Set Draft'}</span>
                  </button>

                  <a 
                    href={`/labs/${lab.id}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 text-[10px] font-bold flex items-center space-x-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => deleteItem('labs', lab.id)}
                    className="p-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'forms' && (
          <div className="space-y-4">
            {forms.map(form => (
              <div key={form.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                      form.draft ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {form.draft ? 'Draft' : 'Published'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{form.category}</span>
                  </div>
                  <h4 className="text-xs font-extrabold text-[var(--secondary-blue)]">{form.title}</h4>
                  <p className="text-[10px] text-slate-500 font-medium line-clamp-2">{form.description || 'No description provided.'}</p>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-center">
                  <button
                    onClick={() => toggleDraft('forms', form.id, form.draft)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold flex items-center space-x-1 transition-all ${
                      form.draft ? 'bg-slate-200 text-slate-700 hover:bg-green-100 hover:text-green-800' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    }`}
                  >
                    {form.draft ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{form.draft ? 'Publish' : 'Set Draft'}</span>
                  </button>

                  <a 
                    href={form.filePath || form.fileUrl || '#'} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 text-[10px] font-bold flex items-center space-x-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => deleteItem('forms', form.id)}
                    className="p-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'regulations' && (
          <div className="space-y-4">
            {regulations.map(reg => (
              <div key={reg.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                      reg.draft ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {reg.draft ? 'Draft' : 'Published'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{reg.category}</span>
                  </div>
                  <h4 className="text-xs font-extrabold text-[var(--secondary-blue)]">{reg.title}</h4>
                  <p className="text-[10px] text-slate-500 font-medium line-clamp-2">{reg.description || 'No description provided.'}</p>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-center">
                  <button
                    onClick={() => toggleDraft('regulations', reg.id, reg.draft)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold flex items-center space-x-1 transition-all ${
                      reg.draft ? 'bg-slate-200 text-slate-700 hover:bg-green-100 hover:text-green-800' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    }`}
                  >
                    {reg.draft ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{reg.draft ? 'Publish' : 'Set Draft'}</span>
                  </button>

                  <a 
                    href={reg.filePath || reg.fileUrl || '#'} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 text-[10px] font-bold flex items-center space-x-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => deleteItem('regulations', reg.id)}
                    className="p-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
