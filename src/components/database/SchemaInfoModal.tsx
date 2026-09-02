import React, { useState } from 'react';
import { Database, ShieldCheck, Copy, Check, X, Table, Lock } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { LanguageCode } from '../../types';

export interface SchemaInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
}

export const SchemaInfoModal: React.FC<SchemaInfoModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [copied, setCopied] = useState(false);
  const isHindi = language === 'hi';

  if (!isOpen) return null;

  const schemaSummary = [
    {
      table: 'profiles',
      description: 'Campus student/staff identity, preferred language, and metadata.',
      rls: 'Users can view/update/insert only their own profile (auth.uid() = id)',
      fields: ['id (UUID, PK)', 'name (TEXT)', 'email (TEXT, UNIQUE)', 'preferred_language (VARCHAR)', 'created_at (TIMESTAMPTZ)'],
    },
    {
      table: 'emergency_contacts',
      description: 'Designated campus security, dorm RAs, advisors, and family contacts.',
      rls: 'Full CRUD isolated to owner (auth.uid() = user_id)',
      fields: ['id (UUID, PK)', 'user_id (UUID, FK)', 'name (TEXT)', 'email (TEXT)', 'phone (TEXT)', 'relationship (TEXT)', 'is_primary (BOOLEAN)', 'created_at (TIMESTAMPTZ)'],
    },
    {
      table: 'incidents',
      description: 'Triage records, multimodal inputs (text + image URL), severity, and confidence.',
      rls: 'Users can view and insert only their own incidents (auth.uid() = user_id)',
      fields: ['id (UUID, PK)', 'user_id (UUID, FK)', 'input_type (VARCHAR)', 'input_text (TEXT)', 'image_url (TEXT)', 'incident_type (TEXT)', 'severity (VARCHAR)', 'confidence (NUMERIC)', 'escalation_required (BOOLEAN)', 'created_at (TIMESTAMPTZ)'],
    },
    {
      table: 'guidance',
      description: 'Safety-bounded first-aid actions, avoid lists (contraindications), escalation notes.',
      rls: 'Users can view and insert guidance matching incidents they own',
      fields: ['id (UUID, PK)', 'incident_id (UUID, FK)', 'language (VARCHAR)', 'steps (JSONB)', 'avoid_actions (JSONB)', 'escalation_conditions (TEXT)', 'warning (TEXT)', 'created_at (TIMESTAMPTZ)'],
    },
    {
      table: 'alert_logs',
      description: 'Audited log of dispatched explicit notifications to emergency contacts.',
      rls: 'Users can view and insert alert logs matching incidents they own',
      fields: ['id (UUID, PK)', 'incident_id (UUID, FK)', 'contact_id (UUID, FK)', 'status (VARCHAR)', 'sent_at (TIMESTAMPTZ)', 'error_message (TEXT)'],
    },
  ];

  const handleCopySQL = () => {
    navigator.clipboard.writeText(`-- Med AI Supabase PostgreSQL Schema
-- Tables: profiles, emergency_contacts, incidents, guidance, alert_logs with RLS
-- See /src/db/schema.sql for the complete DDL.`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                {isHindi ? 'डेटाबेस स्कीमा एवं सुरक्षा नीतियां (RLS)' : 'Supabase PostgreSQL Schema & RLS Architecture'}
              </h3>
              <p className="text-xs text-slate-500">
                {isHindi ? '5 मुख्य तालिकाएं एवं पूर्ण रो-लेवल सुरक्षा नीतियां' : '5 core tables with strict per-user row level isolation'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-emerald-900">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                <strong>Row Level Security (RLS): </strong>
                All queries automatically filter by <code className="bg-white/80 px-1 py-0.5 rounded font-mono text-[11px]">auth.uid() = user_id</code>.
              </span>
            </div>
            <Badge variant="success" size="sm">Hardened</Badge>
          </div>

          <div className="space-y-3">
            {schemaSummary.map((item) => (
              <div key={item.table} className="border border-slate-200 rounded-xl p-3.5 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Table className="w-4 h-4 text-slate-500" />
                    <span className="font-mono font-bold text-slate-900 text-sm">{item.table}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    <Lock className="w-3 h-3" /> RLS Enabled
                  </span>
                </div>
                <p className="text-slate-600">{item.description}</p>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">RLS Policy:</span>
                  <p className="text-slate-700 font-mono text-[11px]">{item.rls}</p>
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {item.fields.map((f, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono text-[10px]">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <Button
            size="sm"
            variant="outline"
            leftIcon={copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            onClick={handleCopySQL}
          >
            {copied ? 'Copied Summary' : 'Copy Schema Info'}
          </Button>

          <Button size="sm" variant="primary" onClick={onClose}>
            {isHindi ? 'बंद करें' : 'Close'}
          </Button>
        </div>
      </div>
    </div>
  );
};
