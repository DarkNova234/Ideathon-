import React, { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useAppStore } from '../stores/appStore';
import { acceptCase, declineCase, calculateDistanceKm } from '../services/caseService';
import { MessageSquare, MapPin, Clock, CheckCircle2, XCircle, ArrowRight, ShieldCheck, AlertCircle, Phone, Video, MoreVertical } from 'lucide-react';

export const DevWhatsApp: React.FC = () => {
  const [, setLocation] = useLocation();
  const cases = useAppStore((state) => state.cases);
  const responders = useAppStore((state) => state.responders);
  const lastSimulatedCaseId = useAppStore((state) => state.lastSimulatedCaseId);
  const currentResponderId = useAppStore((state) => state.currentResponderId);

  // Pick the case to simulate
  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    lastSimulatedCaseId || cases[0]?.id || 'case_demo_1'
  );
  const [etaSelected, setEtaSelected] = useState<number>(15);
  const [showEtaModal, setShowEtaModal] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const activeCase = cases.find((c) => c.id === selectedCaseId) || cases[0];
  const activeResponder = responders.find((r) => r.id === (activeCase?.assignedResponderId || currentResponderId)) || responders[0];

  const distanceKm = activeCase
    ? calculateDistanceKm(activeCase.lat, activeCase.lng, activeResponder.lat, activeResponder.lng)
    : 0.8;

  const handleAccept = async () => {
    if (!activeCase) return;
    setIsProcessing(true);
    await acceptCase(activeCase.id, activeResponder.id, etaSelected);
    setIsProcessing(false);
    setShowEtaModal(false);
    // Direct responder to token action or case page
    setLocation(`/case/${activeCase.id}`);
  };

  const handleDecline = async () => {
    if (!activeCase) return;
    setIsProcessing(true);
    await declineCase(activeCase.id, activeResponder.id, 'Responder unavailable via WhatsApp simulation');
    setIsProcessing(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-4 space-y-4 pb-24">
      {/* Simulation Banner Notice (PRD 11 & FR-16) */}
      <div className="bg-amber-500 text-slate-950 p-2.5 rounded-xl text-xs font-bold text-center shadow-xs flex items-center justify-center gap-1.5">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span>WhatsApp Dispatch Simulator · Prototype Simulation Only</span>
      </div>

      {/* Case Selector Dropdown */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 text-xs flex items-center justify-between gap-2 shadow-xs">
        <span className="font-semibold text-slate-700 whitespace-nowrap">Simulate Dispatch for:</span>
        <select
          value={activeCase?.id}
          onChange={(e) => setSelectedCaseId(e.target.value)}
          className="text-xs p-1.5 rounded-lg border border-slate-200 font-mono font-medium text-slate-800 focus:outline-hidden"
        >
          {cases.map((c) => (
            <option key={c.id} value={c.id}>
              #{c.id.substring(0, 10)} ({c.state.toUpperCase()}) - {c.urgency}
            </option>
          ))}
        </select>
      </div>

      {/* WhatsApp Simulated Phone UI Frame */}
      <div className="rounded-3xl overflow-hidden border-4 border-slate-800 shadow-2xl bg-[#0b141a]">
        {/* Top WhatsApp Chat Header */}
        <div className="bg-[#1f2c34] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center font-bold text-white text-base">
              🐾
            </div>
            <div>
              <div className="text-sm font-semibold flex items-center gap-1">
                <span>StraySafe Emergency Bot</span>
                <span className="text-[10px] bg-teal-500/30 text-teal-300 px-1 rounded">BOT</span>
              </div>
              <div className="text-[11px] text-slate-400">Verified Rescue Dispatch Service</div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <Video className="w-4 h-4 cursor-pointer hover:text-white" />
            <Phone className="w-4 h-4 cursor-pointer hover:text-white" />
            <MoreVertical className="w-4 h-4 cursor-pointer hover:text-white" />
          </div>
        </div>

        {/* WhatsApp Chat Conversation Canvas */}
        <div className="p-4 space-y-4 min-h-[460px] bg-[#0b141a] bg-radial from-slate-900 to-[#0b141a]">
          {/* System Date Pill */}
          <div className="text-center">
            <span className="bg-[#182229] text-slate-400 text-[10px] px-3 py-1 rounded-md font-mono">
              Today · {new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })}
            </span>
          </div>

          {/* Incoming Dispatch Message Bubble */}
          {activeCase ? (
            <div className="bg-[#202c33] text-slate-100 rounded-2xl rounded-tl-xs p-3.5 space-y-3 max-w-[92%] shadow-md border border-slate-700/60">
              {/* Photo Attachment */}
              <div className="rounded-xl overflow-hidden bg-slate-800 aspect-16/10 border border-slate-700">
                <img
                  src={activeCase.photoUrl}
                  alt="Dog incident"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Urgency & Headline */}
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-wider">
                  🚨 {activeCase.urgency.replace('_', ' ')}
                </div>
                <div className="text-xs font-bold text-white pt-1">
                  Emergency Animal Dispatch Request
                </div>
                <div className="text-[11px] text-slate-300 leading-relaxed">
                  Hi {activeResponder.name}, an injured dog was reported <strong>{distanceKm} km</strong> from your location in <strong>{activeCase.approxArea}</strong>.
                </div>
              </div>

              {/* Exact Location & Urgency Meta */}
              <div className="bg-[#111b21] p-2.5 rounded-xl border border-slate-700/80 space-y-1 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span className="font-semibold text-white">{activeCase.exactAddress || activeCase.approxArea}</span>
                </div>
                <div className="text-slate-400 text-[10px]">
                  Dispatch window: <strong>10 minutes</strong> before next responder escalation.
                </div>
              </div>

              {/* Case Current Status Indicator */}
              <div className="text-[10px] text-slate-400 border-t border-slate-700/50 pt-2 flex items-center justify-between">
                <span>Status: <strong className="text-teal-400 capitalize">{activeCase.state.replace('_', ' ')}</strong></span>
                <span>Case #{activeCase.id.substring(0, 8)}</span>
              </div>

              {/* Interactive WhatsApp Action Buttons (PRD FR-16: Accept & Decline links) */}
              {activeCase.state === 'routing' ? (
                <div className="space-y-1.5 pt-2">
                  <button
                    onClick={() => setShowEtaModal(true)}
                    disabled={isProcessing}
                    className="w-full py-2.5 px-3 bg-[#00a884] hover:bg-[#069375] text-[#111b21] font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Accept & Set ETA</span>
                  </button>

                  <button
                    onClick={handleDecline}
                    disabled={isProcessing}
                    className="w-full py-2 px-3 bg-[#182229] hover:bg-[#202c33] text-rose-400 font-semibold text-xs rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Decline (Pass to Next Volunteer)</span>
                  </button>

                  <Link
                    href={`/r/${activeCase.secretToken}`}
                    className="block text-center text-[10px] text-teal-400 hover:underline pt-1"
                  >
                    Or open Web Link /r/{activeCase.secretToken}
                  </Link>
                </div>
              ) : activeCase.state === 'accepted' ? (
                <div className="bg-teal-950/60 border border-teal-800 p-2.5 rounded-xl text-center space-y-1">
                  <div className="text-teal-400 font-bold text-xs">✓ You have accepted this case</div>
                  <div className="text-[11px] text-slate-300">ETA: {activeCase.etaMinutes} mins</div>
                  <div className="pt-1">
                    <Link
                      href={`/r/${activeCase.secretToken}`}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-teal-700 hover:bg-teal-600 text-white rounded-lg text-xs font-semibold"
                    >
                      <span>Open Case Actions</span> <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ) : activeCase.state === 'closed' ? (
                <div className="bg-slate-800 p-2.5 rounded-xl text-center text-xs text-slate-300">
                  Case is completed and closed ({activeCase.outcome?.replace('_', ' ')}).
                </div>
              ) : (
                <div className="bg-rose-950/60 border border-rose-900 p-2.5 rounded-xl text-center text-xs text-rose-300">
                  Case moved to municipal fallback because volunteer window elapsed.
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-slate-500 py-12 text-xs">
              No cases to simulate. Submit a report first!
            </div>
          )}
        </div>
      </div>

      {/* ETA Selection Modal on Accept */}
      {showEtaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xs w-full p-5 space-y-4 shadow-xl">
            <h3 className="font-bold text-slate-900 text-sm">Estimated Arrival Time</h3>
            <p className="text-xs text-slate-500">
              The citizen will see "Help is on the way" with your ETA (PRD FR-15).
            </p>

            <div className="grid grid-cols-3 gap-2">
              {[10, 15, 20, 30, 45].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setEtaSelected(mins)}
                  className={`py-2 px-1 text-xs rounded-xl font-bold border transition-colors ${
                    etaSelected === mins
                      ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {mins} mins
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
                Confirm ETA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
