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
  Edit3
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

interface Props {
  initialForms: FormItem[];
  initialRegulations: RegulationItem[];
}

export default function MasterAdminConsoleClient({ initialForms, initialRegulations }: Props) {
  const [activeTab, setActiveTab] = useState<'forms' | 'regulations'>('forms');
  const [forms, setForms] = useState<FormItem[]>(initialForms);
  const [regulations, setRegulations] = useState<RegulationItem[]>(initialRegulations);
  const [isAdding, setIsAdding] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New item form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newSubCategory, setNewSubCategory] = useState('');
  const [newFormType, setNewFormType] = useState('');
  const [newFileUrl, setNewFileUrl] = useState('');
  const [newFileFormat, setNewFileFormat] = useState('PDF');
  const [newDescription, setNewDescription] = useState('');
  const [newDraft, setNewDraft] = useState(false);

  const resetFormFields = () => {
    setNewTitle('');
    setNewCategory('');
    setNewSubCategory('');
    setNewFormType('');
    setNewFileUrl('');
    setNewFileFormat('PDF');
    setNewDescription('');
    setNewDraft(false);
    setIsAdding(false);
  };

  // Toggle Draft / Published
  const toggleFormDraft = async (id: string | number, currentDraft: boolean) => {
    try {
      const res = await fetch(`/api/forms/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draft: !currentDraft })
      });
      if (res.ok) {
        setForms(forms.map(f => f.id === id ? { ...f, draft: !currentDraft } : f));
        setFeedbackMsg({ type: 'success', text: `Form draft status updated.` });
      }
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: 'Failed to update draft status.' });
    }
  };

  const toggleRegulationDraft = async (id: string | number, currentDraft: boolean) => {
    try {
      const res = await fetch(`/api/regulations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draft: !currentDraft })
      });
      if (res.ok) {
        setRegulations(regulations.map(r => r.id === id ? { ...r, draft: !currentDraft } : r));
        setFeedbackMsg({ type: 'success', text: `Regulation draft status updated.` });
      }
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: 'Failed to update draft status.' });
    }
  };

  // Delete Item
  const deleteForm = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this form template?')) return;
    try {
      const res = await fetch(`/api/forms/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setForms(forms.filter(f => f.id !== id));
        setFeedbackMsg({ type: 'success', text: 'Form deleted successfully.' });
      }
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: 'Failed to delete form.' });
    }
  };

  const deleteRegulation = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this regulation policy?')) return;
    try {
      const res = await fetch(`/api/regulations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRegulations(regulations.filter(r => r.id !== id));
        setFeedbackMsg({ type: 'success', text: 'Regulation policy deleted successfully.' });
      }
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: 'Failed to delete regulation.' });
    }
  };

  // Create Item
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMsg(null);

    if (activeTab === 'forms') {
      try {
        const res = await fetch('/api/forms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: newTitle,
            category: newCategory || 'General Forms',
            subCategory: newSubCategory || null,
            formType: newFormType || null,
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
        } else {
          setFeedbackMsg({ type: 'error', text: 'Failed to create form template.' });
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
            subCategory: newSubCategory || null,
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
        } else {
          setFeedbackMsg({ type: 'error', text: 'Failed to create regulation policy.' });
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('forms')}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'forms' ? 'bg-[var(--primary-maroon)] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Downloadable Forms ({forms.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('regulations')}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'regulations' ? 'bg-[var(--secondary-blue)] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Governance Policies ({regulations.length})</span>
          </button>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-[var(--accent-gold)] text-slate-900 hover:bg-amber-400 flex items-center space-x-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New {activeTab === 'forms' ? 'Form Template' : 'Policy Regulation'}</span>
        </button>
      </div>

      {/* Creation Drawer / Card */}
      {isAdding && (
        <form onSubmit={handleCreate} className="bg-white rounded-3xl p-8 border-2 border-[var(--primary-maroon)] shadow-md space-y-6">
          <h3 className="text-sm font-extrabold text-[var(--secondary-blue)] border-b border-slate-100 pb-3">
            Add New {activeTab === 'forms' ? 'Downloadable Form Template' : 'Governance Policy'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Document Title *</label>
              <input 
                type="text" 
                required
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. Clinical Trial Ethics Application Form" 
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Category *</label>
              <input 
                type="text" 
                required
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                placeholder="e.g. Research Ethics Review" 
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Sub-Category</label>
              <input 
                type="text" 
                value={newSubCategory}
                onChange={e => setNewSubCategory(e.target.value)}
                placeholder="e.g. Human Research Ethics" 
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-semibold"
              />
            </div>

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

            {activeTab === 'forms' && (
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">File Format</label>
                <select 
                  value={newFileFormat}
                  onChange={e => setNewFileFormat(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-semibold"
                >
                  <option value="DOCX">DOCX (Word Document)</option>
                  <option value="PDF">PDF Document</option>
                  <option value="ZIP">ZIP Archive</option>
                </select>
              </div>
            )}

            <div className="space-y-1.5 md:col-span-2">
              <label className="font-bold text-slate-700">Description / Guidelines</label>
              <textarea 
                rows={3}
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
                placeholder="Provide applicant instructions or policy overview..." 
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

      {/* Items List Table / Cards */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
        
        <h3 className="text-sm font-extrabold text-[var(--secondary-blue)] border-b border-slate-100 pb-3">
          Manage {activeTab === 'forms' ? 'Downloadable Form Templates' : 'Governance Regulations'}
        </h3>

        {activeTab === 'forms' ? (
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
                    onClick={() => toggleFormDraft(form.id, form.draft)}
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
                    onClick={() => deleteForm(form.id)}
                    className="p-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
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
                    onClick={() => toggleRegulationDraft(reg.id, reg.draft)}
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
                    onClick={() => deleteRegulation(reg.id)}
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
