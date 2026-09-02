import React from 'react';
import { ShieldAlert, HeartHandshake, FileText, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-emerald-600 flex items-center justify-center text-white">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <span className="text-white font-bold text-base tracking-tight">Med AI</span>
              <span className="text-xs bg-slate-800 text-emerald-400 px-2 py-0.5 rounded-full font-mono">v1.0.0</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              A lightweight multimodal AI-powered health and safety companion designed for minor campus emergencies and physical safety situations.
            </p>
            <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                Zero unconfirmed alerts
              </span>
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                Strict audit trail
              </span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Campus Protocol</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white transition-colors">See $\rightarrow$ Understand $\rightarrow$ Act</li>
              <li className="hover:text-white transition-colors">Immediate First-Aid Guides</li>
              <li className="hover:text-white transition-colors">Campus Health Escort</li>
              <li className="hover:text-white transition-colors">Designated Contacts</li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Emergency Numbers</h4>
            <ul className="space-y-2 text-xs font-mono text-slate-300">
              <li className="bg-slate-800/80 p-2 rounded-md border border-slate-700">
                <span className="text-rose-400 font-bold block">Police & Fire</span>
                <span>Dial 911 / 112</span>
              </li>
              <li className="bg-slate-800/80 p-2 rounded-md border border-slate-700">
                <span className="text-amber-400 font-bold block">Poison Control</span>
                <span>1-800-222-1222</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Safety Disclaimer Banner */}
        <div className="pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-200">Critical Medical & Safety Disclaimer: </strong>
              Med AI is an assistive decision-support tool and first-aid companion. It is <strong className="text-amber-300">NOT</strong> a doctor, diagnostic system, or replacement for professional medical care or emergency services. In case of life-threatening emergencies, call emergency services (911/112) immediately.
            </div>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
            <p>© 2026 Med AI Companion. Engineered for Campus Safety & First-Aid Preparedness.</p>
            <p>Phase 1 Foundation Verified</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
