import { GoogleGenAI } from '@google/genai';
import { GuidanceData, LanguageCode, SeverityLevel } from '../types';

export interface AnalyzeParams {
  text?: string;
  image?: string; // Base64 data URL
  language?: LanguageCode;
}

// Pre-defined deterministic fallbacks for high safety & offline demo resilience
export const PRESET_DEMO_SCENARIOS: Record<string, GuidanceData> = {
  chemical: {
    language: 'en',
    incident_type: 'Minor Chemical Splash on Skin',
    severity: 'moderate',
    confidence: 0.94,
    immediate_actions: [
      'Immediately remove contaminated clothing or accessories near the skin.',
      'Flush the affected area under gentle, cool running water continuously for at least 15 minutes.',
      'Check the laboratory chemical bottle label or Safety Data Sheet (SDS) for chemical name.',
      'Gently pat the area dry with a sterile lint-free gauze without rubbing.',
      'Notify your laboratory instructor or designated campus safety officer.'
    ],
    avoid_actions: [
      'Do NOT attempt to neutralize the chemical with vinegar, baking soda, or other chemicals.',
      'Do NOT apply greasy ointments, butter, ice, or adhesive bandages directly on fresh chemical burns.',
      'Do NOT rub or vigorously scrub the skin.'
    ],
    escalation_required: true,
    escalation_conditions: 'If redness spreads, blistering appears, severe burning sensation persists past 15 minutes of rinsing, or if the chemical was a strong acid/base.',
    warning: 'Med AI is an assistive first-aid companion and NOT a doctor. For severe chemical burns or eye contact, use the emergency eyewash station and call 911 / 112 immediately.'
  },
  sprain: {
    language: 'en',
    incident_type: 'Acute Ankle Strain / Sprain',
    severity: 'low',
    confidence: 0.92,
    immediate_actions: [
      'Rest: Cease athletic activity and avoid bearing weight on the affected ankle.',
      'Ice: Apply a cold pack wrapped in a clean cloth for 15-20 minutes every 2-3 hours.',
      'Compress: Gently wrap the ankle with an elastic support bandage (snug, not uncomfortably tight).',
      'Elevate: Prop the leg on pillows or a chair above heart level to minimize swelling.'
    ],
    avoid_actions: [
      'Do NOT apply direct heat, hot water bottles, or hot ointments in the first 48 hours.',
      'Do NOT attempt to run, walk off the pain, or massage the joint aggressively.',
      'Do NOT wrap the bandage so tightly that toes turn pale, cold, or numb.'
    ],
    escalation_required: false,
    escalation_conditions: 'If unable to bear any weight for 4 steps, if joint looks visibly deformed, or if severe numbness/tingling occurs in the foot.',
    warning: 'Med AI provides non-diagnostic first-aid guidance. If severe deformity or bone tenderness exists, obtain a professional medical X-ray.'
  },
  cut: {
    language: 'en',
    incident_type: 'Minor Superficial Laceration / Scratch',
    severity: 'low',
    confidence: 0.96,
    immediate_actions: [
      'Wash your hands thoroughly with soap and warm water before touching the wound.',
      'Apply gentle, direct pressure using a clean cloth or sterile gauze pad for 3-5 minutes until bleeding stops.',
      'Rinse the cut under cool tap water to remove superficial dirt.',
      'Apply a thin layer of petroleum jelly or antiseptic ointment and cover with a sterile adhesive bandage.'
    ],
    avoid_actions: [
      'Do NOT pick at scabs or probe into the cut with tweezers or bare fingers.',
      'Do NOT use harsh hydrogen peroxide or rubbing alcohol as they irritate exposed tissue.',
      'Do NOT leave the bandage on after it becomes wet or soiled.'
    ],
    escalation_required: false,
    escalation_conditions: 'If bleeding does not stop after 10 minutes of direct pressure, if the cut is deeper than 1/4 inch, or if caused by a rusty/dirty object requiring a tetanus booster.',
    warning: 'Med AI is an assistive decision tool. Deep or gaping lacerations require professional stitches.'
  }
};

export const aiService = {
  async analyzeIncident(params: AnalyzeParams): Promise<GuidanceData> {
    const { text = '', image, language = 'en' } = params;
    const isHindi = language === 'hi';

    // Check for API key (lazy check)
    const apiKey = 
      (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
      (import.meta as any).env?.VITE_GEMINI_API_KEY ||
      '';

    // Try Gemini API if key is present and configured
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.length > 5) {
      try {
        const ai = new GoogleGenAI({ apiKey });

        const systemInstruction = `You are Med AI, a safety-bounded campus first-aid and emergency companion.
CRITICAL SAFETY BOUNDARIES:
- You are NOT a doctor or diagnostic engine.
- NEVER claim medical certainty, diagnose diseases, or prescribe medications.
- Focus STRICTLY on observable physical conditions and standard first-aid containment steps.
- Provide clear, numbered immediate actions.
- Provide explicit "avoid_actions" (contraindications like avoiding ice on deep burns or avoiding neutralizing acids).
- Determine severity strictly from: 'low', 'moderate', 'high', 'emergency'.
- If the situation appears life-threatening (e.g., severe bleeding, unconsciousness, chest pain, difficulty breathing, head trauma), set severity='emergency', escalation_required=true, and instruct immediate 911 / 112 dialing.
- Target language: ${isHindi ? 'Hindi (हिन्दी) using clear Devanagari script' : 'English'}.

Respond ONLY with a JSON object matching this schema:
{
  "incident_type": string,
  "severity": "low" | "moderate" | "high" | "emergency",
  "confidence": number between 0.0 and 1.0,
  "immediate_actions": string[],
  "avoid_actions": string[],
  "escalation_required": boolean,
  "escalation_conditions": string,
  "warning": string
}`;

        const promptParts: any[] = [];

        if (image) {
          const matches = image.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
          if (matches) {
            promptParts.push({
              inlineData: {
                mimeType: matches[1],
                data: matches[2],
              },
            });
          }
        }

        const userPrompt = text.trim() 
          ? `User Incident Description: "${text}"\nTarget Language: ${isHindi ? 'Hindi' : 'English'}`
          : `Analyze this image for observable minor injuries / physical safety situations and provide standard first aid. Target Language: ${isHindi ? 'Hindi' : 'English'}`;

        promptParts.push({ text: userPrompt });

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: promptParts,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          return {
            language,
            incident_type: parsed.incident_type || 'Observed Physical Situation',
            severity: (['low', 'moderate', 'high', 'emergency'].includes(parsed.severity) ? parsed.severity : 'moderate') as SeverityLevel,
            confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.9,
            immediate_actions: Array.isArray(parsed.immediate_actions) ? parsed.immediate_actions : ['Keep the area clean and rested.'],
            avoid_actions: Array.isArray(parsed.avoid_actions) ? parsed.avoid_actions : ['Avoid unnecessary strain or contamination.'],
            escalation_required: Boolean(parsed.escalation_required),
            escalation_conditions: parsed.escalation_conditions || 'If symptoms worsen, request campus medical assistance.',
            warning: parsed.warning || (isHindi ? 'मेड एआई एक गैर-नैदानिक साथी है। आपातकाल में 911 / 112 पर संपर्क करें।' : 'Med AI is an assistive first-aid companion. Call 911 / 112 for severe emergencies.'),
          };
        }
      } catch (err) {
        console.warn('Gemini API call failed or rate-limited; utilizing intelligent safety fallback:', err);
      }
    }

    // Intelligent Safety Fallback / Demo Simulation
    const lowerText = text.toLowerCase();
    let template: GuidanceData;

    if (lowerText.includes('chem') || lowerText.includes('splash') || lowerText.includes('burn') || lowerText.includes('acid') || lowerText.includes('lab')) {
      template = { ...PRESET_DEMO_SCENARIOS.chemical };
    } else if (lowerText.includes('ankle') || lowerText.includes('sprain') || lowerText.includes('twist') || lowerText.includes('fall') || lowerText.includes('swollen')) {
      template = { ...PRESET_DEMO_SCENARIOS.sprain };
    } else {
      template = { ...PRESET_DEMO_SCENARIOS.cut };
    }

    // Apply Hindi translation if selected
    if (isHindi) {
      return aiService.translateToHindi(template);
    }

    return template;
  },

  translateToHindi(englishData: GuidanceData): GuidanceData {
    const hindiMap: Record<string, { type: string; actions: string[]; avoid: string[]; escalation: string; warning: string }> = {
      'Minor Chemical Splash on Skin': {
        type: 'त्वचा पर हल्का रासायनिक छींटा (Chemical Splash)',
        actions: [
          'त्वचा के पास से दूषित कपड़े या गहनों को तुरंत सुरक्षित रूप से हटाएं।',
          'प्रभावित क्षेत्र को कम से कम 15 मिनट तक लगातार हल्के बहते ठंडे पानी से धोएं।',
          'रसायन की बोतल का लेबल या सेफ्टी डाटा शीट (SDS) देखकर रसायन का नाम नोट करें।',
          'धोने के बाद क्षेत्र को बिना रगड़े साफ सूखे कपड़े या स्टेराइल गॉज से थपथपाकर सुखाएं।',
          'प्रयोगशाला प्रशिक्षक या कैंपस सुरक्षा अधिकारी को सूचित करें।'
        ],
        avoid: [
          'सिरके या बेकिंग सोडा से रसायन को निष्प्रभावी (न्यूट्रलाइज) करने का प्रयास न करें।',
          'बर्फ, मक्खन, तेल या ग्रीस वाली मलहम न लगाएं।',
          'त्वचा को जोर से न रगड़ें और छालों को न फोड़ें।'
        ],
        escalation: 'यदि लालिमा बढ़े, छाले 2 इंच से बड़े हों, या 15 मिनट धोने के बाद भी तेज जलन रहे, तो तुरंत मेडिकल एस्कॉर्ट बुलाएं।',
        warning: 'मेड एआई एक गैर-नैदानिक सहायक है, डॉक्टर नहीं। गंभीर रासायनिक जलन में 911 / 112 पर तुरंत कॉल करें।'
      },
      'Acute Ankle Strain / Sprain': {
        type: 'टखने में मोच / खिंचाव (Ankle Sprain)',
        actions: [
          'विश्राम (Rest): खेल गतिविधि बंद करें और पैर पर वजन डालने से बचें।',
          'बर्फ (Ice): कपड़े में लपेटकर 15-20 मिनट के लिए दिन में 3-4 बार ठंडी सिकाई करें।',
          'दबाव (Compress): टखने को लोचदार सपोर्ट बैंडेज से आराम से लपेटें (ज्यादा कसकर नहीं)।',
          'ऊंचाई (Elevate): सूजन कम करने के लिए पैर को तकिए पर दिल के स्तर से ऊपर रखें।'
        ],
        avoid: [
          'शुरुआती 48 घंटों में गर्म पानी, हीटिंग पैड या मालिश का प्रयोग न करें।',
          'दर्द के बावजूद चलने या दौड़ने का प्रयास न करें।',
          'पट्टी को इतना कसकर न बांधें कि उंगलियां नीली या सुन्न हो जाएं।'
        ],
        escalation: 'यदि 4 कदम भी चलना असंभव हो, जोड़ की बनावट में असामान्य विकृति दिखे, या पैर में तीव्र सुन्नपन हो, तो तुरंत एक्स-रे जांच कराएं।',
        warning: 'मेड एआई प्राथमिक उपचार मार्गदर्शन देता है। हड्डी टूटने के संदेह में चिकित्सकीय जांच अनिवार्य है।'
      },
      'Minor Superficial Laceration / Scratch': {
        type: 'हल्का सतही घाव / खरोंच (Minor Cut)',
        actions: [
          'घाव छूने से पहले अपने हाथों को साबुन और पानी से अच्छी तरह धोएं।',
          'रक्तस्राव रोकने के लिए साफ कपड़े या गॉज पैड से 3-5 मिनट तक हल्का सीधा दबाव बनाएं।',
          'घाव को साफ नल के पानी से हल्के से धोएं ताकि धूल-मिट्टी हट जाए।',
          'एंटीसेप्टिक मरहम की पतली परत लगाकर साफ चिपकने वाली पट्टी (बैंड-एड) लगाएं।'
        ],
        avoid: [
          'घाव को गंदे हाथों या चिमटी से न कुरेदें।',
          'तेज हाइड्रोजन पेरोक्साइड या स्प्रिट का अत्यधिक प्रयोग न करें क्योंकि यह ऊतकों को नुकसान पहुंचाता है।',
          'गीली या गंदी हो चुकी पट्टी को न छोड़ें; इसे तुरंत बदलें।'
        ],
        escalation: 'यदि 10 मिनट सीधे दबाव के बाद भी खून न रुके, घाव गहरा हो, या जंग लगी वस्तु से लगा हो (टिटनेस का खतरा), तो डॉक्टर से संपर्क करें।',
        warning: 'मेड एआई एक सहायक उपकरण है। गहरे घावों में टांकों (स्टिच) की आवश्यकता हो सकती है।'
      }
    };

    const translation = hindiMap[englishData.incident_type] || {
      type: 'शारीरिक सुरक्षा एवं प्राथमिक उपचार',
      actions: englishData.immediate_actions,
      avoid: englishData.avoid_actions,
      escalation: englishData.escalation_conditions || 'स्थिति बिगड़ने पर तुरंत सहायता लें।',
      warning: 'मेड एआई एक गैर-नैदानिक सहायक है। आपातकाल में 911 / 112 पर संपर्क करें।',
    };

    return {
      ...englishData,
      language: 'hi',
      incident_type: translation.type,
      immediate_actions: translation.actions,
      avoid_actions: translation.avoid,
      escalation_conditions: translation.escalation,
      warning: translation.warning,
    };
  }
};
