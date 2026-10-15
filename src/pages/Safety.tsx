import React from 'react';
import { Link } from 'wouter';
import { useTranslation } from '../messages';
import { ShieldAlert, AlertTriangle, Heart, Eye, ArrowLeft, PhoneCall } from 'lucide-react';

export const Safety: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 pb-20">
      <div className="flex items-center gap-2">
        <Link href="/" className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-teal-700" />
            {t.safety.title}
          </h1>
          <p className="text-xs text-slate-500">
            Field Safety Protocol for Citizens & Responders (PRD FR-33)
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Rule 1 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-xs">1</span>
            {t.safety.rule1Title}
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t.safety.rule1Desc} When dogs are injured, they enter shock and fear. Approach will increase panic and may provoke defensive snaps. Take photo from a comfortable distance.
          </p>
        </div>

        {/* Rule 2 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-xs">2</span>
            {t.safety.rule2Title}
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t.safety.rule2Desc} Do not attempt to drag, cage, or muzzle the dog yourself. Wait for an approved responder equipped with a transport blanket and bite-resistant gloves.
          </p>
        </div>

        {/* Rule 3 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center text-xs">3</span>
            {t.safety.rule3Title}
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t.safety.rule3Desc} Symptoms include jaw paralysis, constant salivation, hydrophobia, sudden ataxia, or unprovoked snapping at air. Retreat immediately to a secure vehicle or building.
          </p>
        </div>

        {/* Rule 4 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-xs">4</span>
            {t.safety.rule4Title}
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t.safety.rule4Desc} The Supreme Court of India and Animal Birth Control (ABC) Rules ensure that dogs are sterilized, vaccinated against rabies, and returned to the exact spot where they were picked up. Relocating dogs is unlawful and destabilizes the neighborhood pack.
          </p>
        </div>
      </div>

      {/* Emergency Fallback Helpline Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-teal-400" />
          <h3 className="font-bold text-sm">Emergency Animal Helplines (Hyderabad)</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 text-xs text-slate-300">
          <div className="bg-slate-800 p-3 rounded-xl">
            <span className="text-teal-400 font-bold block">GHMC Veterinary Wing</span>
            <span>040-23225397 / 1800-425-0033</span>
          </div>
          <div className="bg-slate-800 p-3 rounded-xl">
            <span className="text-teal-400 font-bold block">Blue Cross Hyderabad</span>
            <span>+91 40 2354 4355</span>
          </div>
        </div>
      </div>
    </div>
  );
};
