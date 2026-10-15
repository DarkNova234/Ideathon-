import React, { useState } from 'react';
import { useRoute, useLocation, Link } from 'wouter';
import { useAppStore } from '../stores/appStore';
import { addAnimalRecord, updateAnimal } from '../services/animalService';
import { ArrowLeft, PlusCircle, ShieldAlert, Tag, CheckCircle2, ArrowRight } from 'lucide-react';

export const PartnerEditAnimal: React.FC = () => {
  const [, params] = useRoute('/partner/animals/:tagId/edit');
  const [, setLocation] = useLocation();
  const tagId = params?.tagId;

  const animals = useAppStore((state) => state.animals);
  const animalRecords = useAppStore((state) => state.animalRecords);
  const currentRole = useAppStore((state) => state.currentRole);

  const animal = animals.find((a) => a.tagId.toUpperCase() === tagId?.toUpperCase());
  const existingRecords = animalRecords.filter((r) => r.animalId.toUpperCase() === tagId?.toUpperCase());

  const [kind, setKind] = useState<'treatment' | 'vaccination'>('treatment');
  const [note, setNote] = useState<string>('');
  const [area, setArea] = useState<string>(animal?.lastKnownArea || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!animal) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Tag ID Not Found</h2>
        <Link href="/partner" className="text-teal-700 text-xs font-semibold underline">
          Back to Partner Hub
        </Link>
      </div>
    );
  }

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note) return;

    setIsSubmitting(true);
    const doctorName = currentRole === 'vet' ? 'Dr. Priya Sharma (HappyPaws Clinic)' : 'Ramesh V. (HART NGO)';
    const org = currentRole === 'vet' ? 'HappyPaws Clinic' : 'HART NGO';

    await addAnimalRecord(animal.tagId, kind, note, doctorName, org);
    if (area !== animal.lastKnownArea) {
      await updateAnimal(animal.tagId, { lastKnownArea: area });
    }

    setIsSubmitting(false);
    setLocation(`/animal/${animal.tagId}`);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href={`/animal/${animal.tagId}`} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Edit Animal Record · {animal.tagId}
            </h1>
            <p className="text-xs text-slate-500">Add medical treatments or update native territory</p>
          </div>
        </div>

        {/* PRD 9.3 cross-link: 'Flag suspected rabies' (vets only) */}
        {currentRole === 'vet' && (
          <Link
            href={`/partner/flags?tagId=${animal.tagId}&lat=${animal.lastKnownLat}&lng=${animal.lastKnownLng}&area=${encodeURIComponent(animal.lastKnownArea)}`}
            className="px-3 py-1.5 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl text-xs font-bold hover:bg-rose-100 transition-colors flex items-center gap-1"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-700" />
            <span>Flag Rabies (Vet)</span>
          </Link>
        )}
      </div>

      {/* Form: Add Treatment / Booster Record */}
      <form onSubmit={handleAddLog} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <PlusCircle className="w-4 h-4 text-teal-700" />
          Log New Treatment or Vaccination
        </h2>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => setKind('treatment')}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              kind === 'treatment'
                ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                : 'border-slate-200 text-slate-600'
            }`}
          >
            Clinical Treatment Log
          </button>

          <button
            type="button"
            onClick={() => setKind('vaccination')}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              kind === 'vaccination'
                ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                : 'border-slate-200 text-slate-600'
            }`}
          >
            Anti-Rabies Booster Vaccine
          </button>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 block">
            Clinical Notes & Prescriptions
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Document drugs administered, dosage, wound status, or booster lot number..."
            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-teal-600 outline-hidden text-slate-800"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 block">
            Last Known Area / Territory
          </label>
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-teal-600 outline-hidden text-slate-800"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isSubmitting ? 'Saving Log...' : 'Save to Animal Passport'}</span>
        </button>
      </form>
    </div>
  );
};
