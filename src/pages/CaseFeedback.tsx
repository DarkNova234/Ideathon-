import React, { useState } from 'react';
import { useRoute, useLocation, Link } from 'wouter';
import { useTranslation } from '../messages';
import { useAppStore } from '../stores/appStore';
import { submitFeedback } from '../services/caseService';
import { CheckCircle2, AlertCircle, ArrowLeft, Send } from 'lucide-react';

export const CaseFeedback: React.FC = () => {
  const [, params] = useRoute('/case/:id/feedback');
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const cases = useAppStore((state) => state.cases);

  const caseId = params?.id;
  const currentCase = cases.find((c) => c.id === caseId);

  const [resolved, setResolved] = useState<boolean>(true);
  const [note, setNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!currentCase) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Case Not Found</h2>
        <Link href="/report" className="text-teal-700 text-xs font-semibold underline">
          Go to report page
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseId) return;

    setIsSubmitting(true);
    await submitFeedback(caseId, resolved, note);
    setIsSubmitting(false);

    // Redirect back to case detail page
    setLocation(`/case/${caseId}`);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6 pb-20">
      <div className="flex items-center gap-2">
        <Link
          href={`/case/${caseId}`}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Was this rescue resolved?</h1>
          <p className="text-xs text-slate-500">Case Ref #{caseId} · Citizen Feedback</p>
        </div>
      </div>

      {/* Case Outcome Context Summary */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2">
        <div className="font-semibold text-slate-800">
          Responder Reported Outcome: <span className="text-teal-800 capitalize font-bold">{currentCase.outcome?.replace('_', ' ') || 'Closed'}</span>
        </div>
        {currentCase.closeNote && (
          <p className="text-slate-600 italic">"{currentCase.closeNote}"</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-5">
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-900 block">
            Did help arrive and resolve the situation?
          </label>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setResolved(true)}
              className={`p-3.5 rounded-xl border text-center transition-all ${
                resolved
                  ? 'border-teal-600 bg-teal-50 text-teal-900 font-bold shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <CheckCircle2 className={`w-5 h-5 mx-auto mb-1 ${resolved ? 'text-teal-700' : 'text-slate-400'}`} />
              <span className="text-xs">Yes, Resolved</span>
            </button>

            <button
              type="button"
              onClick={() => setResolved(false)}
              className={`p-3.5 rounded-xl border text-center transition-all ${
                !resolved
                  ? 'border-rose-600 bg-rose-50 text-rose-900 font-bold shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <AlertCircle className={`w-5 h-5 mx-auto mb-1 ${!resolved ? 'text-rose-700' : 'text-slate-400'}`} />
              <span className="text-xs">No, Not Resolved</span>
            </button>
          </div>
        </div>

        {/* PRD Product Rule Notice */}
        {!resolved && (
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
            <span className="font-semibold">Protocol Notice:</span> In accordance with coordinator oversight rules, choosing "Not resolved" alerts the NGO coordinator immediately for manual review (cases are closed by verified responders and cannot be unilaterally reopened by reporters).
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 block">
            Additional Observations (Optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Tell us what you observed (e.g. volunteer arrived promptly, dog was treated gently, or animal left area)..."
            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-hidden text-slate-800"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isSubmitting ? 'Submitting...' : 'Submit Resolution Feedback'}</span>
        </button>
      </form>
    </div>
  );
};
