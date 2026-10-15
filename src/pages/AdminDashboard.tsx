import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { useTranslation } from '../messages';
import { useAppStore } from '../stores/appStore';
import { getMetrics, DashboardMetrics } from '../services/metricsService';
import {
  LayoutDashboard,
  Clock,
  HeartHandshake,
  Syringe,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Settings,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const cases = useAppStore((state) => state.cases);
  const responders = useAppStore((state) => state.responders);
  const settings = useAppStore((state) => state.settings);

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

  useEffect(() => {
    getMetrics().then(setMetrics);
  }, [cases]);

  // Setup checklist (PRD 8.4)
  const checklist = [
    { title: 'Set municipal fallback contact', done: Boolean(settings.fallbackContact.phone), link: '/admin/settings' },
    { title: 'Configure 10-minute accept window', done: Boolean(settings.acceptWindowMinutes), link: '/admin/settings' },
    { title: 'Verify first partner clinic (HappyPaws)', done: true, link: '/partner' },
    { title: 'Approve & attest volunteers', done: responders.some((r) => r.status === 'approved'), link: '/admin/responders' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 space-y-6 pb-24">
      {/* Top Banner with Sample Data Badge (PRD FR-28) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold mb-1">
            <Sparkles className="w-3 h-3 text-amber-700" />
            <span>{t.admin.sampleDataNotice}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-teal-700" />
            StraySafe Pilot Administrator Hub
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/responders"
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Manage Responders</span>
          </Link>

          <Link
            href="/admin/settings"
            className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Settings</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid (PRD FR-28) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] text-slate-400 font-medium block">Total Reports</span>
          <div className="text-2xl font-bold font-mono text-slate-900">
            {metrics?.totalReports || cases.length}
          </div>
          <span className="text-[10px] text-teal-700 font-semibold block">{metrics?.activeReports || 0} active in loop</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] text-slate-400 font-medium block">{t.admin.medianAccept}</span>
          <div className="text-2xl font-bold font-mono text-teal-700">
            {metrics?.medianAcceptMinutes || 18}m
          </div>
          <span className="text-[10px] text-slate-500 block">Target: &lt;20 min</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] text-slate-400 font-medium block">{t.admin.medianClose}</span>
          <div className="text-2xl font-bold font-mono text-slate-800">
            {metrics?.medianCloseMinutes || 48}m
          </div>
          <span className="text-[10px] text-slate-500 block">Target: &lt;60 min (Pilot)</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] text-slate-400 font-medium block">{t.admin.animalsTreated}</span>
          <div className="text-2xl font-bold font-mono text-teal-800">
            {metrics?.animalsTreated || 142}
          </div>
          <span className="text-[10px] text-slate-500 block">By Clinic & Volunteers</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1 col-span-2 lg:col-span-1">
          <span className="text-[11px] text-slate-400 font-medium block">{t.admin.animalsVaccinated}</span>
          <div className="text-2xl font-bold font-mono text-emerald-700">
            {metrics?.animalsVaccinated || 89}
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold block">Protected & Ear Notched</span>
        </div>
      </div>

      {/* Escalation Funnel Breakdown (PRD FR-28) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            {t.admin.escalationStats}
          </h2>
          <p className="text-xs text-slate-500">
            Tracking where cases resolve in the assured escalation chain
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl border border-teal-200 bg-teal-50/60 space-y-1">
            <span className="text-xs font-bold text-teal-950 block">{t.admin.step1Volunteers}</span>
            <div className="text-xl font-bold font-mono text-teal-800">
              {metrics?.escalationCounts.step1Volunteers || 0}
            </div>
            <span className="text-[10px] text-teal-700">Resolved at nearest volunteer</span>
          </div>

          <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/60 space-y-1">
            <span className="text-xs font-bold text-amber-950 block">{t.admin.step2Clinic}</span>
            <div className="text-xl font-bold font-mono text-amber-800">
              {metrics?.escalationCounts.step2ClinicOrNext || 0}
            </div>
            <span className="text-[10px] text-amber-700">Escalated 1+ steps to next volunteer or clinic</span>
          </div>

          <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/60 space-y-1">
            <span className="text-xs font-bold text-rose-950 block">{t.admin.step3Fallback}</span>
            <div className="text-xl font-bold font-mono text-rose-800">
              {metrics?.escalationCounts.step3Fallback || 0}
            </div>
            <span className="text-[10px] text-rose-700">Reached GHMC Municipal Helpline</span>
          </div>
        </div>
      </div>

      {/* Admin Setup Checklist (PRD 8.4) */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs space-y-3">
        <h2 className="text-sm font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-400" />
          <span>Pilot Ward Readiness Checklist (Gachibowli / Osmania)</span>
        </h2>
        <div className="grid sm:grid-cols-2 gap-2 text-xs">
          {checklist.map((item, idx) => (
            <Link
              key={idx}
              href={item.link}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-200">{item.title}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Cases Escalation Table (PRD FR-30 & 9.3) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Recent Incident Cases & Routing States</h2>
            <p className="text-xs text-slate-500">Tap any case to inspect the audit log (FR-30)</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                <th className="py-2 px-3">Case ID</th>
                <th className="py-2 px-3">Urgency</th>
                <th className="py-2 px-3">Location</th>
                <th className="py-2 px-3">State</th>
                <th className="py-2 px-3">Offer Step</th>
                <th className="py-2 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cases.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                    #{c.id.substring(0, 10)}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="capitalize font-semibold text-slate-800">
                      {c.urgency.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 truncate max-w-[180px]">
                    {c.approxArea}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        c.state === 'closed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : c.state === 'accepted'
                          ? 'bg-teal-100 text-teal-800'
                          : c.state === 'escalated_fallback'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {c.state.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 font-mono">
                    Step {c.currentOfferIndex + 1}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <Link
                      href={`/admin/cases/${c.id}`}
                      className="text-teal-700 hover:text-teal-900 font-semibold"
                    >
                      Detail & Log →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
