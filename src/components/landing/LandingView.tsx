import React from 'react';
import { 
  Shield, 
  Sparkles, 
  AlertTriangle, 
  Eye, 
  BrainCircuit, 
  CheckCircle2, 
  BellRing, 
  ArrowRight, 
  Clock, 
  HeartHandshake, 
  ShieldAlert, 
  Lock,
  Compass,
  FileQuestion,
  Users
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { LanguageCode } from '../../types';

export interface LandingViewProps {
  onGetStarted: () => void;
  onExploreContacts: () => void;
  language: LanguageCode;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onGetStarted,
  onExploreContacts,
  language,
}) => {
  const isHindi = language === 'hi';

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-4 pb-12 sm:pb-16 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-wider shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>{isHindi ? 'कैंपस स्वास्थ्य एवं सुरक्षा साथी' : 'Campus Health & Safety First-Aid Companion'}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
          {isHindi ? (
            <>आपात स्थिति में <span className="text-emerald-600">स्पष्ट, त्वरित व सुरक्षित</span> प्राथमिक चिकित्सा मार्गदर्शन।</>
          ) : (
            <>Clear, immediate first-aid guidance when <span className="text-emerald-600">seconds matter most</span>.</>
          )}
        </h1>

        <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {isHindi
            ? 'पाठ, तस्वीर या दोनों प्रदान करें। मेड एआई स्थिति को समझता है, संरचित कदम सुझाता है, और आवश्यकतानुसार आपातकालीन संपर्क को सूचित करता है।'
            : 'Provide text, an image, or both. Med AI triages minor physical safety situations, offers numbered immediate actions, and facilitates explicit emergency escalation.'}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button
            id="landing-start-triage-cta"
            size="lg"
            variant="primary"
            className="w-full sm:w-auto text-base px-6 py-3"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={onGetStarted}
          >
            {isHindi ? 'घटना जांच शुरू करें (Start Triage)' : 'Start Incident Triage'}
          </Button>
          <Button
            id="landing-manage-contacts-cta"
            size="lg"
            variant="outline"
            className="w-full sm:w-auto text-base px-6 py-3"
            onClick={onExploreContacts}
          >
            {isHindi ? 'आपातकालीन संपर्क प्रबंधन' : 'Manage Emergency Contacts'}
          </Button>
        </div>

        {/* Quick Trust Badges */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>{isHindi ? 'गोपनीय और सुरक्षित' : 'Privacy-First Architecture'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>{isHindi ? 'सटीक और त्वरित मार्गदर्शन' : 'Instant Structured Guidance'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>{isHindi ? 'सत्यापित अलर्ट पुष्टि' : 'Explicit Alert Confirmation'}</span>
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-8">
          <Badge variant="warning">{isHindi ? 'समस्या का समाधान' : 'The Problem'}</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {isHindi ? 'कैंपस में अचानक घटी घटनाओं में घबराहट और अनिश्चितता' : 'The Panic and Confusion of Campus Emergencies'}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {isHindi
              ? 'जब कोई छात्र गिरता है, कट जाता है, या शारीरिक रूप से असहज महसूस करता है, तो इंटरनेट पर गलत जानकारी या घबराहट सही कदम उठाने में बाधा बनती है।'
              : 'When a minor accident, burn, cut, or acute discomfort occurs on campus, generic web searches overwhelm users with scary diagnoses while failing to provide bounded, numbered first-aid steps.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80">
            <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center mb-3">
              <FileQuestion className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base mb-1.5">
              {isHindi ? 'इंटरनेट पर भ्रामक जानकारी' : 'Unbounded Online Noise'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {isHindi
                ? 'सामान्य सर्च इंजन अक्सर साधारण घाव को भी गंभीर बीमारी बताकर अनावश्यक डर पैदा करते हैं।'
                : 'Generic chatbots speculate and diagnose. Med AI refuses diagnosis, focusing strictly on immediate first-aid containment.'}
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base mb-1.5">
              {isHindi ? 'गलत प्राथमिक उपचार के खतरे' : 'Dangerous Contradictions'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {isHindi
                ? 'लोग अक्सर जलने पर बर्फ या घाव पर अनुचित चीजें लगा देते हैं। हम स्पष्ट "क्या न करें" सूची देते हैं।'
                : 'Knowing what NOT to do (like applying ice directly to severe burns) is just as critical as immediate actions.'}
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80">
            <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center mb-3">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base mb-1.5">
              {isHindi ? 'भाषा और तनाव में संवाद' : 'Language & Escalation Barrier'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {isHindi
                ? 'तनाव के समय अपनी मातृभाषा (हिन्दी/अंग्रेजी) में स्पष्ट निर्देश और तुरंत परिजन को अलर्ट भेजना जीवन रक्षक है।'
                : 'Seamless bilingual support (English & Hindi) combined with 1-click explicit emergency contact dispatching.'}
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section: SEE -> UNDERSTAND -> ACT -> ALERT */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <Badge variant="info">{isHindi ? 'कार्यप्रणाली' : 'How It Works'}</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {isHindi ? '4-चरणीय सुरक्षा चक्र (SEE → UNDERSTAND → ACT → ALERT)' : 'The 4-Stage Safety Protocol'}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            {isHindi
              ? 'एक नियंत्रित और सुरक्षित प्रवाह जो कृत्रिम बुद्धिमत्ता को व्यावहारिक मार्गदर्शन में बदलता है।'
              : 'A deterministic, safety-bounded workflow wrapping multimodal AI intelligence.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="relative hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                  <Eye className="w-5 h-5" />
                </div>
                <span className="text-2xl font-black text-slate-200">01</span>
              </div>
              <CardTitle className="text-lg text-slate-900">1. SEE</CardTitle>
              <CardDescription>
                {isHindi
                  ? 'घटना का विवरण लिखें, घाव/स्थिति की तस्वीर अपलोड करें, या दोनों साथ जोड़ें।'
                  : 'Describe the incident in natural text, capture/upload an image of the minor injury, or provide both.'}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="relative hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <span className="text-2xl font-black text-slate-200">02</span>
              </div>
              <CardTitle className="text-lg text-slate-900">2. UNDERSTAND</CardTitle>
              <CardDescription>
                {isHindi
                  ? 'जेमिनी मल्टीमॉडल मॉडल स्थिति का गैर-नैदानिक विश्लेषण कर गंभीरता (कम/मध्यम/उच्च) तय करता है।'
                  : 'Server-side Gemini multimodal model performs structured safety triage and determines urgency rating.'}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="relative hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="text-2xl font-black text-slate-200">03</span>
              </div>
              <CardTitle className="text-lg text-slate-900">3. ACT</CardTitle>
              <CardDescription>
                {isHindi
                  ? 'तुरंत करने योग्य चरणबद्ध कदम, सावधानियां ("क्या न करें") और पेशेवर मदद कब लें की जानकारी।'
                  : 'Structured, numbered first-aid procedures, contraindications to avoid, and escalation triggers in English or Hindi.'}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="relative hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  <BellRing className="w-5 h-5" />
                </div>
                <span className="text-2xl font-black text-slate-200">04</span>
              </div>
              <CardTitle className="text-lg text-slate-900">4. ALERT</CardTitle>
              <CardDescription>
                {isHindi
                  ? 'यदि आवश्यकता हो, तो उपयोगकर्ता की स्पष्ट पुष्टि के बाद ही आपातकालीन संपर्क को अलर्ट भेजा जाता है।'
                  : 'Never automatic. If escalation is required, users explicitly review and trigger verified alerts to saved contacts.'}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Safety Disclaimer Banner */}
      <section className="bg-amber-50/80 border-2 border-amber-200 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900">
              {isHindi ? 'महत्वपूर्ण सुरक्षा एवं गैर-नैदानिक अस्वीकरण' : 'Critical Medical & Safety Boundaries'}
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {isHindi
                ? 'मेड एआई कोई डॉक्टर या चिकित्सा निदान प्रणाली नहीं है। यह केवल प्राथमिक चिकित्सा और तात्कालिक सुरक्षा के लिए एक सहायक उपकरण है। यदि स्थिति गंभीर, जीवन-घातक या अनिश्चित लगे, तो तुरंत 911 / 112 या निकटतम चिकित्सा केंद्र से संपर्क करें।'
                : 'Med AI is NOT a doctor, diagnostic engine, or substitute for emergency healthcare professionals. It strictly assists with minor, observable physical containment and first-aid steps. Severe bleeding, head trauma, chest pain, or breathing distress must be referred immediately to emergency services (911 / 112).'}
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-slate-900 text-white rounded-2xl p-8 sm:p-12 text-center space-y-6">
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          {isHindi ? 'कैंपस में सुरक्षित रहने के लिए तैयार हैं?' : 'Prepared for campus safety at any moment.'}
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
          {isHindi
            ? 'बिना किसी देरी के त्वरित सहायता प्राप्त करें। कोई अनावश्यक प्रक्रिया नहीं।'
            : 'Access zero-friction first-aid support with high-contrast, distraction-free triage.'}
        </p>
        <div className="pt-2">
          <Button
            id="bottom-start-btn"
            size="lg"
            variant="primary"
            className="text-base px-8 py-3.5"
            onClick={onGetStarted}
          >
            {isHindi ? 'जांच डैशबोर्ड खोलें' : 'Open Incident Workspace'}
          </Button>
        </div>
      </section>
    </div>
  );
};
