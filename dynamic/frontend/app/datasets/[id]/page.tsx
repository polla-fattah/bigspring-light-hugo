import React from 'react';
import Link from 'next/link';
import { Database, Calendar, Layers, FileText, ArrowLeft, Download, ExternalLink, ShieldCheck } from 'lucide-react';
import { fetchFromBackend } from '../../../lib/api';

interface UnitSummary {
  id: string;
  title: string;
}

interface ProjectSummary {
  id: string;
  title: string;
}

interface DatasetDetail {
  id: string;
  title: string;
  name: string;
  description: string | null;
  access: string | null;
  format: string | null;
  year: string | null;
  downloadUrl: string | null;
  license: string | null;
  citation: string | null;
  unit: UnitSummary | null;
  projects: ProjectSummary[];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DatasetDetailPage({ params }: PageProps) {
  const { id } = await params;
  let dataset: DatasetDetail | null = null;
  let errorMsg: string | null = null;

  try {
    dataset = await fetchFromBackend<DatasetDetail>(`/api/datasets/${id}`);
  } catch (err: any) {
    console.error(`Error fetching dataset ${id}:`, err);
    errorMsg = 'Dataset not found or failed to load.';
  }

  if (errorMsg || !dataset) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 text-red-800 p-6 rounded-2xl border border-red-200">
          <h2 className="text-xl font-bold mb-2">Dataset Not Found</h2>
          <p className="text-sm text-red-600 mb-6">{errorMsg || 'The requested dataset could not be located.'}</p>
          <Link
            href="/datasets"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-[var(--primary-maroon)] text-white hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Open Datasets</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link
          href="/datasets"
          className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-600 hover:text-[var(--primary-maroon)] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Open Datasets</span>
        </Link>

        {/* Dataset Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              {dataset.access || 'Open Access'}
            </span>
            {dataset.format && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                Format: {dataset.format}
              </span>
            )}
            {dataset.year && (
              <span className="flex items-center text-xs font-semibold text-slate-500">
                <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                Released {dataset.year}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--navy-slate)] mb-4 leading-tight">
            {dataset.title}
          </h1>

          {dataset.unit && (
            <div className="flex items-center space-x-2 text-sm text-slate-600 mb-6">
              <Layers className="w-4 h-4 text-[var(--primary-maroon)]" />
              <span>Research Unit:</span>
              <Link
                href={`/units/${dataset.unit.id}`}
                className="font-semibold text-[var(--primary-maroon)] hover:underline"
              >
                {dataset.unit.title}
              </Link>
            </div>
          )}

          {dataset.description && (
            <div className="prose max-w-none text-slate-700 text-sm sm:text-base leading-relaxed border-t border-slate-100 pt-6">
              {dataset.description}
            </div>
          )}

          {/* Action Bar */}
          {dataset.downloadUrl && (
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-4">
              <a
                href={dataset.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-bold bg-[var(--primary-maroon)] text-white shadow-md hover:opacity-90 transition-opacity"
              >
                <Download className="w-4 h-4" />
                <span>Download Dataset File</span>
              </a>
            </div>
          )}
        </div>

        {/* Supplementary Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Metadata Sidebar */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-[var(--navy-slate)] mb-4 flex items-center">
              <Database className="w-5 h-5 mr-2 text-[var(--primary-maroon)]" />
              Dataset Specifications
            </h3>
            <dl className="divide-y divide-slate-100 text-sm">
              <div className="py-3 flex justify-between">
                <dt className="text-slate-500 font-medium">Dataset ID</dt>
                <dd className="font-mono text-xs font-semibold text-slate-800">{dataset.id}</dd>
              </div>
              <div className="py-3 flex justify-between">
                <dt className="text-slate-500 font-medium">Access Rights</dt>
                <dd className="font-semibold text-emerald-600">{dataset.access || 'Open Access'}</dd>
              </div>
              <div className="py-3 flex justify-between">
                <dt className="text-slate-500 font-medium">File Format</dt>
                <dd className="font-semibold text-slate-800">{dataset.format || 'CSV / Raw'}</dd>
              </div>
              {dataset.license && (
                <div className="py-3 flex justify-between">
                  <dt className="text-slate-500 font-medium">License</dt>
                  <dd className="font-semibold text-slate-800">{dataset.license}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Related Projects */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-[var(--navy-slate)] mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-[var(--primary-maroon)]" />
              Associated Projects
            </h3>
            {dataset.projects && dataset.projects.length > 0 ? (
              <ul className="space-y-3">
                {dataset.projects.map((proj) => (
                  <li key={proj.id}>
                    <Link
                      href={`/projects/${proj.id}`}
                      className="group flex items-start justify-between p-3 rounded-xl bg-slate-50 hover:bg-red-50/60 border border-slate-100 transition-colors"
                    >
                      <span className="text-sm font-semibold text-slate-800 group-hover:text-[var(--primary-maroon)]">
                        {proj.title}
                      </span>
                      <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[var(--primary-maroon)] flex-shrink-0 ml-2" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 italic">No associated research projects linked.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
