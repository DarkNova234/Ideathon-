import React from 'react';
import { Link, useLocation } from 'wouter';
import { useTranslation } from '../messages';
import { useAppStore } from '../stores/appStore';
import { Stethoscope, PlusCircle, ShieldAlert, Tag, Building, ArrowRight, CheckCircle2, MapPin } from 'lucide-react';

export const PartnerDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();

  const animals = useAppStore((state) => state.animals);
  const rabiesFlags = useAppStore((state) => state.rabiesFlags);
  const currentRole = useAppStore((state) => state.currentRole);

  // Guard rule (PRD 9.4): Any partner route without session redirects to /login
  if (currentRole !== 'vet' && currentRole !== 'coordinator') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          🔒
        </div>
        <h2 className="text-xl font-bold text-slate-900">Partner Authentication Required</h2>
        <p className="text-xs text-slate-500">
          You must be signed in as a registered Vet Clinic or NGO Coordinator to access this hub.
        </p>
        <div className="pt-2">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-teal-700 text-white rounded-xl text-xs font-semibold hover:bg-teal-800"
          >
            Sign In as Partner / Vet
          </Link>
        </div>
      </div>
    );
  }

  const isVet = currentRole === 'vet';

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-6 pb-24">
      {/* Header Profile */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xl border border-teal-200">
            {isVet ? '🏥' : '🏢'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                {isVet ? 'HappyPaws Veterinary Clinic & Surgical Center' : 'Hyderabad Animal Rescue Trust (HART)'}
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 uppercase">
                {isVet ? 'VERIFIED VET' : 'VERIFIED NGO'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {isVet ? 'Dr. Priya Sharma (Reg #TS-VET-4192) · Jubilee Hills Road 36' : 'Ramesh V. (Reg #HYD-TRUST-8821) · Banjara Hills'}
            </p>
          </div>
        </div>

        {/* Primary Action (PRD 9.3: Primary button to /partner/animals/new) */}
        <div className="flex items-center gap-2">
          <Link
            href="/partner/animals/new"
            className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Register QR Animal</span>
          </Link>

          {isVet && (
            <Link
              href="/partner/flags"
              className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
            >
              <ShieldAlert className="w-4 h-4 text-rose-700" />
              <span>Rabies Flags</span>
            </Link>
          )}
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-2xl font-bold font-mono text-teal-800">{animals.length}</div>
          <div className="text-xs text-slate-500 mt-1 font-medium">Registered QR Passports</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-2xl font-bold font-mono text-emerald-800">
            {animals.filter((a) => a.vaccinated).length}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-medium">Rabies Vaccinated</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-2xl font-bold font-mono text-rose-800">
            {rabiesFlags.filter((f) => !f.clearedAt).length}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-medium">Active Rabies Observations</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-2xl font-bold font-mono text-blue-800">100%</div>
          <div className="text-xs text-slate-500 mt-1 font-medium">Audit Compliance</div>
        </div>
      </div>

      {/* Registered Animals Section */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Community Animals Tagged by Partner Network
            </h2>
            <p className="text-xs text-slate-500">View and update treatment logs and collar QR records</p>
          </div>

          <Link
            href="/partner/animals/new"
            className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-1"
          >
            <span>+ Add New</span>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {animals.map((anim) => (
            <div
              key={anim.id}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors bg-slate-50/50 flex items-start gap-3"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                <img
                  src={anim.faceUrl}
                  alt={anim.tagId}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex-1 min-w-0 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 font-mono">{anim.tagId}</span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      anim.vaccinated ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {anim.vaccinated ? 'VACCINATED' : 'UNVACCINATED'}
                  </span>
                </div>

                <div className="text-slate-600 truncate mt-0.5 font-medium">{anim.breedNote}</div>
                <div className="text-slate-400 text-[11px] truncate mt-0.5">{anim.lastKnownArea}</div>

                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-200/60 text-[11px]">
                  <Link
                    href={`/animal/${anim.tagId}`}
                    className="font-semibold text-teal-700 hover:underline flex items-center gap-0.5"
                  >
                    <span>Public QR Page</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>

                  <span className="text-slate-300">|</span>

                  <Link
                    href={`/partner/animals/${anim.tagId}/edit`}
                    className="font-semibold text-slate-700 hover:text-slate-900"
                  >
                    Add Log / Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
