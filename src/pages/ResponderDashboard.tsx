import React from 'react';
import { Link, useLocation } from 'wouter';
import { useTranslation } from '../messages';
import { useAppStore } from '../stores/appStore';
import { updateResponderAvailability } from '../services/responderService';
import { FileText, CheckCircle2, Clock, MapPin, Power, MessageSquare, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export const ResponderDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();

  const cases = useAppStore((state) => state.cases);
  const responders = useAppStore((state) => state.responders);
  const currentResponderId = useAppStore((state) => state.currentResponderId);
  const setCurrentResponderId = useAppStore((state) => state.setCurrentResponderId);

  const activeResponder = responders.find((r) => r.id === currentResponderId) || responders[0];

  // Guard rule (PRD 9.4): Unapproved responders who open /responder see the Pending approval screen
  if (activeResponder && activeResponder.status !== 'approved') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg">
          ⏳
        </div>
        <h2 className="text-xl font-bold text-slate-900">Pending Coordinator Approval</h2>
        <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
          Responder status: <strong className="uppercase">{activeResponder.status}</strong>. Responders cannot receive emergency dispatches until approved by an NGO coordinator.
        </p>
        <div className="pt-2 flex flex-col gap-2">
          <Link
            href="/admin/responders"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-teal-700 text-white rounded-xl text-xs font-semibold hover:bg-teal-800"
          >
            Approve Responder in Admin (/admin/responders)
          </Link>
          <Link
            href="/responder/join/invite_1"
            className="text-xs text-slate-500 hover:underline"
          >
            Review Onboarding & Attestation
          </Link>
        </div>
      </div>
    );
  }

  // Filter cases assigned to or offered to this responder
  const myCases = cases.filter(
    (c) =>
      c.assignedResponderId === activeResponder.id ||
      (c.state === 'routing' && !c.declinedResponderIds.includes(activeResponder.id))
  );

  const handleToggleAvailability = async () => {
    await updateResponderAvailability(activeResponder.id, !activeResponder.available);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 space-y-6 pb-24">
      {/* Responder Header Profile Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                {activeResponder.name}
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                {activeResponder.role}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Ward: {activeResponder.ward} · Coverage radius {activeResponder.radiusKm} km
            </p>
          </div>

          {/* Quick switcher between test volunteers */}
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block mb-0.5">Switch Persona:</span>
            <select
              value={activeResponder.id}
              onChange={(e) => setCurrentResponderId(e.target.value)}
              className="text-xs p-1 rounded-lg border border-slate-200 bg-slate-50 font-medium"
            >
              {responders.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* FR-19: Availability Toggle & WhatsApp Simulator Test Link */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
          <button
            onClick={handleToggleAvailability}
            className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${
              activeResponder.available
                ? 'border-emerald-300 bg-emerald-50/80 text-emerald-950'
                : 'border-slate-200 bg-slate-50 text-slate-600'
            }`}
          >
            <div className="flex items-center gap-2">
              <Power className={`w-4 h-4 ${activeResponder.available ? 'text-emerald-600' : 'text-slate-400'}`} />
              <div className="text-left">
                <span className="font-bold block">
                  {activeResponder.available ? t.responder.available : t.responder.unavailable}
                </span>
                <span className="text-[10px] opacity-80">Toggle dispatch status</span>
              </div>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                activeResponder.available ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {activeResponder.available ? 'ONLINE' : 'OFFLINE'}
            </span>
          </button>

          {/* PRD 8.2 Step 8: Test message simulator */}
          <Link
            href="/dev/whatsapp"
            className="p-3 rounded-xl border border-teal-200 bg-teal-50 hover:bg-teal-100/80 text-teal-950 flex items-center justify-between text-xs transition-colors"
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-700" />
              <div className="text-left">
                <span className="font-bold block">WhatsApp Simulator</span>
                <span className="text-[10px] text-teal-800">Test dispatch message (FR-16)</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-teal-700" />
          </Link>
        </div>
      </div>

      {/* Active Responder Cases List */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center justify-between">
          <span>{t.responder.myActiveCases} ({myCases.length})</span>
          <span className="text-xs font-normal text-slate-500">Live Dispatches</span>
        </h2>

        {myCases.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-2 text-xs text-slate-500 shadow-xs">
            <CheckCircle2 className="w-8 h-8 mx-auto text-slate-300" />
            <p>No active emergency cases currently assigned to your radius.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myCases.map((c) => {
              const isAccepted = c.state === 'accepted';
              const isRouting = c.state === 'routing';
              const isClosed = c.state === 'closed';

              return (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <img
                        src={c.photoUrl}
                        alt="Incident"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 capitalize truncate">
                          {c.urgency.replace('_', ' ')} Street Dog
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          #{c.id.substring(0, 8)}
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 truncate mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                        <span>{c.exactAddress || c.approxArea}</span>
                      </div>

                      <div className="text-[11px] text-slate-500 mt-1">
                        State: <strong className="text-slate-800 capitalize">{c.state.replace('_', ' ')}</strong>
                        {c.etaMinutes && ` · ETA: ${c.etaMinutes} mins`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 text-xs">
                    <Link
                      href={`/r/${c.secretToken}`}
                      className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-semibold shadow-xs transition-colors"
                    >
                      Open Case View (/r/[token])
                    </Link>

                    {isAccepted && (
                      <Link
                        href={`/r/${c.secretToken}/close`}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold shadow-xs transition-colors"
                      >
                        Close & Log Outcome
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
