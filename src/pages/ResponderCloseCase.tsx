import React, { useState } from 'react';
import { useRoute, useLocation, Link } from 'wouter';
import { useTranslation } from '../messages';
import { useAppStore } from '../stores/appStore';
import { closeCase } from '../services/caseService';
import { CaseOutcome } from '../types';
import { CheckCircle2, Camera, ArrowLeft, Send, Tag, AlertCircle } from 'lucide-react';

export const ResponderCloseCase: React.FC = () => {
  const [, params] = useRoute('/r/:token/close');
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const token = params?.token;

  const cases = useAppStore((state) => state.cases);
  const currentResponderId = useAppStore((state) => state.currentResponderId);
  const currentRole = useAppStore((state) => state.currentRole);

  const currentCase = cases.find((c) => c.secretToken === token || c.id === token);

  const [outcome, setOutcome] = useState<CaseOutcome>('treated_on_site');
  const [closeNote, setCloseNote] = useState<string>('Superficial wound cleaned and bandaged with antiseptic. Dog is alert and eating.');
  const [closePhotoUrl, setClosePhotoUrl] = useState<string>(
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300' fill='%23f1f5f9'><rect width='400' height='300' fill='%23e2e8f0'/><circle cx='200' cy='130' r='55' fill='%23b45309'/><circle cx='185' cy='120' r='6' fill='%230f172a'/><circle cx='215' cy='120' r='6' fill='%230f172a'/><ellipse cx='200' cy='140' rx='12' ry='8' fill='%230f172a'/><rect x='170' y='210' width='60' height='20' rx='4' fill='%23ffffff' stroke='%230f766e' stroke-width='2'/><text x='200' y='225' font-family='sans-serif' font-size='10' fill='%230f766e' text-anchor='middle'>Dressed Bandage</text><text x='200' y='280' font-family='sans-serif' font-size='12' fill='%23334155' text-anchor='middle'>Treated Dog (Closure Proof)</text></svg>"
  );
  const [linkAnimalTagId, setLinkAnimalTagId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!currentCase) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Case Not Found</h2>
        <Link href="/responder" className="text-teal-700 text-xs font-semibold underline">
          Go to My Cases
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!closeNote || closeNote.length < 5) {
      setErrorMsg('Please write a brief field note describing the rescue.');
      return;
    }

    try {
      setIsSubmitting(true);
      await closeCase(
        currentCase.id,
        currentCase.assignedResponderId || currentResponderId,
        outcome,
        closeNote,
        closePhotoUrl,
        linkAnimalTagId.trim() || undefined
      );

      // On submit, updates citizen's page and redirects (PRD 9.3)
      setLocation(`/case/${currentCase.id}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to close case.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-4 space-y-6 pb-24">
      <div className="flex items-center gap-2">
        <Link
          href={`/r/${token}`}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {t.responder.closeTitle}
          </h1>
          <p className="text-xs text-slate-500">
            Case Ref #{currentCase.id} · Field Resolution Log
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Outcome Selection (PRD Section 10) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <label className="text-sm font-bold text-slate-900 block">
            {t.responder.outcomeLabel}
          </label>

          <div className="space-y-2">
            {[
              { id: 'treated_on_site', label: t.responder.outcome_treated_on_site, desc: 'Antiseptic, bandage, or pain relief given on spot' },
              { id: 'transported_clinic', label: t.responder.outcome_transported_clinic, desc: 'Transported to partner veterinary hospital for surgery or xray' },
              { id: 'already_vaccinated', label: t.responder.outcome_already_vaccinated, desc: 'Animal was already treated or minor scratch healed' },
              { id: 'not_found', label: t.responder.outcome_not_found, desc: 'Area searched for 30 mins; animal not located' },
              { id: 'deceased', label: t.responder.outcome_deceased, desc: 'Animal succumbed to fatal trauma prior to arrival' }
            ].map((opt) => (
              <label
                key={opt.id}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  outcome === opt.id
                    ? 'border-teal-600 bg-teal-50/70 text-teal-950 font-medium shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="outcome"
                  value={opt.id}
                  checked={outcome === opt.id}
                  onChange={() => setOutcome(opt.id as CaseOutcome)}
                  className="mt-0.5 text-teal-600 focus:ring-teal-500"
                />
                <div className="text-xs">
                  <div className="font-bold text-slate-900">{opt.label}</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">{opt.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Field Notes (PRD FR-18) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <label className="text-sm font-bold text-slate-900 block">
            {t.responder.closeNoteLabel}
          </label>
          <textarea
            value={closeNote}
            onChange={(e) => setCloseNote(e.target.value)}
            rows={3}
            placeholder="Describe treatment given, vet clinic name, or condition..."
            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-hidden text-slate-800 font-medium"
            required
          />
        </div>

        {/* Closure Proof Photo (PRD FR-18) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <label className="text-sm font-bold text-slate-900 block">
            {t.responder.closePhotoLabel}
          </label>
          <div className="aspect-16/10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={closePhotoUrl}
              alt="Closure photo"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <p className="text-[11px] text-slate-400">Sample closure verification photo attached</p>
        </div>

        {/* Link or Register Animal with QR tag (PRD 9.3 cross-link) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-teal-700" />
              Link Animal QR Tag (Optional)
            </label>
            <span className="text-[11px] text-slate-400">e.g. HYD-8492</span>
          </div>

          <input
            type="text"
            value={linkAnimalTagId}
            onChange={(e) => setLinkAnimalTagId(e.target.value.toUpperCase())}
            placeholder="Enter collar Tag ID if already tagged"
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-teal-600 outline-hidden font-mono text-slate-800"
          />

          {/* Cross-Link 9.3: 'Register this animal' for vet or NGO users, carrying the case ID */}
          <div className="pt-2 border-t border-slate-100">
            <Link
              href={`/partner/animals/new?caseId=${currentCase.id}&lat=${currentCase.lat}&lng=${currentCase.lng}&area=${encodeURIComponent(currentCase.approxArea)}`}
              className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-1"
            >
              <span>+ Register as new StraySafe QR Tag (For Vets / NGOs)</span>
            </Link>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isSubmitting ? 'Submitting & Closing...' : 'Confirm Outcome & Close Case'}</span>
        </button>
      </form>
    </div>
  );
};
