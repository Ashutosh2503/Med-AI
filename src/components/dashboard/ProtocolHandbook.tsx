import React, { useState } from 'react';
import { 
  Heart, 
  Activity, 
  Flame, 
  Eye, 
  Thermometer, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  Sparkles,
  BookOpen,
  X,
  Volume2,
  VolumeX,
  Clock,
  PhoneCall
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { LanguageCode } from '../../types';

export interface ProtocolGuide {
  id: string;
  titleEn: string;
  titleHi: string;
  category: 'trauma' | 'chemical' | 'environmental' | 'cardiac' | 'allergic';
  severity: 'low' | 'medium' | 'high';
  timeframe: string;
  stepsEn: string[];
  stepsHi: string[];
  avoidEn: string[];
  avoidHi: string[];
  callTriggerEn: string;
  callTriggerHi: string;
}

const FIRST_AID_PROTOCOLS: ProtocolGuide[] = [
  {
    id: 'cpr-hands-only',
    titleEn: 'Hands-Only Adult CPR',
    titleHi: 'वयस्क हैंड्स-ओनली सीपीआर (Hands-Only CPR)',
    category: 'cardiac',
    severity: 'high',
    timeframe: 'Immediate (< 1 min)',
    stepsEn: [
      'Check for responsiveness and breathing (tap shoulders and shout).',
      'Shout for help and have someone call 911 / Campus Escort immediately.',
      'Place heel of one hand in center of chest, other hand on top with interlocked fingers.',
      'Push hard and fast (100–120 beats per minute, 2 inches deep) to the beat of "Stayin\' Alive".',
      'Do not stop compressions until AED arrives, paramedic takes over, or person starts breathing.'
    ],
    stepsHi: [
      'प्रतिक्रिया और सांस की जांच करें (कंधे थपथपाएं और आवाज़ दें)।',
      'मदद के लिए चिल्लाएं और तुरंत किसी से 911 / 112 या सुरक्षा टीम को कॉल करवाएं।',
      'छाती के बीच में एक हाथ की हथेली रखें, दूसरा हाथ उसके ऊपर उंगलियां फंसाकर रखें।',
      'तेज और गहरा दबाव दें (100-120 दबाव प्रति मिनट, 2 इंच गहरा)।',
      'जब तक एम्बुलेंस न आए या व्यक्ति सांस न लेने लगे, कम्प्रेशन जारी रखें।'
    ],
    avoidEn: [
      'Do NOT delay compressions to perform mouth-to-mouth if untrained.',
      'Do NOT lean on chest between compressions; allow full recoil.',
      'Do NOT leave the victim unattended.'
    ],
    avoidHi: [
      'यदि अप्रशिक्षित हैं तो मुंह से सांस देने में देरी न करें, केवल छाती दबाएं।',
      'दबाव के बीच छाती पर वजन न डालें; छाती को पूरा ऊपर आने दें।',
      'मरीज को अकेला छोड़कर न जाएं।'
    ],
    callTriggerEn: 'Unresponsive, unconscious, or gasping/not breathing normally.',
    callTriggerHi: 'बेहोश, कोई प्रतिक्रिया नहीं, या असामान्य रूप से सांस लेना।'
  },
  {
    id: 'chemical-eye-burn',
    titleEn: 'Lab Chemical Eye Splash',
    titleHi: 'प्रयोगशाला रासायनिक आंख का छिड़काव',
    category: 'chemical',
    severity: 'high',
    timeframe: 'Immediate 15-20 mins',
    stepsEn: [
      'Immediately guide victim to the nearest eyewash station or clean sink.',
      'Hold eyelids wide open using clean thumb and index finger.',
      'Flush eyes continuously with lukewarm, gentle stream of water for at least 15–20 minutes.',
      'Roll eyes in all directions during flush to remove trapped chemicals.',
      'Remove contact lenses during flushing only if they come out easily without force.'
    ],
    stepsHi: [
      'तुरंत व्यक्ति को निकटतम आईवॉश स्टेशन या साफ पानी के नल पर ले जाएं।',
      'साफ उंगलियों से पलकों को पूरी तरह खुला रखें।',
      'कम से कम 15-20 मिनट तक लगातार हल्के पानी के बहाव से आंखें धोएं।',
      'धोने के दौरान आंखों की पुतलियों को चारों तरफ घुमाएं।',
      'कॉन्टैक्ट लेंस केवल तभी निकालें जब वे आसानी से बाहर आ जाएं।'
    ],
    avoidEn: [
      'Do NOT rub or touch eyes with bare hands or cloths.',
      'Do NOT apply neutralizing chemicals, vinegar, or milk.',
      'Do NOT bandage eyes tightly shut.'
    ],
    avoidHi: [
      'आंखों को हाथों या कपड़े से बिल्कुल न रगड़ें।',
      'कोई अन्य रसायन, दूध या सिरका न डालें।',
      'आंखों पर कसकर पट्टी न बांधें।'
    ],
    callTriggerEn: 'Any strong acid, base, unknown chemical splash, or visual impairment.',
    callTriggerHi: 'कोई भी तेजाब, क्षार, अज्ञात रसायन या दृष्टि में धुंधलापन।'
  },
  {
    id: 'burn-scald',
    titleEn: 'Thermal Burn / Hot Liquid Scald',
    titleHi: 'थर्मल बर्न / गर्म तरल से जलना',
    category: 'trauma',
    severity: 'medium',
    timeframe: 'First 10-15 mins',
    stepsEn: [
      'Remove source of heat and move to safe location.',
      'Cool burn immediately under gentle, cool (not freezing) running tap water for 10-15 minutes.',
      'Gently remove rings, tight clothing, or watches near area before swelling occurs.',
      'Cover loosely with clean, non-stick sterile gauze or clean plastic wrap.'
    ],
    stepsHi: [
      'गर्मी के स्रोत से तुरंत दूर हटें।',
      'जले हुए स्थान को 10-15 मिनट तक ठंडे (बर्फ नहीं) बहते नल के पानी में रखें।',
      'सूजन आने से पहले अंगूठी या तंग कपड़े धीरे से उतार लें।',
      'साफ, गैर-चिपचिपी स्टेराइल पट्टी या साफ कपड़े से ढीला ढकें।'
    ],
    avoidEn: [
      'Do NOT apply ice, iced water, butter, oil, or toothpaste.',
      'Do NOT pop or puncture intact blisters.',
      'Do NOT pull away clothing stuck to charred skin.'
    ],
    avoidHi: [
      'बर्फ, मक्खन, तेल, या टूथपेस्ट बिल्कुल न लगाएं।',
      'जले हुए फफोलों को न फोड़ें।',
      'जली हुई त्वचा से चिपके कपड़ों को जबरदस्ती न खींचें।'
    ],
    callTriggerEn: 'Burn is larger than palm size, on face, hands, groin, or charring/white.',
    callTriggerHi: 'जलन हथेली से बड़ी हो, चेहरे/हाथों पर हो, या त्वचा सफेद/काली पड़ गई हो।'
  },
  {
    id: 'anaphylaxis-allergy',
    titleEn: 'Severe Allergic Reaction (Anaphylaxis)',
    titleHi: 'गंभीर एलर्जी प्रतिक्रिया (एनाफिलेक्सिस)',
    category: 'allergic',
    severity: 'high',
    timeframe: 'Immediate (< 2 mins)',
    stepsEn: [
      'Ask if victim carries an epinephrine auto-injector (EpiPen).',
      'Help them administer auto-injector into the outer middle thigh; hold firmly for 3–5 seconds.',
      'Call 911 / Emergency immediately and state "anaphylaxis / allergic shock".',
      'Have person sit upright if breathing is difficult, or lie flat with legs elevated if dizzy.'
    ],
    stepsHi: [
      'पूछें कि क्या व्यक्ति के पास एपिनेफ्रीन ऑटो-इंजेक्टर (EpiPen) है।',
      'जांघ के बाहरी हिस्से में ऑटो-इंजेक्टर लगाने में मदद करें और 3-5 सेकंड तक दबाए रखें।',
      'तुरंत आपातकालीन नंबर 911 / 112 पर कॉल करें और "एनाफिलेक्सिस" बताएं।',
      'सांस लेने में तकलीफ हो तो सीधा बैठाएं, चक्कर आए तो पैर उठाकर लिटाएं।'
    ],
    avoidEn: [
      'Do NOT give oral food, liquids, or pills if victim is wheezing or swallowing is impaired.',
      'Do NOT make them stand up abruptly.',
      'Do NOT delay injection if hives appear alongside breathing difficulty.'
    ],
    avoidHi: [
      'सांस फूलने पर कुछ भी खाने या पीने को न दें।',
      'व्यक्ति को अचानक खड़ा न करें।',
      'सांस लेने में रुकावट होने पर इंजेक्शन में देरी न करें।'
    ],
    callTriggerEn: 'Swelling of lips/tongue, wheezing, throat tightness, or hives with dizziness.',
    callTriggerHi: 'होंठ/जीभ में सूजन, सांस में सीटी की आवाज़, गले में जकड़न या चक्कर।'
  },
  {
    id: 'heat-exhaustion',
    titleEn: 'Campus Heat Exhaustion & Stroke',
    titleHi: 'हीट एग्जॉशन और लू (Heat Stroke)',
    category: 'environmental',
    severity: 'medium',
    timeframe: 'Immediate cooling',
    stepsEn: [
      'Move individual to shaded, air-conditioned indoor area immediately.',
      'Loosen tight clothing and remove heavy outer layers/backpacks.',
      'Apply cool, wet cloths or ice packs to neck, armpits, and groin.',
      'Offer small sips of cool water or electrolyte drink ONLY if alert and not nauseous.'
    ],
    stepsHi: [
      'व्यक्ति को तुरंत छायादार या वातानुकूलित (AC) कमरे में ले जाएं।',
      'तंग कपड़े और भारी बैग उतारें।',
      'गर्दन, बगल और कमर के पास ठंडा गीला कपड़ा लगाएं।',
      'यदि व्यक्ति पूरी तरह सचेत है तो घूंट-घूंट करके ठंडा पानी या ओआरएस (ORS) दें।'
    ],
    avoidEn: [
      'Do NOT force fluids if person is drowsy, confused, or vomiting.',
      'Do NOT give energy drinks, alcohol, or caffeine.',
      'Do NOT leave them in direct sunlight.'
    ],
    avoidHi: [
      'यदि व्यक्ति बेहोश या भ्रमित हो तो जबरदस्ती पानी न पिलाएं।',
      'एनर्जी ड्रिंक या कैफीन न दें।',
      'उन्हें धूप में अकेला न छोड़ें।'
    ],
    callTriggerEn: 'Body temp > 103°F (39.4°C), confusion, slurred speech, or loss of consciousness.',
    callTriggerHi: 'तेज बुखार, भ्रम की स्थिति, लड़खड़ाती आवाज़ या बेहोशी (हीट स्ट्रोक)।'
  }
];

export interface ProtocolHandbookProps {
  language: LanguageCode;
  isOpen: boolean;
  onClose: () => void;
  onSelectProtocolToWorkspace?: (protocol: ProtocolGuide) => void;
}

export const ProtocolHandbook: React.FC<ProtocolHandbookProps> = ({
  language,
  isOpen,
  onClose,
  onSelectProtocolToWorkspace,
}) => {
  const isHindi = language === 'hi';
  const [selectedId, setSelectedId] = useState<string>(FIRST_AID_PROTOCOLS[0].id);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isSpeaking, setIsSpeaking] = useState(false);

  if (!isOpen) return null;

  const currentProtocol = FIRST_AID_PROTOCOLS.find((p) => p.id === selectedId) || FIRST_AID_PROTOCOLS[0];

  const filtered = activeCategory === 'all'
    ? FIRST_AID_PROTOCOLS
    : FIRST_AID_PROTOCOLS.filter((p) => p.category === activeCategory);

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const title = isHindi ? currentProtocol.titleHi : currentProtocol.titleEn;
    const steps = (isHindi ? currentProtocol.stepsHi : currentProtocol.stepsEn).join('. ');
    const avoid = (isHindi ? currentProtocol.avoidHi : currentProtocol.avoidEn).join('. ');
    const text = `${title}. Immediate Steps: ${steps}. What to avoid: ${avoid}. Call emergency when: ${isHindi ? currentProtocol.callTriggerHi : currentProtocol.callTriggerEn}`;

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = isHindi ? 'hi-IN' : 'en-US';
    utter.rate = 0.95;
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utter);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-slate-50 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {isHindi ? 'कैंपस प्राथमिक चिकित्सा संदर्भ हैंडबुक' : 'Campus First-Aid Quick Reference Handbook'}
              </h2>
              <p className="text-xs text-slate-400">
                {isHindi ? 'मानकीकृत आपातकालीन दिशानिर्देश और प्राथमिक सावधानियां' : 'Evidence-based standard containment procedures for campus incidents'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: 'all', label: isHindi ? 'सभी प्रोटोकॉल' : 'All Protocols' },
            { id: 'cardiac', label: isHindi ? 'कार्डियक / सीपीआर' : 'Cardiac / CPR' },
            { id: 'chemical', label: isHindi ? 'लैब / रासायनिक' : 'Lab / Chemical' },
            { id: 'trauma', label: isHindi ? 'चोट / जलन' : 'Trauma & Burns' },
            { id: 'allergic', label: isHindi ? 'एलर्जी' : 'Allergic' },
            { id: 'environmental', label: isHindi ? 'पर्यावरणीय / हीट' : 'Heat & Environment' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body: Sidebar + Main Protocol */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          {/* Sidebar Protocol List (4 cols) */}
          <div className="md:col-span-4 p-3 space-y-2 overflow-y-auto bg-slate-100/60 max-h-48 md:max-h-none">
            {filtered.map((item) => {
              const active = item.id === selectedId;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedId(item.id);
                    if (isSpeaking) {
                      window.speechSynthesis.cancel();
                      setIsSpeaking(false);
                    }
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    active
                      ? 'bg-white border-emerald-500 shadow-xs'
                      : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant={item.severity === 'high' ? 'danger' : 'warning'} size="sm">
                      {item.severity.toUpperCase()}
                    </Badge>
                    <span className="text-[10px] text-slate-500 font-mono flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" /> {item.timeframe}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">
                    {isHindi ? item.titleHi : item.titleEn}
                  </h4>
                </div>
              );
            })}
          </div>

          {/* Main Protocol Details (8 cols) */}
          <div className="md:col-span-8 p-4 sm:p-6 overflow-y-auto space-y-5 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {isHindi ? currentProtocol.titleHi : currentProtocol.titleEn}
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <span>Category: {currentProtocol.category.toUpperCase()}</span>
                  <span>•</span>
                  <span className="font-mono text-emerald-700 font-semibold">{currentProtocol.timeframe}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-amber-600" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-600" />}
                  onClick={toggleSpeech}
                  className={isSpeaking ? 'bg-amber-50 border-amber-300' : ''}
                >
                  {isSpeaking ? (isHindi ? 'रोकें' : 'Stop') : (isHindi ? 'निर्देश सुनें' : 'Read Aloud')}
                </Button>
              </div>
            </div>

            {/* Steps: Immediate Actions */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{isHindi ? 'तात्कालिक प्राथमिक कदम (Immediate Actions):' : 'Immediate First-Aid Protocol:'}</span>
              </h4>
              <ol className="space-y-2">
                {(isHindi ? currentProtocol.stepsHi : currentProtocol.stepsEn).map((step, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2.5 bg-emerald-50/40 p-2.5 rounded-lg border border-emerald-100">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Contraindications: Avoid */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>{isHindi ? 'क्या न करें (Contraindications / Avoid):' : 'Critical Contraindications (What NOT to do):'}</span>
              </h4>
              <ul className="space-y-1.5">
                {(isHindi ? currentProtocol.avoidHi : currentProtocol.avoidEn).map((item, idx) => (
                  <li key={idx} className="text-xs text-rose-900 bg-rose-50/50 p-2 rounded-lg border border-rose-100 flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Escalation Trigger */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">{isHindi ? 'कॉल कब करें (When to Call 911/Security): ' : 'Emergency Escalation Criteria: '}</strong>
                <span>{isHindi ? currentProtocol.callTriggerHi : currentProtocol.callTriggerEn}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-3 sm:p-4 flex items-center justify-between border-t border-slate-200">
          <p className="text-[11px] text-slate-500">
            {isHindi ? 'संदर्भ मार्गदर्शिका केवल प्राथमिक मार्गदर्शन के लिए है।' : 'Reference guides align with Red Cross & OSHA laboratory first-aid standards.'}
          </p>
          <Button size="sm" variant="primary" onClick={onClose}>
            {isHindi ? 'समझ गया (Close)' : 'Done / Return'}
          </Button>
        </div>
      </div>
    </div>
  );
};
