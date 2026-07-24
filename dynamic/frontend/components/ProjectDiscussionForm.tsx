'use client';

import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { postDiscussionMessage } from '../app/projects/[id]/actions';
import Link from 'next/link';

interface Props {
  projectId: string;
  senderId: string | null;
}

export default function ProjectDiscussionForm({ projectId, senderId }: Props) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!senderId) {
    return (
      <div className="pt-4 border-t border-slate-100">
        <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-3 items-center justify-between text-xs text-slate-500 font-medium">
          <span>Must be logged in as a registered SUE researcher to post.</span>
          <Link href="/admin/login" className="text-[var(--primary-maroon)] font-bold hover:underline">
            Login to Portal →
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!message.trim()) return;

    setLoading(true);
    try {
      await postDiscussionMessage(projectId, senderId, message);
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Failed to post message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-4 border-t border-slate-100 space-y-2">
      {error && (
        <p className="text-[10px] font-semibold text-red-600">
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} className="flex bg-slate-50 border border-slate-200 rounded-xl p-1.5 focus-within:ring-2 focus-within:ring-[var(--primary-maroon)] focus-within:border-transparent transition-all">
        <input 
          type="text" 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Post a status update or team coordination note..."
          className="w-full bg-transparent border-0 text-xs text-slate-700 placeholder-slate-400 focus:ring-0 focus:outline-none px-2 py-2"
          disabled={loading}
        />
        <button 
          type="submit"
          disabled={loading || !message.trim()}
          className="p-2.5 rounded-lg bg-[var(--primary-maroon)] hover:bg-[var(--primary-maroon-hover)] text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[36px]"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
}
