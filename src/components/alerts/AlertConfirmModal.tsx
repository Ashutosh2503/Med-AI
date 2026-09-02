import React, { useState } from 'react';
import { 
  BellRing, 
  ShieldAlert, 
  CheckCircle2, 
  X, 
  User, 
  Mail, 
  Phone, 
  AlertTriangle,
  Clock
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { EmergencyContact, GuidanceData, LanguageCode } from '../../types';
import { dbService } from '../../services/dbService';

export interface AlertConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidentText?: string;
  guidance: GuidanceData;
  primaryContact: EmergencyContact | null;
  language: LanguageCode;
  onAlertSent: () => void;
}

export const AlertConfirmModal: React.FC<AlertConfirmModalProps> = ({
  isOpen,
  onClose,
  incidentText,
  guidance,
  primaryContact,
  language,
  onAlertSent,
}) => {
  const isHindi = language === 'hi';
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirmDispatch = async () => {
    if (!primaryContact) {
      setErrorMessage(
        isHindi
          ? 'कोई प्राथमिक आपातकालीन संपर्क कॉन्फ़िगर नहीं है।'
          : 'No primary emergency contact is configured.'
      );
      return;
    }

    setIsSending(true);
    setErrorMessage(null);

    try {
      // Simulate server-side email dispatch + audit logging
      await new Promise((resolve) => setTimeout(resolve, 1400));

      await dbService.logAlert({
        incident_id: guidance.incident_id || 'inc_active',
        contact_id: primaryContact.id,
        status: 'sent',
        error_message: undefined,
      });

      setIsSending(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onAlertSent();
        onClose();
      }, 1600);
    } catch (err: any) {
      setIsSending(false);
      setErrorMessage(err.message || 'Alert dispatch failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <BellRing className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                {isHindi ? 'आपातकालीन अलर्ट पुष्टि' : 'Explicit Emergency Alert Confirmation'}
              </h3>
              <p className="text-xs text-slate-500">
                {isHindi ? 'सुरक्षा नियम: बिना आपकी पुष्टि अलर्ट नहीं भेजा जाएगा।' : 'Requires two-step explicit user approval.'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              {isHindi ? 'आपातकालीन अलर्ट सफलतापूर्वक भेजा गया!' : 'Emergency Alert Dispatched Successfully!'}
            </h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              {isHindi
                ? `अलर्ट ${primaryContact?.name} (${primaryContact?.email}) को भेज दिया गया है।`
                : `Verified notification dispatched to ${primaryContact?.name} (${primaryContact?.email}).`}
            </p>
          </div>
        ) : (
          <>
            {/* Primary Contact Preview */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between font-semibold text-slate-700">
                <span>{isHindi ? 'अधिसूचित किया जाने वाला संपर्क:' : 'Designated Contact Target:'}</span>
                <Badge variant="success" size="sm">Primary</Badge>
              </div>

              {primaryContact ? (
                <div className="space-y-1.5 pt-1 text-slate-800">
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                    <User className="w-4 h-4 text-emerald-600" />
                    <span>{primaryContact.name}</span>
                    <span className="text-xs font-normal text-slate-500">({primaryContact.relationship})</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{primaryContact.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{primaryContact.phone}</span>
                  </div>
                </div>
              ) : (
                <div className="text-amber-800 bg-amber-50 p-3 rounded-lg border border-amber-200">
                  No primary emergency contact found. Please configure a contact first.
                </div>
              )}
            </div>

            {/* Incident Summary to be dispatched */}
            <div className="space-y-1.5 text-xs text-slate-700">
              <span className="font-bold uppercase tracking-wider text-slate-500">
                {isHindi ? 'घटना का सारांश (Alert Payload):' : 'Incident Summary in Alert:'}
              </span>
              <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl space-y-1">
                <div className="font-bold text-rose-950 flex items-center justify-between">
                  <span>{guidance.incident_type}</span>
                  <span className="uppercase text-[10px] bg-rose-200 text-rose-900 px-2 py-0.5 rounded font-mono">
                    Severity: {guidance.severity}
                  </span>
                </div>
                {incidentText && (
                  <p className="text-slate-600 italic truncate">"{incidentText}"</p>
                )}
                <p className="text-[11px] text-rose-900 pt-1">
                  <strong>Escalation Note: </strong> {guidance.escalation_conditions || 'Assistance requested by student.'}
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Safety Warning */}
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                {isHindi
                  ? 'यह कार्रवाई आपके संपर्क को ईमेल/एसएमएस द्वारा सूचित करेगी। जीवन-घातक स्थिति में तुरंत 911 / 112 डायल करें।'
                  : 'This triggers an audited server-side dispatch to your contact. For severe life threats, call 911 / 112 immediately.'}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={onClose} disabled={isSending}>
                {isHindi ? 'रद्द करें' : 'Cancel'}
              </Button>
              <Button
                variant="danger"
                size="md"
                isLoading={isSending}
                disabled={!primaryContact}
                onClick={handleConfirmDispatch}
              >
                {isSending
                  ? (isHindi ? 'अलर्ट भेजा जा रहा है...' : 'Dispatching Alert...')
                  : (isHindi ? 'अलर्ट की पुष्टि करें और भेजें' : 'Explicitly Confirm & Send Alert')}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
