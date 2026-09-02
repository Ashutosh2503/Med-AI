import React, { useState, useRef, useEffect } from 'react';
import { 
  Activity, 
  Upload, 
  Image as ImageIcon, 
  X, 
  Sparkles, 
  AlertTriangle, 
  RotateCcw, 
  CheckCircle2, 
  Info, 
  FileText, 
  ShieldAlert,
  ArrowRight,
  Globe,
  BellRing,
  HelpCircle,
  Clock,
  Camera,
  Volume2,
  VolumeX,
  Printer
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Badge, SeverityBadge } from '../ui/Badge';
import { Notice } from '../ui/Notice';
import { AlertConfirmModal } from '../alerts/AlertConfirmModal';
import { CameraCaptureModal } from './CameraCaptureModal';
import { EmergencySpeedDial } from './EmergencySpeedDial';
import { LanguageCode, GuidanceData, EmergencyContact } from '../../types';
import { aiService, PRESET_DEMO_SCENARIOS } from '../../services/aiService';
import { dbService } from '../../services/dbService';
import { useAuth } from '../../context/AuthContext';

export interface DashboardViewProps {
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onNavigateToContacts: () => void;
  onNavigateToHistory: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  language,
  onLanguageChange,
  onNavigateToContacts,
  onNavigateToHistory,
}) => {
  const { user } = useAuth();
  const userId = user?.id || 'guest_user';
  const isHindi = language === 'hi';

  // Form State
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageName, setSelectedImageName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Audio Guidance TTS State
  const [isSpeaking, setIsSpeaking] = useState(false);

  // AI Guidance & Process State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeGuidance, setActiveGuidance] = useState<GuidanceData | null>(null);

  // Emergency Alerts State
  const [primaryContact, setPrimaryContact] = useState<EmergencyContact | null>(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertSuccessBanner, setAlertSuccessBanner] = useState(false);

  // Load primary contact on mount
  useEffect(() => {
    async function loadPrimaryContact() {
      const contacts = await dbService.getContacts(userId);
      const primary = contacts.find((c) => c.is_primary) || contacts[0] || null;
      setPrimaryContact(primary);
    }
    loadPrimaryContact();
  }, [userId]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // File Upload Handlers
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage(isHindi ? 'कृपया केवल चित्र फ़ाइल (PNG, JPG, WEBP) अपलोड करें।' : 'Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage(isHindi ? 'फ़ाइल का आकार 10MB से कम होना चाहिए।' : 'Image size must be less than 10MB.');
      return;
    }

    setErrorMessage(null);
    setSelectedImageName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setSelectedImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = (base64Image: string, fileName: string) => {
    setSelectedImage(base64Image);
    setSelectedImageName(fileName);
    setErrorMessage(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setSelectedImageName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Full-Stack AI Analysis Call
  const handleAnalyzeClick = async () => {
    if (!inputText.trim() && !selectedImage) {
      setErrorMessage(
        isHindi
          ? 'कृपया विश्लेषण के लिए घटना का विवरण लिखें या चित्र अपलोड करें।'
          : 'Please enter a description of what happened or upload an image to analyze.'
      );
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);
    setAlertSuccessBanner(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    try {
      const guidance = await aiService.analyzeIncident({
        text: inputText,
        image: selectedImage || undefined,
        language,
      });

      setActiveGuidance(guidance);

      // Save to database
      const inputType = selectedImage && inputText ? 'multimodal' : selectedImage ? 'image' : 'text';
      await dbService.saveIncidentWithGuidance(
        {
          user_id: userId,
          input_type: inputType,
          input_text: inputText || undefined,
          image_url: selectedImage || undefined,
          incident_type: guidance.incident_type,
          severity: guidance.severity,
          confidence: guidance.confidence,
          escalation_required: guidance.escalation_required,
        },
        guidance
      );
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to complete safety analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetForm = () => {
    setInputText('');
    handleRemoveImage();
    setErrorMessage(null);
    setActiveGuidance(null);
    setAlertSuccessBanner(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Hands-Free TTS Speech Synthesis
  const toggleSpeechGuidance = () => {
    if (!('speechSynthesis' in window) || !activeGuidance) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = `${activeGuidance.incident_type}. Immediate Actions: ${activeGuidance.immediate_actions.join('. ')}. Avoid doing: ${activeGuidance.avoid_actions.join('. ')}. ${activeGuidance.warning}`;
    
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = isHindi ? 'hi-IN' : 'en-US';
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handlePrintGuidance = () => {
    window.print();
  };

  // Quick Preset Samples for Hackathon Demo
  const applyPreset = (sampleText: string) => {
    setInputText(sampleText);
    setErrorMessage(null);
    setActiveGuidance(null);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {isHindi ? 'घटना जांच कार्यस्थान' : 'Incident Triage Workspace'}
            </h1>
            <Badge variant="success" size="sm">Gemini Multimodal Live</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {isHindi
              ? 'मल्टीमॉडल इनपुट: पाठ, छवि, या दोनों देकर तात्कालिक मार्गदर्शन प्राप्त करें।'
              : 'Multimodal input: Provide text, an image, or both for structured triage.'}
          </p>
        </div>

        {/* Language & Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-xs">
            <Globe className="w-4 h-4 text-slate-400 ml-1.5 mr-1" />
            <button
              id="dashboard-lang-en"
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                language === 'en' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              id="dashboard-lang-hi"
              onClick={() => onLanguageChange('hi')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                language === 'hi' ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>
      </div>

      {alertSuccessBanner && (
        <Notice variant="success" title={isHindi ? 'आपातकालीन अलर्ट भेजा गया' : 'Emergency Alert Dispatched'}>
          {isHindi
            ? `नामित संपर्क (${primaryContact?.name}) को घटना का विवरण और मार्गदर्शन सफलतापूर्वक भेजा गया।`
            : `Designated contact (${primaryContact?.name}) was successfully notified with incident summary.`}
        </Notice>
      )}

      {/* Safety Notice Banner & Speed Dial */}
      <Notice variant="warning">
        <strong>{isHindi ? 'सुरक्षा सूचना: ' : 'Safety Notice: '}</strong>
        {isHindi
          ? 'यदि व्यक्ति बेहोश है, अत्यधिक रक्तस्राव हो रहा है, या सांस लेने में कठिनाई है, तो तुरंत 911 / 112 पर कॉल करें।'
          : 'If the person is unconscious, has severe uncontrolled bleeding, or difficulty breathing, call emergency services (911/112) immediately.'}
      </Notice>

      {/* Emergency Quick-Dial & GPS Access */}
      <EmergencySpeedDial language={language} />

      {/* Main Grid: Input Form (Left) & Live Triage Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Multimodal Input Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="shadow-xs">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Activity className="w-5 h-5 text-emerald-600" />
                  <span>{isHindi ? 'क्या हुआ? (घटना का विवरण)' : 'What Happened? (Incident Input)'}</span>
                </CardTitle>
                <span className="text-xs text-slate-500 font-medium">
                  {isHindi ? 'चरण 1: अवलोकन' : 'Step 1: Observation'}
                </span>
              </div>
              <CardDescription>
                {isHindi
                  ? 'स्पष्ट और संक्षिप्त शब्दों में बताएं कि क्या चोट या असुविधा हुई है।'
                  : 'Describe what occurred, symptoms observed, and how the person feels.'}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Text Input */}
              <div className="space-y-1.5">
                <label htmlFor="incident-text-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  {isHindi ? 'स्थिति का विवरण (Text Description)' : 'Situation Description'}
                </label>
                <textarea
                  id="incident-text-input"
                  rows={4}
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder={
                    isHindi
                      ? 'उदाहरण: लैब में रसायन गिरने से हाथ पर जलन हो रही है, या सीढ़ियों से फिसलकर टखने में मोच आ गई है...'
                      : 'e.g., Burned my finger on a hot beaker in chemistry lab, slight blistering and redness...'
                  }
                  className="w-full rounded-xl border border-slate-300 p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all resize-y"
                />
              </div>

              {/* Sample Quick Preset Pills */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {isHindi ? 'त्वरित नमूने (Quick Test Scenarios):' : 'Quick Test Scenarios:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => applyPreset('Minor chemical splash on forearm during chemistry lab. Skin is red and stinging.')}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                  >
                    🧪 Chemical Splash
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('Twisted ankle playing basketball on campus court, swollen and painful to walk.')}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                  >
                    🏀 Ankle Sprain
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('Minor superficial paper cut / glass scratch on thumb, bleeding lightly.')}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                  >
                    🩹 Minor Cut
                  </button>
                </div>
              </div>

              {/* Image Upload / Live Camera Component */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    {isHindi ? 'छवि जोड़ें (वैकल्पिक / Optional Image)' : 'Visual Evidence (Optional Image)'}
                  </label>
                  {!selectedImage && (
                    <button
                      type="button"
                      onClick={() => setIsCameraModalOpen(true)}
                      className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{isHindi ? 'कैमरा से फोटो लें' : 'Snap Photo (Camera)'}</span>
                    </button>
                  )}
                </div>

                {!selectedImage ? (
                  <div
                    id="image-dropzone"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
                      isDragging
                        ? 'border-emerald-500 bg-emerald-50/50 scale-[0.99]'
                        : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="image-file-input"
                      accept="image/png, image/jpeg, image/webp"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          handleFileSelect(e.target.files[0]);
                        }
                      }}
                    />
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-semibold text-slate-800">
                      {isHindi ? 'छवि अपलोड करने के लिए क्लिक करें या खींचें' : 'Click to upload or drag & drop'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      PNG, JPG, or WEBP up to 10MB
                    </p>
                  </div>
                ) : (
                  <div className="relative rounded-xl border border-slate-200 bg-slate-900 p-2 overflow-hidden group">
                    <div className="relative aspect-video max-h-56 w-full rounded-lg overflow-hidden flex items-center justify-center bg-black/40">
                      <img
                        src={selectedImage}
                        alt="Incident Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="mt-2 px-1 flex items-center justify-between text-xs text-slate-300">
                      <div className="flex items-center gap-1.5 truncate">
                        <ImageIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="truncate">{selectedImageName || 'Uploaded Image'}</span>
                      </div>
                      <button
                        type="button"
                        id="remove-image-btn"
                        onClick={handleRemoveImage}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-rose-900/80 hover:bg-rose-800 text-rose-200 font-medium transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>{isHindi ? 'हटाएं' : 'Remove'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Error Message Display */}
              {errorMessage && (
                <div id="dashboard-error-alert" className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1 font-medium">{errorMessage}</div>
                  <button 
                    onClick={() => setErrorMessage(null)} 
                    className="text-rose-500 hover:text-rose-800 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <Button
                id="reset-inputs-btn"
                type="button"
                variant="ghost"
                size="sm"
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                onClick={handleResetForm}
                disabled={!inputText && !selectedImage && !activeGuidance}
              >
                {isHindi ? 'रीसेट करें' : 'Clear Inputs'}
              </Button>

              <Button
                id="analyze-incident-btn"
                type="button"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={handleAnalyzeClick}
                className="w-full sm:w-auto"
              >
                {isLoading 
                  ? (isHindi ? 'मल्टीमॉडल विश्लेषण हो रहा है...' : 'Synthesizing Guidance...')
                  : (isHindi ? 'मार्गदर्शन प्राप्त करें (Analyze)' : 'Generate Guidance')}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column: Output / Live Guidance Workspace (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {!activeGuidance && !isLoading && (
            /* Empty State */
            <Card id="dashboard-empty-state" className="h-full border-dashed border-2 border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center p-8 text-center min-h-[380px]">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center mb-4 shadow-xs">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-base font-semibold text-slate-800">
                {isHindi ? 'कोई विश्लेषण परिणाम नहीं' : 'Awaiting Incident Input'}
              </h3>
              <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed">
                {isHindi
                  ? 'बाएं पैनल में स्थिति का विवरण दें या फोटो अपलोड करें और "Analyze" बटन दबाएं।'
                  : 'Enter text or upload an image on the left, then click Generate Guidance to see structured first-aid steps.'}
              </p>
              <div className="mt-6 flex flex-col gap-2 w-full max-w-xs text-left text-xs text-slate-600 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{isHindi ? 'चरणबद्ध तत्काल कदम' : 'Numbered immediate steps'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{isHindi ? 'क्या करने से बचें (Avoid)' : 'Clear contraindications (Avoid)'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{isHindi ? 'गंभीरता व एस्केलेशन संकेत' : 'Severity & escalation triggers'}</span>
                </div>
              </div>
            </Card>
          )}

          {isLoading && (
            /* Loading State */
            <Card id="dashboard-loading-state" className="min-h-[380px] flex flex-col items-center justify-center p-8 text-center border-slate-200 bg-white">
              <div className="relative mb-5">
                <div className="w-14 h-14 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />
                <Sparkles className="w-5 h-5 text-emerald-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {isHindi ? 'मल्टीमॉडल जेमिनी विश्लेषण जारी है...' : 'Synthesizing First-Aid Protocol...'}
              </h3>
              <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed">
                {isHindi
                  ? 'प्राथमिक चिकित्सा सीमाओं और सुरक्षा नियमों के अनुसार संरचित निर्देश तैयार किए जा रहे हैं।'
                  : 'Evaluating observable indicators against safety constraints and non-diagnostic boundaries.'}
              </p>
              <div className="mt-6 w-full max-w-xs bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-600 h-full w-2/3 animate-pulse rounded-full" />
              </div>
            </Card>
          )}

          {activeGuidance && !isLoading && (
            /* Live Structured Guidance Output Card */
            <div id="guidance-result-container" className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <Card className="border-emerald-200 shadow-md bg-white">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <SeverityBadge severity={activeGuidance.severity} />
                    <span className="text-xs font-mono text-slate-400">
                      Confidence: {Math.round(activeGuidance.confidence * 100)}%
                    </span>
                  </div>
                  <CardTitle className="mt-3 text-lg text-slate-900">
                    {activeGuidance.incident_type}
                  </CardTitle>
                  <CardDescription>
                    {isHindi
                      ? 'सिस्टम द्वारा समझी गई स्थिति और आवश्यक तात्कालिक उपाय।'
                      : 'Structured containment instructions for minor campus situations.'}
                  </CardDescription>

                  {/* Audio Read-Out and Print Quick Action Toolbar */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      id="listen-guidance-btn"
                      type="button"
                      onClick={toggleSpeechGuidance}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isSpeaking
                          ? 'bg-amber-100 text-amber-800 animate-pulse border border-amber-300'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {isSpeaking ? <VolumeX className="w-4 h-4 text-amber-600" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
                      <span>{isSpeaking ? (isHindi ? 'आवाज़ रोकें (Stop Audio)' : 'Stop Audio Guidance') : (isHindi ? 'निर्देश सुनें (Audio Read-Aloud)' : 'Listen (Voice Guidance)')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handlePrintGuidance}
                      className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      title={isHindi ? 'प्रिंट करें' : 'Print Protocol'}
                    >
                      <Printer className="w-4 h-4" />
                      <span className="hidden sm:inline">{isHindi ? 'प्रिंट करें' : 'Print / PDF'}</span>
                    </button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-4 text-sm">
                  {/* Immediate Actions */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{isHindi ? 'तुरंत करने योग्य कदम (Immediate Actions):' : 'Immediate Actions'}</span>
                    </h4>
                    <ol className="space-y-2 list-decimal list-inside text-slate-700 text-xs sm:text-sm pl-1">
                      {activeGuidance.immediate_actions.map((act, i) => (
                        <li key={i} className="leading-relaxed">{act}</li>
                      ))}
                    </ol>
                  </div>

                  {/* Actions to Avoid */}
                  <div className="bg-rose-50/80 p-3 rounded-xl border border-rose-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 mb-1.5 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>{isHindi ? 'क्या न करें (Do NOT do):' : 'Contraindications (Avoid)'}</span>
                    </h4>
                    <ul className="list-disc list-inside text-xs text-rose-900 space-y-1">
                      {activeGuidance.avoid_actions.map((av, i) => (
                        <li key={i}>{av}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Escalation Conditions */}
                  {activeGuidance.escalation_conditions && (
                    <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-100 text-xs text-amber-900">
                      <strong className="block font-semibold mb-1">
                        {isHindi ? 'कब डॉक्टर या एस्कॉर्ट से संपर्क करें:' : 'When to Escalate:'}
                      </strong>
                      <span>{activeGuidance.escalation_conditions}</span>
                    </div>
                  )}

                  {/* Safety Warning */}
                  <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <strong>Notice: </strong> {activeGuidance.warning}
                  </div>
                </CardContent>

                <CardFooter className="bg-slate-50/80 rounded-b-xl flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-slate-500 text-center sm:text-left">
                    {primaryContact ? (
                      <span>Alert target: <strong>{primaryContact.name}</strong></span>
                    ) : (
                      <span>No emergency contact configured</span>
                    )}
                  </div>

                  <Button
                    id="trigger-contact-alert-btn"
                    size="sm"
                    variant={activeGuidance.escalation_required ? 'danger' : 'secondary'}
                    leftIcon={<BellRing className="w-3.5 h-3.5" />}
                    onClick={() => setIsAlertModalOpen(true)}
                  >
                    {isHindi ? 'आपातकालीन अलर्ट भेजें' : 'Send Emergency Alert'}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Live Camera Snapshot Modal */}
      <CameraCaptureModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={handleCameraCapture}
        language={language}
      />

      {/* Explicit Confirmation Alert Modal */}
      {activeGuidance && (
        <AlertConfirmModal
          isOpen={isAlertModalOpen}
          onClose={() => setIsAlertModalOpen(false)}
          incidentText={inputText}
          guidance={activeGuidance}
          primaryContact={primaryContact}
          language={language}
          onAlertSent={() => {
            setAlertSuccessBanner(true);
          }}
        />
      )}
    </div>
  );
};
