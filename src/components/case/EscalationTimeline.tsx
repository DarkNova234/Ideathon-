import React from 'react';
import { Case, CaseEvent } from '../../types';
import { useAppStore } from '../../stores/appStore';
import { useEscalationTimer } from '../../services/escalationClock';
import { ShieldCheck, Clock, CheckCircle2, AlertCircle, ArrowDown, FastForward } from 'lucide-react';

interface EscalationTimelineProps {
  caseData: Case;
  events: CaseEvent[];
}

export const EscalationTimeline: React.FC<EscalationTimelineProps> = ({ caseData, events }) => {
  const responders = useAppStore((state) => state.responders);
  const settings = useAppStore((state) => state.settings);
  const demoMode = useAppStore((state) => state.demoMode);
  const { isRouting, formattedTime, skipWait } = useEscalationTimer(
    caseData.state === 'routing' ? caseData.id : null
  );

  // Reconstruct chain steps
  // 1. Nearest Volunteer (resp_1 or offered responder)
  // 2. Next Volunteer (resp_2 or next offered)
  // 3. Partner Vet Clinic (resp_3)
  // 4. NGO Coordinator (resp_4)
  // 5. Municipal Animal Helpline (GHMC)
  const steps = [
    {
      title: 'Step 1: Nearest Volunteer',
      responderId: 'resp_1',
      fallbackName: 'Rahul Reddy (0.2 km)'
    },
    {
      title: 'Step 2: Next Nearest Volunteer',
      responderId: 'resp_2',
      fallbackName: 'Arun Kumar (1.1 km)'
    },
    {
      title: 'Step 3: Partner Vet Clinic (On-Call)',
      responderId: 'resp_3',
      fallbackName: 'HappyPaws Veterinary Clinic'
    },
    {
      title: 'Step 4: NGO Coordinator Dispatch',
      responderId: 'resp_4',
      fallbackName: 'HART Animal Welfare Coordinator'
    },
    {
      title: 'Step 5: Municipal Helpline (GHMC)',
      responderId: 'fallback',
      fallbackName: 'GHMC Animal Control / Blue Cross'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            Assured Escalation Protocol
          </h3>
          <p className="text-xs text-slate-500">Every report auto-routes and never stalls on one person</p>
        </div>

        {/* Live timer / skip button when currently routing */}
        {isRouting && demoMode && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-900 font-mono text-xs px-2.5 py-1 rounded-lg">
              <Clock className="w-3.5 h-3.5 animate-spin text-amber-600" />
              <span>{formattedTime}</span>
            </div>
            <button
              onClick={skipWait}
              className="inline-flex items-center gap-1 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors"
              title="Demo fast-forward: Trigger timeout to escalate to next responder"
            >
              <FastForward className="w-3 h-3 text-teal-600" />
              <span>Skip wait</span>
            </button>
          </div>
        )}
      </div>

      {/* Steps visualization */}
      <div className="space-y-3 pt-1">
        {steps.map((step, index) => {
          const isCurrentActive =
            caseData.state === 'routing' &&
            caseData.assignedResponderId === step.responderId;

          const isAccepted =
            caseData.state === 'accepted' &&
            caseData.assignedResponderId === step.responderId;

          const isClosedHere =
            caseData.state === 'closed' &&
            caseData.assignedResponderId === step.responderId;

          const isDeclined =
            step.responderId !== 'fallback' &&
            caseData.declinedResponderIds.includes(step.responderId);

          const isTimedOut =
            step.responderId !== 'fallback' &&
            caseData.timedOutResponderIds.includes(step.responderId);

          const isFallbackTriggered =
            step.responderId === 'fallback' &&
            caseData.state === 'escalated_fallback';

          let statusText = 'Standby in queue';
          let borderClass = 'border-slate-200 bg-slate-50/50 text-slate-500';
          let badge = null;

          if (isAccepted || isClosedHere) {
            statusText = `Accepted · Help is dispatched${caseData.etaMinutes ? ` (${caseData.etaMinutes} min ETA)` : ''}`;
            borderClass = 'border-teal-300 bg-teal-50/70 text-teal-900 font-medium';
            badge = <span className="text-[11px] font-semibold text-teal-700 bg-teal-100/80 px-2 py-0.5 rounded">Active Responder</span>;
          } else if (isCurrentActive) {
            statusText = `Dispatched · Awaiting response (${formattedTime})`;
            borderClass = 'border-amber-300 bg-amber-50/70 text-amber-900 font-medium';
            badge = <span className="text-[11px] font-semibold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded animate-pulse">Contacting Now</span>;
          } else if (isTimedOut) {
            statusText = '10-minute window elapsed without reply · Escalated';
            borderClass = 'border-slate-200 bg-slate-50 text-slate-400 line-through';
            badge = <span className="text-[10px] text-slate-500">Timed Out</span>;
          } else if (isDeclined) {
            statusText = 'Declined (responder unavailable) · Escalated';
            borderClass = 'border-slate-200 bg-slate-50 text-slate-400 line-through';
            badge = <span className="text-[10px] text-slate-500">Declined</span>;
          } else if (isFallbackTriggered) {
            statusText = 'Local volunteers exhausted · Reached Municipal Helpline';
            borderClass = 'border-red-300 bg-red-50/80 text-red-900 font-medium';
            badge = <span className="text-[11px] font-semibold text-red-700 bg-red-100 px-2 py-0.5 rounded">Helpline Dispatched</span>;
          }

          const responderObj = responders.find((r) => r.id === step.responderId);
          const displayName = responderObj ? `${responderObj.name} (${responderObj.ward})` : step.fallbackName;

          return (
            <div key={index} className={`rounded-xl p-3 border ${borderClass} transition-all`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">{step.title}</span>
                {badge}
              </div>
              <div className="text-xs mt-1 text-slate-800 font-medium">{displayName}</div>
              <div className="text-[11px] mt-0.5 opacity-90">{statusText}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
