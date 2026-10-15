import React, { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useTranslation } from '../messages';
import { useAppStore } from '../stores/appStore';
import { LeafletMap } from '../components/map/LeafletMap';
import { MapPin, ShieldAlert, Tag, Filter, AlertTriangle, Info, PlusCircle } from 'lucide-react';

export const AreaMap: React.FC = () => {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();

  const cases = useAppStore((state) => state.cases);
  const rabiesFlags = useAppStore((state) => state.rabiesFlags);
  const animals = useAppStore((state) => state.animals);
  const myReportIds = useAppStore((state) => state.myReportIds);
  const currentRole = useAppStore((state) => state.currentRole);

  const [filter, setFilter] = useState<'all' | 'cases' | 'flags' | 'animals'>('all');

  const filteredCases = filter === 'flags' || filter === 'animals' ? [] : cases;
  const filteredFlags = filter === 'cases' || filter === 'animals' ? [] : rabiesFlags.filter((f) => !f.clearedAt);
  const filteredAnimals = filter === 'cases' || filter === 'flags' ? [] : animals;

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-4 pb-20">
      {/* Title & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <MapPin className="w-5 h-5 text-teal-700" />
            {t.nav.map} · Hyderabad Pilot Ward
          </h1>
          <p className="text-xs text-slate-500">
            Gachibowli, Jubilee Hills & Osmania Campus · Community Stray Tracking
          </p>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs self-start sm:self-auto border border-slate-200">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('cases')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filter === 'cases' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cases ({cases.length})
          </button>
          <button
            onClick={() => setFilter('flags')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filter === 'flags' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rabies Flags ({rabiesFlags.filter((f) => !f.clearedAt).length})
          </button>
          <button
            onClick={() => setFilter('animals')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filter === 'animals' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            QR Animals ({animals.length})
          </button>
        </div>
      </div>

      {/* Vet Rabies Flag Explainer Notice (PRD FR-25 & FR-26: strictly static, no push, no dangerous labeling) */}
      <div className="bg-amber-50 rounded-2xl p-3.5 border border-amber-200 text-xs text-amber-950 space-y-1">
        <div className="font-semibold flex items-center gap-1.5 text-amber-900">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Vet-Confirmed Rabies Observations: Static Information Only</span>
        </div>
        <p className="text-[11px] text-amber-900 leading-relaxed">
          {t.rabies.vetNotice} {t.rabies.noDangerousLabel}
        </p>
      </div>

      {/* Main Interactive Map */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
        <LeafletMap
          center={[17.4380, 78.3650]}
          zoom={13}
          height="520px"
          cases={filteredCases}
          rabiesFlags={filteredFlags}
          animals={filteredAnimals}
          onSelectCase={(id) => setLocation(`/case/${id}`)}
          onSelectAnimal={(tagId) => setLocation(`/animal/${tagId}`)}
        />
      </div>

      {/* Map Legend */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <div className="text-xs font-bold text-slate-700 mb-2">Map Legend & Privacy Guarantees</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-rose-600 shrink-0"></span>
            <span className="text-slate-600">Urgent Case (Injured)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-amber-500 shrink-0"></span>
            <span className="text-slate-600">Sick / Limping Case</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-red-900 shrink-0"></span>
            <span className="text-slate-600">Suspected Rabies (Vet)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-blue-600 shrink-0"></span>
            <span className="text-slate-600">Tagged Animal Profile</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>FR-8 Privacy Rule: Exact GPS coordinates are masked by approximate territory rings for general public.</span>
          {currentRole === 'vet' && (
            <Link href="/partner/flags" className="font-semibold text-teal-700 hover:underline">
              + Set Rabies Flag (Vet)
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
