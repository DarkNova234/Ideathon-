import React, { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useTranslation } from '../messages';
import { useAppStore } from '../stores/appStore';
import { setFlag, clearFlag } from '../services/flagService';
import { ShieldAlert, AlertTriangle, CheckCircle2, ArrowRight, ArrowLeft, MapPin } from 'lucide-react';

export const PartnerFlags: React.FC = () => {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();

  const rabiesFlags = useAppStore((state) => state.rabiesFlags);
  const currentRole = useAppStore((state) => state.currentRole);

  const searchParams = new URLSearchParams(window.location.search);
  const tagIdQuery = searchParams.get('tagId') || '';
  const latQuery = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : 17.4320;
  const lngQuery = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : 78.4010;
  const areaQuery = searchParams.get('area') ? decodeURIComponent(searchParams.get('area')!) : 'Jubilee Hills Road 36, Hyderabad';

  const [areaName, setAreaName] = useState<string>(areaQuery);
  const [lat, setLat] = useState<number>(latQuery);
  const [lng, setLng] = useState<number>(lngQuery);
  const [clinicalNotes, setClinicalNotes] = useState<string>('Observed classic prodromal symptoms: hyper-salivation, jaw paralysis, severe ataxia. Observed safely from clinic transport vehicle.');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [clearingFlagId, setClearingFlagId] = useState<string | null>(null);
  const [clearingNote, setClearingNote] = useState<string>('Laboratory brain tissue RT-PCR confirmed negative for Rabies lyssavirus (distemper encephalopathy confirmed). Area cleared.');

  // Guard: Only signed-in registered vet can set or clear flags (PRD FR-24)
  if (currentRole !== 'vet') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-lg">
          ⚠️
        </div>
        <h2 className="text-xl font-bold text-slate-900">Registered Vet Verification Required</h2>
        <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
          In strict compliance with <strong>PRD FR-24</strong>, only verified registered veterinarians may record or clear suspected rabies observations.
        </p>
        <div className="pt-2">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-700 text-white rounded-xl text-xs font-semibold hover:bg-teal-800"
          >
            Switch to Vet Persona (Dr. Priya Sharma)
          </Link>
        </div>
      </div>
    );
  }

  const handleSetFlag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinicalNotes || clinicalNotes.length < 10) {
      alert('Please document clinical observations supporting rabies suspicion.');
      return;
    }

    setIsSubmitting(true);
    await setFlag({
      lat,
      lng,
      areaName,
      clinicName: 'HappyPaws Veterinary Clinic',
      vetName: 'Dr. Priya Sharma (Reg #TS-VET-4192)',
      setBy: 'Dr. Priya Sharma',
      animalId: tagIdQuery || undefined,
      notes: clinicalNotes
    });
    setIsSubmitting(false);

    // PRD 9.3 cross-link: from /partner/flags to /map, centred on the flag
    setLocation('/map');
  };

  const handleClear = async (flagId: string) => {
    await clearFlag(flagId, 'Dr. Priya Sharma (HappyPaws Clinic)', clearingNote);
    setClearingFlagId(null);
  };

  const activeFlags = rabiesFlags.filter((f) => !f.clearedAt);
  const clearedFlags = rabiesFlags.filter((f) => f.clearedAt);

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 space-y-6 pb-24">
      <div className="flex items-center gap-2">
        <Link href="/partner" className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-700" />
            Vet-Confirmed Suspected Rabies Management
          </h1>
          <p className="text-xs text-slate-500">
            PRD FR-24 through FR-27 · Registered Veterinarian Control
          </p>
        </div>
      </div>

      {/* Protocol Banner: Static marker, no push, no dangerous labeling (FR-25 & FR-26) */}
      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-xs text-amber-950 space-y-2">
        <div className="font-bold flex items-center gap-1.5 text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Statutory Standards & Welfare Rules</span>
        </div>
        <p className="text-slate-700 leading-relaxed text-[11px]">
          1. <strong>Suspected Rabies Only:</strong> Dogs with aggression due to fear, territoriality, or trauma must NEVER be labeled dangerous. The only permissible flag is veterinary-confirmed suspected rabies.
        </p>
        <p className="text-slate-700 leading-relaxed text-[11px]">
          2. <strong>Static Information Only:</strong> This flag appears as an informative marker on <code>/map</code>. It is NEVER pushed as a broadcast notification to residents to prevent panic or unlawful cruelty.
        </p>
      </div>

      {/* Form: Set New Rabies Flag */}
      <form onSubmit={handleSetFlag} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Set Suspected Rabies Observation</h2>

        <div className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Observation Area Landmark</label>
            <input
              type="text"
              value={areaName}
              onChange={(e) => setAreaName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={lat}
                onChange={(e) => setLat(parseFloat(e.target.value))}
                className="w-full p-2 rounded-xl border border-slate-200 font-mono"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={lng}
                onChange={(e) => setLng(parseFloat(e.target.value))}
                className="w-full p-2 rounded-xl border border-slate-200 font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Veterinary Clinical Observations (Mandatory)
            </label>
            <textarea
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              rows={3}
              placeholder="Detail hypersalivation, dysphagia, neurological signs, or quarantine status..."
              className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-600 outline-hidden text-slate-800"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>{isSubmitting ? 'Recording Flag...' : 'Confirm & Set Static Map Marker'}</span>
        </button>
      </form>

      {/* Active Flags List with Clearing Controls (FR-27) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Active Suspected Rabies Markers ({activeFlags.length})</h2>

        {activeFlags.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">No active rabies observations currently set.</p>
        ) : (
          <div className="space-y-3">
            {activeFlags.map((flag) => (
              <div key={flag.id} className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 space-y-2 text-xs">
                <div className="flex items-start justify-between">
                  <div className="font-bold text-rose-950 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-rose-700" />
                    <span>{flag.areaName}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">
                    {new Date(flag.setAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="text-[11px] text-slate-600">
                  Confirmed by: <strong>{flag.setBy}</strong>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-rose-200/60">
                  <Link href="/map" className="font-semibold text-teal-800 hover:underline">
                    View on map →
                  </Link>

                  {/* FR-27: Vet can clear the flag */}
                  <button
                    onClick={() => setClearingFlagId(flag.id)}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 font-semibold text-[11px] transition-colors"
                  >
                    Clear Flag (Verified Safe)
                  </button>
                </div>

                {clearingFlagId === flag.id && (
                  <div className="mt-2 p-3 bg-white rounded-xl border border-slate-300 space-y-2">
                    <label className="text-[11px] font-bold text-slate-800 block">
                      Clearing Justification Note (Audit Logged)
                    </label>
                    <textarea
                      value={clearingNote}
                      onChange={(e) => setClearingNote(e.target.value)}
                      rows={2}
                      className="w-full text-xs p-2 rounded-lg border border-slate-200"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleClear(flag.id)}
                        className="px-3 py-1 bg-teal-700 text-white rounded-lg font-bold text-xs"
                      >
                        Confirm Clearing
                      </button>
                      <button
                        onClick={() => setClearingFlagId(null)}
                        className="px-3 py-1 text-xs text-slate-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
