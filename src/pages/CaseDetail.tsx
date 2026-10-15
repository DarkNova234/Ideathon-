import React, { useEffect, useState } from 'react';
import { useRoute, Link, useLocation } from 'wouter';
import { useTranslation } from '../messages';
import { useAppStore } from '../stores/appStore';
import { getCase, getCaseEvents } from '../services/caseService';
import { Case, CaseEvent } from '../types';
import { EscalationTimeline } from '../components/case/EscalationTimeline';
import {
  ShieldCheck,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Sparkles,
  PhoneCall,
  Lock,
  Tag
} from 'lucide-react';

export const CaseDetail: React.FC = () => {
  const [, params] = useRoute('/case/:id');
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const cases = useAppStore((state) => state.cases);
  const responders = useAppStore((state) => state.responders);
  const demoMode = useAppStore((state) => state.demoMode);
  const setLastSimulatedCaseId = useAppStore((state) => state.setLastSimulatedCaseId);

  const caseId = params?.id;
  const currentCase = cases.find((c) => c.id === caseId);
  const [events, setEvents] = useState<CaseEvent[]>([]);

  useEffect(() => {
    if (caseId) {
      setEvents(getCaseEvents(caseId));
      setLastSimulatedCaseId(caseId);
    }
  }, [caseId, cases]);

  // Guard rule: Unknown case ID shows plain Not found with link to /report (PRD 9.4)
  if (!currentCase) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          🔍
        </div>
        <h2 className="text-xl font-bold text-slate-800">Case Not Found</h2>
        <p className="text-xs text-slate-500">
          This case record does not exist or may have been archived.
        </p>
        <Link
          href="/report"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-700 text-white rounded-xl text-xs font-semibold hover:bg-teal-800 transition-colors"
        >
          Report an Animal
        </Link>
      </div>
    );
  }

  const assignedResponder = responders.find((r) => r.id === currentCase.assignedResponderId);

  // Status visual banner
  const getStatusBadge = () => {
    switch (currentCase.state) {
      case 'submitted':
      case 'routing':
        return {
          title: t.case.state_routing,
          desc: 'Matching nearest responder with 10-minute accept window.',
          bg: 'bg-amber-500 text-white',
          icon: <Clock className="w-4 h-4 animate-spin" />
        };
      case 'accepted':
        return {
          title: t.case.state_accepted,
          desc: `Responder ${assignedResponder?.name || 'Volunteer'} is en route (${currentCase.etaMinutes || 15} mins ETA).`,
          bg: 'bg-teal-700 text-white',
          icon: <CheckCircle2 className="w-4 h-4" />
        };
      case 'closed':
        return {
          title: t.case.state_closed,
          desc: `Resolved: ${currentCase.outcome ? currentCase.outcome.replace('_', ' ') : 'Case completed'}`,
          bg: 'bg-emerald-800 text-white',
          icon: <CheckCircle2 className="w-4 h-4" />
        };
      case 'escalated_fallback':
        return {
          title: t.case.state_escalated_fallback,
          desc: t.case.municipalFallbackNotice,
          bg: 'bg-rose-700 text-white',
          icon: <AlertTriangle className="w-4 h-4" />
        };
      default:
        return {
          title: 'Processing',
          desc: 'Updating status...',
          bg: 'bg-slate-700 text-white',
          icon: <Clock className="w-4 h-4" />
        };
    }
  };

  const statusInfo = getStatusBadge();

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 space-y-6 pb-20">
      {/* Top Banner Status Bar */}
      <div className={`rounded-2xl p-4 shadow-sm flex items-center justify-between ${statusInfo.bg}`}>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 font-bold text-sm">
            {statusInfo.icon}
            <span>{statusInfo.title}</span>
          </div>
          <div className="text-xs opacity-90">{statusInfo.desc}</div>
        </div>

        {/* Demo shortcut: Jump directly to simulated WhatsApp when routing */}
        {demoMode && currentCase.state === 'routing' && (
          <Link
            href="/dev/whatsapp"
            className="px-2.5 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-semibold backdrop-blur-xs flex items-center gap-1"
            title="Open simulated WhatsApp dispatch to accept or decline"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Respond in WhatsApp</span>
          </Link>
        )}
      </div>

      {/* Case Identity & Emergency Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[11px] font-mono text-slate-400">Case Ref #{currentCase.id}</div>
            <h1 className="text-lg font-bold text-slate-900 capitalize">
              {currentCase.urgency.replace('_', ' ')} Street Dog
            </h1>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {currentCase.state.replace('_', ' ')}
            </span>
            <div className="text-[10px] text-slate-400 mt-1">
              {new Date(currentCase.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        {/* Dog Snapshot */}
        <div className="relative aspect-16/9 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
          <img
            src={currentCase.photoUrl}
            alt="Reported animal"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Location & Privacy Notice (PRD FR-8: Exact location protected) */}
        <div className="space-y-2 pt-1 border-t border-slate-100">
          <div className="flex items-start justify-between text-xs">
            <div className="flex items-start gap-1.5 text-slate-700">
              <MapPin className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900">{currentCase.approxArea}</span>
                {currentCase.exactAddress && (
                  <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>Exact landmark visible to assigned responder</span>
                  </div>
                )}
              </div>
            </div>

            <Link
              href="/map"
              className="text-teal-700 hover:text-teal-800 font-semibold text-xs whitespace-nowrap flex items-center gap-1"
            >
              See on map <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Outcome Details if closed */}
        {currentCase.state === 'closed' && (
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-2 text-xs text-slate-800">
            <div className="font-bold text-emerald-950 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Rescue Completed & Closed
            </div>
            {currentCase.closeNote && (
              <p className="text-slate-700 text-xs italic">"{currentCase.closeNote}"</p>
            )}
            {currentCase.closePhotoUrl && (
              <div className="w-24 h-18 rounded-lg overflow-hidden border border-emerald-300 mt-2">
                <img
                  src={currentCase.closePhotoUrl}
                  alt="Closure proof"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </div>
        )}

        {/* Municipal Helpline Contact if escalated to fallback (PRD FR-14) */}
        {currentCase.state === 'escalated_fallback' && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 space-y-2 text-xs text-rose-950">
            <div className="font-bold text-sm text-rose-900 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-rose-700" />
              Municipal Helpline Dispatched
            </div>
            <p className="text-slate-700 leading-relaxed">
              All neighborhood volunteer responders were unavailable within the guaranteed window. The case has been routed to GHMC Animal Control and HART NGO coordinators.
            </p>
            <div className="font-mono text-xs font-bold text-rose-900 bg-white p-2 rounded-lg border border-rose-200">
              GHMC Helpline: 040-23225397 / 1800-425-0033
            </div>
          </div>
        )}
      </div>

      {/* Cross-Link 1: Feedback Prompt when closed (PRD FR-9 & PRD 9.3) */}
      {currentCase.state === 'closed' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Citizen Resolution Feedback</h3>
            {currentCase.feedback ? (
              <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                Feedback Recorded
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                Pending Your Confirmation
              </span>
            )}
          </div>

          {currentCase.feedback ? (
            <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="font-semibold text-slate-800">
                Was this resolved: {currentCase.feedback.resolved ? 'Yes, resolved' : 'No, not resolved'}
              </div>
              {currentCase.feedback.note && (
                <div className="mt-1 text-slate-500">"{currentCase.feedback.note}"</div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-slate-600">
                The responder marked this animal rescue as closed. Please let us know if help arrived and if the animal was helped.
              </p>
              <Link
                href={`/case/${currentCase.id}/feedback`}
                className="w-full inline-flex items-center justify-center gap-1 py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
              >
                <span>Was this resolved? Give feedback</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Cross-Link 2: Animal QR Record when linked by vet or NGO (PRD 9.3) */}
      {currentCase.animalId && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-blue-950">Linked Animal QR Record</div>
              <div className="text-[11px] text-blue-800 font-mono">Tag ID: {currentCase.animalId}</div>
            </div>
          </div>

          <Link
            href={`/animal/${currentCase.animalId}`}
            className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
          >
            <span>View Profile</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* Escalation Timeline Component */}
      <EscalationTimeline caseData={currentCase} events={events} />

      {/* Event Audit Log (PRD FR-30) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
        <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
          Case Event Audit Log
        </h3>
        <div className="space-y-2">
          {events.map((evt) => (
            <div key={evt.id} className="text-xs flex items-start gap-2 py-1 border-b border-slate-100 last:border-0">
              <span className="font-mono text-[10px] text-slate-400 shrink-0 mt-0.5">
                {new Date(evt.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <div>
                <span className="font-semibold text-slate-800 capitalize">{evt.type.replace('_', ' ')}</span>
                {evt.responderName && <span className="text-slate-500"> · {evt.responderName}</span>}
                {evt.meta && <div className="text-[11px] text-slate-500">{typeof evt.meta === 'string' ? evt.meta : JSON.stringify(evt.meta)}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
