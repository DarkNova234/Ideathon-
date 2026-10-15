import React from 'react';
import { Link } from 'wouter';
import { useTranslation } from '../messages';
import { useAppStore } from '../stores/appStore';
import { FileText, ArrowRight, Clock, CheckCircle2, AlertTriangle, PlusCircle } from 'lucide-react';

export const MyReports: React.FC = () => {
  const { t } = useTranslation();
  const cases = useAppStore((state) => state.cases);
  const myReportIds = useAppStore((state) => state.myReportIds);

  const myCases = cases.filter((c) => myReportIds.includes(c.id));

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-700" />
            {t.nav.myReports}
          </h1>
          <p className="text-xs text-slate-500">
            Saved on this browser · Anonymous reports linked to this device
          </p>
        </div>

        <Link
          href="/report"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Report</span>
        </Link>
      </div>

      {myCases.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-700 mx-auto flex items-center justify-center font-bold text-lg">
            🐾
          </div>
          <h2 className="text-base font-bold text-slate-800">No reports submitted yet</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When you report an injured or sick stray animal, your case tracking link will be saved here automatically.
          </p>
          <div className="pt-2">
            <Link
              href="/report"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-xl shadow-xs"
            >
              Report an Animal Now
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {myCases.map((c) => {
            const isClosed = c.state === 'closed';
            const isAccepted = c.state === 'accepted';
            const isRouting = c.state === 'routing';
            const isFallback = c.state === 'escalated_fallback';

            return (
              <Link
                key={c.id}
                href={`/case/${c.id}`}
                className="block bg-white hover:bg-slate-50/80 rounded-2xl p-4 border border-slate-200 transition-all shadow-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <img
                      src={c.photoUrl}
                      alt="Dog report"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 truncate capitalize">
                        {c.urgency.replace('_', ' ')} Dog
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(c.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 truncate mt-0.5">{c.approxArea}</p>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-[11px] font-medium">
                        {isRouting && (
                          <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-semibold">
                            <Clock className="w-3 h-3 animate-spin" /> Routing to Responders
                          </span>
                        )}
                        {isAccepted && (
                          <span className="inline-flex items-center gap-1 text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md font-semibold">
                            <CheckCircle2 className="w-3 h-3" /> Help is on the way ({c.etaMinutes}m ETA)
                          </span>
                        )}
                        {isClosed && (
                          <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold">
                            <CheckCircle2 className="w-3 h-3" /> Resolved & Closed
                          </span>
                        )}
                        {isFallback && (
                          <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md font-semibold">
                            <AlertTriangle className="w-3 h-3" /> Escalated to Helpline
                          </span>
                        )}
                      </div>

                      <span className="text-xs font-semibold text-teal-700 flex items-center gap-0.5">
                        Track <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
