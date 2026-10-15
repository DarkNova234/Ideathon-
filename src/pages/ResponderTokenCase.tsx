import React, { useState } from 'react';
import { useRoute, Link, useLocation } from 'wouter';
import { useTranslation } from '../messages';
import { useAppStore } from '../stores/appStore';
import { acceptCase, declineCase, markArrived, calculateDistanceKm } from '../services/caseService';
import { MapPin, Clock, CheckCircle2, XCircle, ArrowRight, ShieldAlert, AlertCircle, Phone, Lock } from 'lucide-react';

export const ResponderTokenCase: React.FC = () => {
  const [, params] = useRoute('/r/:token');
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const token = params?.token;

  const cases = useAppStore((state) => state.cases);
  const responders = useAppStore((state) => state.responders);
  const currentResponderId = useAppStore((state) => state.currentResponderId);

  const currentCase = cases.find((c) => c.secretToken === token || c.id === token);
  const currentResponder = responders.find((r) => r.id === (currentCase?.assignedResponderId || currentResponderId)) || responders[0];

  const [eta, setEta] = useState<number>(15);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showEtaModal, setShowEtaModal] = useState<boolean>(false);

  // Guard Rule (PRD 9.4): Expired or reused token shows "This case has moved to someone else" with link to /responder
  if (!currentCase) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          ⚠️
        </div>
        <h2 className="text-lg font-bold text-slate-800">Invalid or Expired Link</h2>
        <p className="text-xs text-slate-500">
          This dispatch link is no longer valid.
        </p>
        <Link
          href="/responder"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-700 text-white rounded-xl text-xs font-semibold hover:bg-teal-800"
        >
          Go to My Cases
        </Link>
      </div>
    );
  }

  // If case has escalated past this responder
  const isExpiredOrMoved =
    currentCase.state === 'escalated_fallback' ||
    (currentCase.assignedResponderId &&
      currentCase.assignedResponderId !== currentResponder.id &&
      currentCase.declinedResponderIds.includes(currentResponder.id));

  if (isExpiredOrMoved) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
          <Clock className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Case Has Moved</h2>
        <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
          {t.responder.caseMoved}
        </p>
        <div className="pt-2">
          <Link
            href="/responder"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-teal-700 text-white rounded-xl text-xs font-semibold hover:bg-teal-800"
          >
            {t.responder.viewMyCases}
          </Link>
        </div>
      </div>
    );
  }

  const distanceKm = calculateDistanceKm(currentCase.lat, currentCase.lng, currentResponder.lat, currentResponder.lng);

  const handleAccept = async () => {
    setIsProcessing(true);
    await acceptCase(currentCase.id, currentResponder.id, eta);
    setIsProcessing(false);
    setShowEtaModal(false);
  };

  const handleDecline = async () => {
    if (window.confirm('Decline this case and pass to the next responder in the chain?')) {
      setIsProcessing(true);
      await declineCase(currentCase.id, currentResponder.id);
      setIsProcessing(false);
      setLocation('/responder');
    }
  };

  const handleMarkArrived = async () => {
    setIsProcessing(true);
    await markArrived(currentCase.id, currentResponder.id);
    setIsProcessing(false);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-4 space-y-6 pb-24">
      {/* Top Banner Notice */}
      <div className="bg-teal-900 text-white rounded-2xl p-4 shadow-sm space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-teal-300">Single-Use Dispatch Token</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-800 uppercase tracking-wider">
            {currentCase.state}
          </span>
        </div>
        <h1 className="text-base font-bold">Emergency Dispatch: {currentCase.urgency.replace('_', ' ')}</h1>
        <p className="text-xs text-teal-200">
          Assigned to: {currentResponder.name} ({distanceKm} km away)
        </p>
      </div>

      {/* Dog Photo & Case Context */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="aspect-16/10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
          <img
            src={currentCase.photoUrl}
            alt="Dog needing rescue"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Exact Location & Landmark (FR-17 & FR-35: Visible to assigned responder) */}
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2 text-xs">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-teal-700 shrink-0" />
            <span>Exact Location (Authorized Responder View)</span>
          </div>
          <div className="text-slate-800 font-semibold">{currentCase.exactAddress || currentCase.approxArea}</div>
          <div className="text-[11px] text-slate-500 font-mono">
            GPS: {currentCase.lat.toFixed(5)}, {currentCase.lng.toFixed(5)} ({distanceKm} km from you)
          </div>

          {currentCase.reporterPhone && (
            <div className="pt-2 border-t border-slate-200 text-slate-700 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>Reporter Contact: {currentCase.reporterPhone}</span>
            </div>
          )}
        </div>

        {/* Action Controls based on case state */}
        {currentCase.state === 'routing' && (
          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => setShowEtaModal(true)}
              disabled={isProcessing}
              className="w-full py-3.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Accept Case & Provide ETA</span>
            </button>

            <button
              onClick={handleDecline}
              disabled={isProcessing}
              className="w-full py-2.5 px-4 bg-white hover:bg-rose-50 text-rose-700 font-semibold text-xs rounded-xl border border-rose-200 transition-colors flex items-center justify-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              <span>Decline (Pass to Next Volunteer)</span>
            </button>
          </div>
        )}

        {currentCase.state === 'accepted' && (
          <div className="space-y-3 pt-2">
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-950 flex items-center justify-between">
              <div>
                <div className="font-bold">Case Accepted</div>
                <div className="text-[11px] text-teal-800">Estimated Arrival: {currentCase.etaMinutes} mins</div>
              </div>
              {currentCase.arrivedAt && (
                <span className="text-[10px] font-bold bg-teal-200 text-teal-900 px-2 py-0.5 rounded">
                  ARRIVED
                </span>
              )}
            </div>

            {/* FR-18: Mark Arrived then Close */}
            {!currentCase.arrivedAt ? (
              <button
                onClick={handleMarkArrived}
                disabled={isProcessing}
                className="w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                <span>Mark Arrived on Scene</span>
              </button>
            ) : (
              <div className="space-y-2">
                <div className="text-xs text-emerald-800 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Marked arrived on scene. Ready to complete rescue.</span>
                </div>

                <Link
                  href={`/r/${currentCase.secretToken}/close`}
                  className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <span>Complete & Close Case</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        )}

        {currentCase.state === 'closed' && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2">
            <div className="text-xs font-bold text-slate-800">This case has been resolved and closed.</div>
            <Link
              href={`/case/${currentCase.id}`}
              className="text-xs font-semibold text-teal-700 hover:underline inline-flex items-center gap-1"
            >
              View Public Case Page <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Safety Reminder footer link (PRD 9.3) */}
      <div className="text-center">
        <Link href="/help/safety" className="text-xs text-slate-500 hover:underline">
          View Responder Safety Protocol & Field Guidelines
        </Link>
      </div>

      {/* ETA prompt modal */}
      {showEtaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xs w-full p-5 space-y-4 shadow-xl">
            <h3 className="font-bold text-slate-900 text-sm">{t.responder.etaQuestion}</h3>
            <div className="grid grid-cols-3 gap-2">
              {[10, 15, 20, 30, 45].map((val) => (
                <button
                  key={val}
                  onClick={() => setEta(val)}
                  className={`py-2 px-1 text-xs rounded-xl font-bold border transition-colors ${
                    eta === val
                      ? 'bg-teal-700 text-white border-teal-700'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {val} mins
                </button>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowEtaModal(false)}
                className="flex-1 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAccept}
                disabled={isProcessing}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white shadow-xs"
              >
                Confirm & Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
