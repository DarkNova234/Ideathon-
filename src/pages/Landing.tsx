import React from 'react';
import { Link } from 'wouter';
import { useTranslation } from '../messages';
import { useAppStore } from '../stores/appStore';
import { ShieldCheck, ArrowRight, Clock, HeartHandshake, Syringe, AlertCircle, PhoneCall, CheckCircle } from 'lucide-react';

export const Landing: React.FC = () => {
  const { t } = useTranslation();
  const cases = useAppStore((state) => state.cases);
  const animals = useAppStore((state) => state.animals);
  const rabiesFlags = useAppStore((state) => state.rabiesFlags);

  const activeCases = cases.filter((c) => c.state !== 'closed').length;

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/60 to-white pt-8 pb-12 px-4 sm:px-6 rounded-3xl border border-teal-100/80 shadow-xs">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/70 text-teal-800 text-xs font-semibold border border-teal-200">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            <span>{t.common.assuredEscalation} · Hyderabad Pilot Ward</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight text-balance leading-tight">
            {t.landing.headline}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t.landing.subheadline}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/report"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-base rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              🐾 {t.landing.reportCta}
            </Link>

            <Link
              href="/help/how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-2xl border border-slate-200 shadow-xs transition-colors"
            >
              {t.landing.howItWorksCta} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Safety strip prompt (PRD 8.1) */}
          <div className="pt-3">
            <div className="inline-flex items-center gap-2 text-xs text-amber-800 bg-amber-50 px-3.5 py-1.5 rounded-xl border border-amber-200/70">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{t.landing.safetyPrompt}</span>
              <Link href="/help/safety" className="font-semibold underline hover:text-amber-950">
                Safety Guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pilot Proof Metrics Bar */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 text-center shadow-xs">
          <div className="text-2xl sm:text-3xl font-extrabold text-teal-800 font-mono">18m</div>
          <div className="text-xs text-slate-500 mt-1 font-medium">{t.landing.statsMedianTime}</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 text-center shadow-xs">
          <div className="text-2xl sm:text-3xl font-extrabold text-teal-800 font-mono">142</div>
          <div className="text-xs text-slate-500 mt-1 font-medium">{t.landing.statsTreated}</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 text-center shadow-xs">
          <div className="text-2xl sm:text-3xl font-extrabold text-teal-800 font-mono">89</div>
          <div className="text-xs text-slate-500 mt-1 font-medium">{t.landing.statsVaccinated}</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 text-center shadow-xs">
          <div className="text-2xl sm:text-3xl font-extrabold text-teal-800 font-mono">{activeCases}</div>
          <div className="text-xs text-slate-500 mt-1 font-medium">Active dispatches right now</div>
        </div>
      </section>

      {/* 3 Pillars of StraySafe */}
      <section className="max-w-5xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            How StraySafe Solves Stalled Rescues
          </h2>
          <p className="text-xs text-slate-500">Built for responder reliability, not just another ignored complaint box</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              ⚡
            </div>
            <h3 className="font-bold text-slate-900 text-sm">1. Report in 60 Seconds</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Snap a quick photo and auto-detect your location. No account, no signup forms. Anonymous reporting by default.
            </p>
            <div className="pt-2">
              <Link href="/report" className="text-xs font-semibold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1">
                Start report <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              🔄
            </div>
            <h3 className="font-bold text-slate-900 text-sm">2. Assured Escalation Chain</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dispatched to nearest volunteer first. If unanswered in 10 minutes, automatically escalates to clinic, NGO, and municipal helpline.
            </p>
            <div className="pt-2">
              <Link href="/help/how-it-works" className="text-xs font-semibold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1">
                View escalation rules <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              🏷️
            </div>
            <h3 className="font-bold text-slate-900 text-sm">3. QR Tag History & Vet Flags</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every treated dog gets a QR-tagged digital passport. Verified veterinarians can set static rabies observation markers on the public map.
            </p>
            <div className="pt-2">
              <Link href="/animal/HYD-8492" className="text-xs font-semibold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1">
                Inspect sample QR record <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Demo Shortcuts Banner */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">Student Ideathon Demo</span>
              <span className="text-slate-400 text-xs">· Sample Data Mode</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold">Try the Full Rescue & Rabies Cycle End to End</h3>
            <p className="text-xs text-slate-300 max-w-xl">
              1. Submit a report → 2. Watch escalation & skip wait → 3. Open WhatsApp simulator to accept → 4. Close case & link animal QR tag → 5. Inspect admin dashboard.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <Link
              href="/report"
              className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-xs"
            >
              1. Start Report
            </Link>
            <Link
              href="/dev/whatsapp"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
            >
              2. Open WhatsApp Sim
            </Link>
            <Link
              href="/admin"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-colors"
            >
              3. View Admin
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
