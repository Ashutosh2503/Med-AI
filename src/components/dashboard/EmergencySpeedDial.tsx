import React, { useState } from 'react';
import { PhoneCall, ShieldAlert, AlertCircle, Copy, Check, MapPin } from 'lucide-react';
import { LanguageCode } from '../../types';

export interface EmergencySpeedDialProps {
  language: LanguageCode;
}

export const EmergencySpeedDial: React.FC<EmergencySpeedDialProps> = ({ language }) => {
  const isHindi = language === 'hi';
  const [copiedLocation, setCopiedLocation] = useState(false);

  const emergencyNumbers = [
    {
      label: isHindi ? 'राष्ट्रीय आपातकाल (911 / 112)' : 'National Emergency (911 / 112)',
      tel: '911',
      desc: isHindi ? 'गंभीर जीवन-रक्षक एम्बुलेंस व पुलिस' : 'Critical Life-Threatening Triage',
      color: 'bg-rose-50 border-rose-200 text-rose-800 hover:bg-rose-100',
    },
    {
      label: isHindi ? 'कैंपस सुरक्षा व एस्कॉर्ट' : 'Campus Safety Escort',
      tel: '5550192834',
      displayTel: '(555) 019-2834',
      desc: isHindi ? '24/7 ऑन-कैंपस फर्स्ट रिस्पॉन्डर' : '24/7 On-Campus Escort & Response',
      color: 'bg-emerald-50 border-emerald-200 text-emerald-900 hover:bg-emerald-100',
    },
    {
      label: isHindi ? 'विषाक्तता नियंत्रण केंद्र (Poison Control)' : 'Poison Control Center',
      tel: '18002221222',
      displayTel: '1-800-222-1222',
      desc: isHindi ? 'लैब रसायन व अंतर्ग्रहण परामर्श' : 'Chemical & Ingestion Expert Helpline',
      color: 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100',
    },
  ];

  const handleCopyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const locStr = `Campus Incident Location: Lat ${pos.coords.latitude.toFixed(5)}, Long ${pos.coords.longitude.toFixed(5)} (Accuracy: ${Math.round(pos.coords.accuracy)}m)`;
          navigator.clipboard.writeText(locStr);
          setCopiedLocation(true);
          setTimeout(() => setCopiedLocation(false), 2500);
        },
        () => {
          navigator.clipboard.writeText('Campus Incident Location: University Main Campus Science Wing, 2nd Floor');
          setCopiedLocation(true);
          setTimeout(() => setCopiedLocation(false), 2500);
        }
      );
    } else {
      navigator.clipboard.writeText('Campus Incident Location: University Main Campus Science Wing, 2nd Floor');
      setCopiedLocation(true);
      setTimeout(() => setCopiedLocation(false), 2500);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-rose-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
            {isHindi ? 'त्वरित आपातकालीन संपर्क (Speed Dial):' : 'Immediate Emergency Speed Dial:'}
          </span>
        </div>

        <button
          onClick={handleCopyLocation}
          className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors cursor-pointer self-start sm:self-auto"
        >
          {copiedLocation ? (
            <Check className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
          )}
          <span>{copiedLocation ? (isHindi ? 'स्थान कॉपी हुआ!' : 'Location Copied!') : (isHindi ? 'कैंपस लोकेशन कॉपी करें' : 'Copy GPS / Campus Room')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {emergencyNumbers.map((num, i) => (
          <a
            key={i}
            href={`tel:${num.tel}`}
            className={`p-2.5 rounded-xl border text-xs transition-all flex flex-col justify-between cursor-pointer ${num.color}`}
          >
            <div>
              <div className="font-bold flex items-center justify-between">
                <span>{num.label}</span>
                <span className="font-mono text-[11px] underline ml-1">{num.displayTel || num.tel}</span>
              </div>
              <p className="text-[10px] opacity-80 mt-0.5">{num.desc}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
