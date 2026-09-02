import React, { useState, useEffect } from 'react';
import { 
  History, 
  Calendar, 
  Clock, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  ChevronRight,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { SeverityBadge, Badge } from '../ui/Badge';
import { IncidentReport, GuidanceData, LanguageCode } from '../../types';
import { dbService } from '../../services/dbService';
import { useAuth } from '../../context/AuthContext';

export interface HistoryViewProps {
  language: LanguageCode;
  onBack: () => void;
  onSelectIncident?: (incident: IncidentReport, guidance?: GuidanceData) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  language,
  onBack,
  onSelectIncident,
}) => {
  const { user } = useAuth();
  const userId = user?.id || 'guest_user';
  const isHindi = language === 'hi';

  const [incidents, setIncidents] = useState<Array<IncidentReport & { guidance?: GuidanceData }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<(IncidentReport & { guidance?: GuidanceData }) | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await dbService.getIncidents(userId);
        setIncidents(data);
      } catch (err) {
        console.error('Failed to load incidents:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [userId]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
              onClick={onBack}
            >
              {isHindi ? 'वापस' : 'Back'}
            </Button>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {isHindi ? 'घटना एवं मार्गदर्शन इतिहास' : 'Incident & Guidance History'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            {isHindi
              ? 'आपके खाते द्वारा पहले जांचे गए सभी मामले और सुरक्षा सलाह की समीक्षा करें।'
              : 'Audit trail of past incident triages and generated guidance protocols.'}
          </p>
        </div>
      </div>

      {/* RLS Privacy Note */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between text-xs text-emerald-900">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            {isHindi
              ? 'पूर्ण व्यक्तिगत गोपनीयता: इतिहास केवल आपके लॉगिन खाते के लिए सुरक्षित है।'
              : 'End-to-end user isolation: Incidents are scoped exclusively to your authenticated user ID.'}
          </span>
        </div>
        <Badge variant="success" size="sm">Private Record</Badge>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-slate-500 space-y-2">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-medium">Loading triage history...</p>
        </div>
      ) : incidents.length === 0 ? (
        <Card className="border-dashed border-2 text-center p-8 bg-slate-50">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <History className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-slate-800">
            {isHindi ? 'कोई पिछला रिकॉर्ड नहीं मिला' : 'No Incident Records Found'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {isHindi
              ? 'जब आप कार्यस्थान में कोई घटना दर्ज करेंगे, उसका रिकॉर्ड यहाँ दिखाई देगा।'
              : 'When you perform an incident triage in the workspace, the full audit record and advice will appear here.'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            {incidents.map((inc) => {
              const isSelected = selectedItem?.id === inc.id;
              const dateStr = new Date(inc.created_at).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedItem(inc)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <SeverityBadge severity={inc.severity} />
                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {dateStr}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm mt-2 line-clamp-1">
                    {inc.incident_type}
                  </h4>

                  {inc.input_text && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 italic">
                      "{inc.input_text}"
                    </p>
                  )}

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="uppercase tracking-wider font-semibold font-mono">
                      Input: {inc.input_type}
                    </span>
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                      View Advice <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Details (7 cols) */}
          <div className="lg:col-span-7">
            {selectedItem ? (
              <Card className="border-emerald-200 shadow-sm sticky top-6">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <SeverityBadge severity={selectedItem.severity} />
                    <span className="text-xs text-slate-400 font-mono">
                      {new Date(selectedItem.created_at).toLocaleString()}
                    </span>
                  </div>
                  <CardTitle className="text-lg mt-2">{selectedItem.incident_type}</CardTitle>
                  <CardDescription>
                    {selectedItem.input_text ? `Reported: "${selectedItem.input_text}"` : 'Image-based observation'}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 pt-4 text-xs sm:text-sm">
                  {selectedItem.image_url && (
                    <div className="rounded-lg overflow-hidden border border-slate-200 max-h-48 bg-black/5 flex items-center justify-center">
                      <img src={selectedItem.image_url} alt="Incident" className="h-full object-contain" />
                    </div>
                  )}

                  {selectedItem.guidance ? (
                    <>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Immediate First-Aid Protocol:</span>
                        </h4>
                        <ol className="list-decimal list-inside space-y-1.5 text-slate-700">
                          {selectedItem.guidance.immediate_actions.map((act, i) => (
                            <li key={i} className="leading-relaxed">{act}</li>
                          ))}
                        </ol>
                      </div>

                      <div className="bg-rose-50 p-3 rounded-xl border border-rose-100">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 mb-1 flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                          <span>Contraindications (Avoid):</span>
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-xs text-rose-900">
                          {selectedItem.guidance.avoid_actions.map((av, i) => (
                            <li key={i}>{av}</li>
                          ))}
                        </ul>
                      </div>

                      {selectedItem.guidance.escalation_conditions && (
                        <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 text-xs text-amber-900">
                          <strong>Escalation Triggers: </strong>
                          {selectedItem.guidance.escalation_conditions}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-slate-400 italic">No specific guidance cached for this incident record.</p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="h-full min-h-[300px] rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <FileText className="w-8 h-8 mb-2" />
                <p className="text-xs font-medium text-slate-600">Select an incident from the list</p>
                <p className="text-[11px] text-slate-400 mt-1">Review full immediate actions and avoid protocol.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
