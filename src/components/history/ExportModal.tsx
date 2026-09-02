import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileJson, X, Check, Shield } from 'lucide-react';
import { Button } from '../ui/Button';
import { IncidentReport, GuidanceData, LanguageCode } from '../../types';

export interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidents: Array<IncidentReport & { guidance?: GuidanceData }>;
  language: LanguageCode;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  incidents,
  language,
}) => {
  const isHindi = language === 'hi';
  const [downloadedFormat, setDownloadedFormat] = useState<'csv' | 'json' | null>(null);

  if (!isOpen) return null;

  const handleExportCSV = () => {
    if (incidents.length === 0) return;

    const headers = [
      'Incident ID',
      'Timestamp',
      'Incident Type',
      'Severity',
      'Input Type',
      'Reported Description',
      'Confidence',
      'Immediate Actions',
      'Avoid Actions',
      'Escalation Conditions'
    ];

    const escapeCSV = (str?: string) => {
      if (!str) return '""';
      return `"${str.replace(/"/g, '""')}"`;
    };

    const rows = incidents.map((item) => [
      item.id,
      item.created_at,
      escapeCSV(item.incident_type),
      item.severity,
      item.input_type,
      escapeCSV(item.input_text),
      item.confidence ? `${Math.round(item.confidence * 100)}%` : 'N/A',
      escapeCSV(item.guidance?.immediate_actions?.join('; ') || ''),
      escapeCSV(item.guidance?.avoid_actions?.join('; ') || ''),
      escapeCSV(item.guidance?.escalation_conditions || '')
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `med-ai-triage-audit-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadedFormat('csv');
    setTimeout(() => setDownloadedFormat(null), 3000);
  };

  const handleExportJSON = () => {
    if (incidents.length === 0) return;

    const dataToExport = {
      exportDate: new Date().toISOString(),
      appName: 'Med AI Campus Safety Companion',
      totalRecords: incidents.length,
      records: incidents.map((item) => ({
        id: item.id,
        created_at: item.created_at,
        incident_type: item.incident_type,
        severity: item.severity,
        input_type: item.input_type,
        input_text: item.input_text,
        confidence: item.confidence,
        guidance: item.guidance ? {
          immediate_actions: item.guidance.immediate_actions,
          avoid_actions: item.guidance.avoid_actions,
          escalation_conditions: item.guidance.escalation_conditions,
          warning: item.guidance.warning,
        } : null,
      })),
    };

    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `med-ai-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadedFormat('json');
    setTimeout(() => setDownloadedFormat(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base">
              {isHindi ? 'घटना डेटा निर्यात करें' : 'Export Triage Records'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            {isHindi
              ? 'कैंपस हेल्थ सेंटर रिकॉर्ड या सुरक्षा ऑडिट के लिए अपने सभी प्राथमिक उपचार डेटा डाउनलोड करें।'
              : 'Export your recorded triage evaluations and guidance protocols for EH&S compliance, dorm reports, or campus health center records.'}
          </p>

          <div className="space-y-3 pt-2">
            {/* CSV Option */}
            <div
              onClick={handleExportCSV}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                    CSV Spreadsheet (.csv)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {isHindi ? 'एक्सेल और स्प्रेडशीट के अनुकूल' : 'Formatted for Excel, Sheets, and EH&S incident logs'}
                  </p>
                </div>
              </div>
              {downloadedFormat === 'csv' ? (
                <Check className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <Download className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 shrink-0" />
              )}
            </div>

            {/* JSON Option */}
            <div
              onClick={handleExportJSON}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <FileJson className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-800">
                    Full JSON Backup (.json)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {isHindi ? 'सभी मेटाडेटा सहित पूर्ण डेटा बैकअप' : 'Raw structured JSON with schema timestamps & arrays'}
                  </p>
                </div>
              </div>
              {downloadedFormat === 'json' ? (
                <Check className="w-5 h-5 text-blue-600 shrink-0" />
              ) : (
                <Download className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0" />
              )}
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {isHindi
                ? `${incidents.length} रिकॉर्ड निर्यात के लिए तैयार हैं।`
                : `${incidents.length} incident records are ready for export.`}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            {isHindi ? 'बंद करें' : 'Close'}
          </Button>
        </div>
      </div>
    </div>
  );
};
