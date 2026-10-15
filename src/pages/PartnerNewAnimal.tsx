import React, { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useTranslation } from '../messages';
import { useAppStore } from '../stores/appStore';
import { createAnimal } from '../services/animalService';
import { AnimalRegistrationFormData } from '../types';
import { Tag, Camera, CheckCircle2, ArrowLeft, ArrowRight, AlertCircle, Syringe, Stethoscope } from 'lucide-react';

export const PartnerNewAnimal: React.FC = () => {
  const [, setLocation] = useLocation();
  const currentRole = useAppStore((state) => state.currentRole);

  // Parse URL query params if linked from a case
  const searchParams = new URLSearchParams(window.location.search);
  const caseIdFromQuery = searchParams.get('caseId') || '';
  const latFromQuery = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : 17.4410;
  const lngFromQuery = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : 78.3490;
  const areaFromQuery = searchParams.get('area') ? decodeURIComponent(searchParams.get('area')!) : 'Gachibowli Ward 104, Hyderabad';

  // Default mock SVG dog photos
  const DEFAULT_FACE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300' fill='%23f1f5f9'><rect width='400' height='300' fill='%23e2e8f0'/><circle cx='200' cy='130' r='60' fill='%23b45309'/><circle cx='180' cy='120' r='8' fill='%231e293b'/><circle cx='220' cy='120' r='8' fill='%231e293b'/><ellipse cx='200' cy='145' rx='16' ry='10' fill='%230f172a'/><polygon points='145,85 170,120 135,130' fill='%2392400e'/><polygon points='255,85 230,120 265,130' fill='%2392400e'/><text x='200' y='280' font-family='sans-serif' font-size='13' fill='%23475569' text-anchor='middle'>Photo 1: Face View</text></svg>";
  const DEFAULT_SIDE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300' fill='%23f1f5f9'><rect width='400' height='300' fill='%23cbd5e1'/><circle cx='140' cy='130' r='45' fill='%23b45309'/><rect x='130' y='120' width='160' height='80' rx='30' fill='%23b45309'/><rect x='150' y='180' width='16' height='70' fill='%2392400e'/><rect x='250' y='180' width='16' height='70' fill='%2392400e'/><text x='200' y='280' font-family='sans-serif' font-size='13' fill='%23334155' text-anchor='middle'>Photo 2: Side Profile</text></svg>";
  const DEFAULT_MARKINGS = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300' fill='%23f1f5f9'><rect width='400' height='300' fill='%23e2e8f0'/><circle cx='200' cy='140' r='60' fill='%23ffffff' stroke='%23b45309' stroke-width='6'/><polygon points='180,120 200,100 220,120' fill='%23b45309'/><text x='200' y='280' font-family='sans-serif' font-size='13' fill='%23475569' text-anchor='middle'>Photo 3: White Chest Patch / Markings</text></svg>";

  const [tagId, setTagId] = useState<string>(`HYD-${Math.floor(1000 + Math.random() * 9000)}`);
  const [breedNote, setBreedNote] = useState<string>('Indie Pariah Dog');
  const [sex, setSex] = useState<'male' | 'female' | 'unknown'>('male');
  const [color, setColor] = useState<string>('Tan with white chest patch');
  const [approxAge, setApproxAge] = useState<string>('2 years');
  const [lastKnownArea, setLastKnownArea] = useState<string>(areaFromQuery);
  const [initialKind, setInitialKind] = useState<'treatment' | 'vaccination'>('vaccination');
  const [initialNote, setInitialNote] = useState<string>('Anti-Rabies Vaccine (Nobivac Rabies 1ml SC) administered. Physical condition checked.');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, slot: 'face' | 'side' | 'markings') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        // Just mock preview
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      setIsSubmitting(true);
      const data: AnimalRegistrationFormData = {
        tagId,
        faceUrl: DEFAULT_FACE,
        sideUrl: DEFAULT_SIDE,
        markingsUrl: DEFAULT_MARKINGS,
        breedNote,
        sex,
        color,
        approxAge,
        lastKnownArea,
        lastKnownLat: latFromQuery,
        lastKnownLng: lngFromQuery,
        initialTreatmentKind: initialKind,
        initialTreatmentNote: initialNote,
        caseId: caseIdFromQuery || undefined
      };

      const clinicName = currentRole === 'vet' ? 'HappyPaws Veterinary Clinic' : 'Hyderabad Animal Rescue Trust';
      const doctorName = currentRole === 'vet' ? 'Dr. Priya Sharma' : 'Ramesh V. (NGO Coordinator)';

      const created = await createAnimal(data, doctorName, clinicName);

      // PRD 9.3: On save, ends on /animal/[tagId] with the QR code to print
      setLocation(`/animal/${created.tagId}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to register animal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 space-y-6 pb-24">
      <div className="flex items-center gap-2">
        <Link href="/partner" className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Tag className="w-5 h-5 text-teal-700" />
            Register Animal & Generate QR Collar (FR-20)
          </h1>
          <p className="text-xs text-slate-500">
            Authorized Partner Veterinary & NGO Registration Flow
          </p>
        </div>
      </div>

      {caseIdFromQuery && (
        <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
          <span>Linking this registration to closed rescue Case #{caseIdFromQuery.substring(0, 8)}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Tag ID & Physical Characteristics */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-900">
              Collar Tag ID
            </label>
            <span className="text-[11px] text-slate-400">Must match physical QR collar badge</span>
          </div>

          <input
            type="text"
            value={tagId}
            onChange={(e) => setTagId(e.target.value.toUpperCase())}
            className="w-full text-base font-bold font-mono p-2.5 rounded-xl border border-slate-300 text-teal-900 focus:border-teal-600 outline-hidden tracking-wider"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Breed / Type</label>
              <input
                type="text"
                value={breedNote}
                onChange={(e) => setBreedNote(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Sex</label>
              <select
                value={sex}
                onChange={(e) => setSex(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-200 capitalize font-medium"
              >
                <option value="male">Male (Ear Notched if ABC)</option>
                <option value="female">Female (Ear Notched if ABC)</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Coat Color & Pattern</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Approximate Age</label>
              <input
                type="text"
                value={approxAge}
                onChange={(e) => setApproxAge(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Native Territory / Feeding Area</label>
            <input
              type="text"
              value={lastKnownArea}
              onChange={(e) => setLastKnownArea(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
              required
            />
          </div>
        </div>

        {/* Section 2: 3 Identification Photos (Face, Side, Markings - PRD FR-21) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-teal-700" />
              Identification Photo Slots (FR-21)
            </label>
            <span className="text-[11px] text-slate-400">Sample photos loaded</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1 text-center">
              <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img src={DEFAULT_FACE} alt="Face slot" className="w-full h-full object-cover" />
              </div>
              <span className="text-[10px] text-slate-600 font-semibold block">1. Face View</span>
            </div>

            <div className="space-y-1 text-center">
              <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img src={DEFAULT_SIDE} alt="Side slot" className="w-full h-full object-cover" />
              </div>
              <span className="text-[10px] text-slate-600 font-semibold block">2. Side Profile</span>
            </div>

            <div className="space-y-1 text-center">
              <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img src={DEFAULT_MARKINGS} alt="Markings slot" className="w-full h-full object-cover" />
              </div>
              <span className="text-[10px] text-slate-600 font-semibold block">3. Markings</span>
            </div>
          </div>
        </div>

        {/* Section 3: Initial Treatment / Vaccination Log (FR-20 & FR-21) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Syringe className="w-4 h-4 text-teal-700" />
            Initial Medical Log
          </label>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setInitialKind('vaccination');
                setInitialNote('Anti-Rabies Vaccine (Nobivac Rabies 1ml SC) administered. Batch #RB-2026-9.');
              }}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                initialKind === 'vaccination'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                  : 'border-slate-200 text-slate-600'
              }`}
            >
              Anti-Rabies Vaccination
            </button>

            <button
              type="button"
              onClick={() => {
                setInitialKind('treatment');
                setInitialNote('Wound cleaned, antibiotic spray applied, pain relief injection given.');
              }}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                initialKind === 'treatment'
                  ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                  : 'border-slate-200 text-slate-600'
              }`}
            >
              Clinical Treatment
            </button>
          </div>

          <textarea
            value={initialNote}
            onChange={(e) => setInitialNote(e.target.value)}
            rows={2}
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-teal-600 outline-hidden text-slate-800"
            required
          />
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isSubmitting ? 'Registering...' : 'Save & Generate QR Collar Record'}</span>
        </button>
      </form>
    </div>
  );
};
