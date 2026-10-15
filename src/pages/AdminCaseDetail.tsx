import React from 'react';
import { useRoute, Link } from 'wouter';
import { useAppStore } from '../stores/appStore';
import { getCaseEvents } from '../services/caseService';
import { ArrowLeft, ExternalLink, ShieldCheck, Clock, MapPin, CheckCircle2, AlertTriangle } from 'lucide-react';

export const AdminCaseDetail: React.FC = () => {
  const [, params] = useRoute('/admin/cases/:id');
  const caseId = params?.id;

  const cases = useAppStore((state) => state.cases);
  const responders = useAppStore((state) => state.responders);

  const currentCase = cases.find((c) => c.id === caseId);
  const events = caseId ? getCaseEvents(caseId) : [];

  if (!currentCase) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Case Record Not Found</h2>
        <Link href="/admin" className="text-teal-700 text-xs font-semibold underline">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const assignedResponder = responders.find((r) => r.id === currentCase.assignedResponderId);

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/admin" className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Case Audit & Event History (FR-30)
            </h1>
            <p className="text-xs text-slate-500 font-mono">Case #{currentCase.id}</p>
          </div>
        </div>

        {/* PRD 9.3 cross-link: 'Open as reporter sees it' */}
        <Link
          href={`/case/${currentCase.id}`}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
        >
          <span>Open as reporter sees it</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Case Overview Box */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50">
            <span className="text-slate-400 text-[10px] block">State</span>
            <span className="font-bold text-slate-900 uppercase">{currentCase.state}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50">
            <span className="text-slate-400 text-[10px] block">Urgency</span>
            <span className="font-bold text-slate-900 capitalize">{currentCase.urgency.replace('_', ' ')}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50">
            <span className="text-slate-400 text-[10px] block">Current Step</span>
            <span className="font-bold text-slate-900">Step {currentCase.currentOfferIndex + 1}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50">
            <span className="text-slate-400 text-[10px] block">Assigned Responder</span>
            <span className="font-bold text-slate-900 truncate block">
              {assignedResponder ? assignedResponder.name : 'None / In routing'}
            </span>
          </div>
        </div>

        <div className="text-xs space-y-1 text-slate-600 border-t border-slate-100 pt-3">
          <div><strong>Area Landmark:</strong> {currentCase.approxArea}</div>
          {currentCase.exactAddress && <div><strong>Exact Address:</strong> {currentCase.exactAddress}</div>}
          <div><strong>Reported at:</strong> {new Date(currentCase.createdAt).toLocaleString()}</div>
          {currentCase.acceptedAt && <div><strong>Accepted at:</strong> {new Date(currentCase.acceptedAt).toLocaleString()}</div>}
          {currentCase.closedAt && <div><strong>Closed at:</strong> {new Date(currentCase.closedAt).toLocaleString()}</div>}
        </div>
      </div>

      {/* Full Event Log (PRD FR-30) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Immutable Event Audit Trail</h2>

        <div className="space-y-3">
          {events.map((evt, idx) => (
            <div key={evt.id} className="relative pl-6 pb-3 last:pb-0 border-l-2 border-teal-200 last:border-transparent">
              <span className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-teal-600 text-white flex items-center justify-center text-[9px] font-bold">
                {idx + 1}
              </span>

              <div className="text-xs space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 capitalize">{evt.type.replace('_', ' ')}</span>
                  <span className="font-mono text-[10px] text-slate-400">
                    {new Date(evt.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>

                {evt.responderName && (
                  <div className="text-teal-800 font-medium text-[11px]">
                    Responder: {evt.responderName}
                  </div>
                )}

                {evt.meta && (
                  <div className="text-slate-500 text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-100 mt-1">
                    {typeof evt.meta === 'string' ? evt.meta : JSON.stringify(evt.meta)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
