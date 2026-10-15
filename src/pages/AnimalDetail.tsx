import React, { useEffect, useState } from 'react';
import { useRoute, Link } from 'wouter';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from '../messages';
import { useAppStore } from '../stores/appStore';
import { getAnimal, getAnimalRecords } from '../services/animalService';
import { Animal, AnimalRecord } from '../types';
import {
  Tag,
  ShieldCheck,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Edit,
  PlusCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const AnimalDetail: React.FC = () => {
  const [, params] = useRoute('/animal/:tagId');
  const { t } = useTranslation();
  const tagId = params?.tagId;

  const animals = useAppStore((state) => state.animals);
  const animalRecords = useAppStore((state) => state.animalRecords);
  const currentRole = useAppStore((state) => state.currentRole);

  const animal = animals.find((a) => a.tagId.toUpperCase() === tagId?.toUpperCase());
  const records = animalRecords.filter((r) => r.animalId.toUpperCase() === tagId?.toUpperCase());

  // Guard rule: only verified vet or coordinator/NGO sees edit controls (PRD FR-22 & 9.4)
  const isAuthorizedEditor = currentRole === 'vet' || currentRole === 'coordinator';

  // Guard rule: Unknown tag ID shows plain Not found page with link to /report (PRD 9.4)
  if (!animal) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          🏷️
        </div>
        <h2 className="text-xl font-bold text-slate-800">Animal Tag Not Found</h2>
        <p className="text-xs text-slate-500">
          Tag ID "{tagId}" is not registered in the StraySafe pilot database.
        </p>
        <Link
          href="/report"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-700 text-white rounded-xl text-xs font-semibold hover:bg-teal-800 transition-colors"
        >
          Report an Animal
        </Link>
      </div>
    );
  }

  const qrUrl = window.location.href;

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 space-y-6 pb-20">
      {/* Top Header & Tag Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 text-xs font-mono font-bold">
              <Tag className="w-3.5 h-3.5 text-blue-600" />
              <span>TAG ID: {animal.tagId}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Community Canine Passport
            </h1>
            <p className="text-xs text-slate-500">
              Registered by {animal.createdBy} on {new Date(animal.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Scannable Collar QR Code */}
          <div className="text-center p-2 rounded-xl bg-slate-50 border border-slate-200 shrink-0">
            <QRCodeSVG value={qrUrl} size={64} level="M" />
            <span className="text-[9px] font-mono text-slate-500 block mt-1">Collar QR</span>
          </div>
        </div>

        {/* Public vs Partner edit controls (PRD FR-22 & 9.4) */}
        {isAuthorizedEditor ? (
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 flex items-center justify-between">
            <div className="text-xs text-teal-900">
              <span className="font-semibold">Authorized Partner Session:</span> You are viewing this record as a verified partner.
            </div>
            <Link
              href={`/partner/animals/${animal.tagId}/edit`}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Record</span>
            </Link>
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600 leading-relaxed">
            {t.animal.publicNotice}
          </div>
        )}

        {/* Rabies Vaccination Status Banner */}
        <div
          className={`p-4 rounded-xl border flex items-center justify-between ${
            animal.vaccinated
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : 'bg-amber-50 border-amber-200 text-amber-950'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white ${
                animal.vaccinated ? 'bg-emerald-700' : 'bg-amber-600'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold">
                {animal.vaccinated ? t.animal.vaccinated : t.animal.notVaccinated}
              </div>
              <div className="text-[11px] opacity-80">
                {animal.vaccinationDate
                  ? `Vaccinated on ${animal.vaccinationDate}`
                  : 'Awaiting verified vet clinic vaccination'}
              </div>
            </div>
          </div>

          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              animal.vaccinated ? 'bg-emerald-200/80 text-emerald-900' : 'bg-amber-200/80 text-amber-900'
            }`}
          >
            {animal.vaccinated ? 'PROTECTED' : 'PENDING'}
          </span>
        </div>

        {/* Physical Profile Details */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50">
            <span className="text-slate-400 text-[10px] block">Indie / Breed</span>
            <span className="font-semibold text-slate-800 truncate block">{animal.breedNote}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50">
            <span className="text-slate-400 text-[10px] block">Sex</span>
            <span className="font-semibold text-slate-800 capitalize">{animal.sex}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50">
            <span className="text-slate-400 text-[10px] block">Color</span>
            <span className="font-semibold text-slate-800">{animal.color}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50">
            <span className="text-slate-400 text-[10px] block">Approx. Age</span>
            <span className="font-semibold text-slate-800">{animal.approxAge}</span>
          </div>
        </div>

        {/* Last Known Territory / Location (PRD 9.3 cross-link to /map) */}
        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-1.5 text-slate-600">
            <MapPin className="w-4 h-4 text-teal-700 shrink-0" />
            <span>Territory: <strong className="text-slate-800">{animal.lastKnownArea}</strong></span>
          </div>

          <Link
            href="/map"
            className="text-teal-700 hover:text-teal-800 font-semibold text-xs flex items-center gap-1"
          >
            See location on map <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* 3 Photos Slot: Face, Side, and Markings (PRD FR-21) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-500">
          Identification Photos (Face, Side, Markings)
        </h2>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={animal.faceUrl}
                alt="Face identification"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-[10px] font-medium text-slate-500 text-center">1. Face View</div>
          </div>

          <div className="space-y-1">
            <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={animal.sideUrl}
                alt="Side profile"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-[10px] font-medium text-slate-500 text-center">2. Side Profile</div>
          </div>

          <div className="space-y-1">
            <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={animal.markingsUrl}
                alt="Distinguishing markings"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-[10px] font-medium text-slate-500 text-center">3. Markings</div>
          </div>
        </div>
      </div>

      {/* Medical & Treatment History Log (PRD FR-21) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            {t.animal.treatmentHistory}
          </h2>

          {isAuthorizedEditor && (
            <Link
              href={`/partner/animals/${animal.tagId}/edit`}
              className="text-xs text-teal-700 font-semibold hover:underline flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Record</span>
            </Link>
          )}
        </div>

        {records.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs">
            No medical treatments recorded yet.
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((rec) => (
              <div
                key={rec.id}
                className="rounded-xl p-3 border border-slate-200 bg-slate-50/60 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-bold capitalize px-2 py-0.5 rounded text-[10px] ${
                      rec.kind === 'vaccination'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {rec.kind}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">{rec.date}</span>
                </div>

                <p className="text-slate-800 leading-relaxed font-medium">{rec.note}</p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                  <span>Logged by: {rec.loggedBy} ({rec.clinicOrNgo})</span>

                  {/* PRD 9.3 cross-link: to /case/[id] for treatment history items from a case (shown to partners only) */}
                  {isAuthorizedEditor && rec.caseId && (
                    <Link
                      href={`/case/${rec.caseId}`}
                      className="text-teal-700 font-semibold hover:underline flex items-center gap-0.5"
                    >
                      <span>Case #{rec.caseId.substring(0, 8)}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
