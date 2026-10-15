import React from 'react';
import { Link } from 'wouter';
import { useTranslation } from '../../messages';
import { useAppStore } from '../../stores/appStore';
import { ShieldAlert, AlertTriangle, Eye, ArrowRight } from 'lucide-react';

export const FirstRunSafetyModal: React.FC = () => {
  const { t } = useTranslation();
  const firstRunSafetyAccepted = useAppStore((state) => state.firstRunSafetyAccepted);
  const setFirstRunSafetyAccepted = useAppStore((state) => state.setFirstRunSafetyAccepted);

  if (firstRunSafetyAccepted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Stay Safe First</h2>
            <p className="text-xs text-slate-500">Important community protocol</p>
          </div>
        </div>

        <div className="bg-amber-50/70 rounded-xl p-4 border border-amber-200/60 text-slate-800 space-y-2">
          <p className="font-semibold text-sm text-amber-900 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
            Stay a safe distance. Do not touch the animal.
          </p>
          <p className="text-xs leading-relaxed text-slate-700">
            An injured or distressed dog can react defensively. Stay at least 10 feet back when taking a photo. Never corner, grab, or attempt to lift an animal without trained protective equipment.
          </p>
        </div>

        <div className="space-y-2 text-xs text-slate-600">
          <div className="flex items-start gap-2">
            <span className="font-bold text-teal-700">•</span>
            <span>Reports automatically dispatch to the nearest verified volunteer or clinic.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-teal-700">•</span>
            <span>If no one is immediately free, assured escalation triggers up to the Municipal Helpline.</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => setFirstRunSafetyAccepted(true)}
            className="w-full sm:flex-1 py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-medium text-sm rounded-xl transition-colors shadow-xs"
          >
            {t.landing.firstRunGotIt}
          </button>
          <Link
            href="/help/safety"
            onClick={() => setFirstRunSafetyAccepted(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center py-2.5 px-3 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Read Full Safety Guide <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};
