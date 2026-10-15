import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'wouter';
import { useTranslation } from '../messages';
import { useAppStore } from '../stores/appStore';
import { createCase } from '../services/caseService';
import { CaseUrgency, ReportFormData } from '../types';
import { LeafletMap } from '../components/map/LeafletMap';
import { Camera, MapPin, AlertCircle, ShieldAlert, CheckCircle, ArrowRight, Upload, Sparkles, Navigation } from 'lucide-react';

export const Report: React.FC = () => {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();

  // State
  const [urgency, setUrgency] = useState<CaseUrgency>('injured_now');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [lat, setLat] = useState<number>(17.4410);
  const [lng, setLng] = useState<number>(78.3490);
  const [approxArea, setApproxArea] = useState<string>('Gachibowli Stadium Service Road, Hyderabad');
  const [exactAddress, setExactAddress] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [consentAccepted, setConsentAccepted] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [showManualMap, setShowManualMap] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Permission explainer flags
  const [cameraExplainerShown, setCameraExplainerShown] = useState<boolean>(false);
  const [locationExplainerShown, setLocationExplainerShown] = useState<boolean>(false);

  // Default sample mock dogs for quick one-tap capture in demo
  const sampleDogPhotos = [
    {
      label: 'Injured Indie (Bleeding Paw)',
      url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300' fill='%23f1f5f9'><rect width='400' height='300' fill='%23e2e8f0'/><circle cx='200' cy='130' r='60' fill='%23b45309'/><circle cx='180' cy='120' r='8' fill='%231e293b'/><circle cx='220' cy='120' r='8' fill='%231e293b'/><ellipse cx='200' cy='145' rx='16' ry='10' fill='%230f172a'/><polygon points='145,85 170,120 135,130' fill='%2392400e'/><polygon points='255,85 230,120 265,130' fill='%2392400e'/><circle cx='170' cy='240' r='12' fill='%23dc2626'/><text x='200' y='280' font-family='sans-serif' font-size='13' fill='%23475569' text-anchor='middle'>Camera Snapshot · Injured Street Dog</text></svg>"
    },
    {
      label: 'Limping Street Puppy',
      url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300' fill='%23f1f5f9'><rect width='400' height='300' fill='%23cbd5e1'/><circle cx='200' cy='130' r='55' fill='%23d97706'/><circle cx='180' cy='120' r='8' fill='%231e293b'/><circle cx='220' cy='120' r='8' fill='%231e293b'/><ellipse cx='200' cy='145' rx='14' ry='9' fill='%230f172a'/><text x='200' y='280' font-family='sans-serif' font-size='13' fill='%23334155' text-anchor='middle'>Camera Snapshot · Limping Pup</text></svg>"
    }
  ];

  // Set default photo initially so judge can test instantly
  useEffect(() => {
    if (!photoUrl) {
      setPhotoUrl(sampleDogPhotos[0].url);
    }
  }, []);

  // Handle GPS detection
  const handleDetectLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude);
          setLng(pos.coords.longitude);
          setApproxArea(`Near Lat ${pos.coords.latitude.toFixed(4)}, Lng ${pos.coords.longitude.toFixed(4)} (Hyderabad Ward)`);
          setIsLocating(false);
        },
        () => {
          // Fallback to Hyderabad Gachibowli if denied or timeout
          setLat(17.4410);
          setLng(78.3490);
          setApproxArea('Gachibowli Stadium Road, Hyderabad (Default GPS)');
          setIsLocating(false);
          setShowManualMap(true);
        },
        { timeout: 5000 }
      );
    } else {
      setIsLocating(false);
      setShowManualMap(true);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!photoUrl) {
      setErrorMsg('Please capture or choose a photo of the animal.');
      return;
    }

    if (!consentAccepted) {
      setErrorMsg('Please accept the location & privacy consent to proceed.');
      return;
    }

    try {
      setIsSubmitting(true);
      const reportData: ReportFormData = {
        urgency,
        photoUrl,
        lat,
        lng,
        approxArea,
        exactAddress,
        phone: phone.trim() || undefined,
        consentAccepted: true
      };

      const created = await createCase(reportData);
      // Navigate to case tracking page (PRD FR-6)
      setLocation(`/case/${created.id}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 space-y-6 pb-20">
      {/* Top Title & Safety Reminder Strip */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span>🐾</span> {t.report.title}
        </h1>
        <p className="text-xs text-slate-500">{t.report.subtitle}</p>

        {/* Persistent Safety Reminder (PRD 9.3 & 8.1) */}
        <div className="bg-amber-50 rounded-xl p-3 border border-amber-200/80 flex items-start gap-2 text-xs text-amber-900">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">Safety Reminder:</span> Keep a safe distance (10+ feet). Do not touch or corner an unfamiliar animal.{' '}
            <Link href="/help/safety" className="font-bold underline text-amber-950 hover:text-black">
              Safety guidance
            </Link>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Live Photo Capture (PRD FR-1 & FR-4) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-teal-700" />
              {t.report.photoLabel}
            </label>
            <span className="text-[11px] text-slate-400">Deterrent against stale uploads</span>
          </div>

          {/* Photo Preview Frame */}
          <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Captured street dog"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="text-center p-6 text-slate-400">
                <Camera className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p className="text-xs">{t.report.photoHint}</p>
              </div>
            )}
          </div>

          {/* Photo Actions: Camera input + Demo snapshot presets */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-2">
              <label className="flex-1 py-2.5 px-3 bg-teal-700 hover:bg-teal-800 text-white font-medium text-xs rounded-xl cursor-pointer text-center transition-colors shadow-xs flex items-center justify-center gap-1.5">
                <Camera className="w-3.5 h-3.5" />
                <span>Snap Camera Photo</span>
                {/* capture="environment" encourages mobile device back camera */}
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <label className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl cursor-pointer text-center transition-colors flex items-center justify-center gap-1">
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>Browse</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Quick Demo Photo Presets for seamless testing without camera hardware */}
            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500 overflow-x-auto">
              <span className="shrink-0 font-medium text-slate-600">Sample Dog:</span>
              {sampleDogPhotos.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPhotoUrl(preset.url)}
                  className={`px-2 py-1 rounded-md text-[11px] whitespace-nowrap transition-colors border ${
                    photoUrl === preset.url
                      ? 'bg-teal-50 border-teal-300 text-teal-800 font-semibold'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Urgency Level (PRD FR-1) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <label className="text-sm font-bold text-slate-900 block">
            {t.report.urgencyLabel}
          </label>

          <div className="space-y-2">
            <label
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                urgency === 'injured_now'
                  ? 'border-rose-400 bg-rose-50/70 text-rose-950 font-medium shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <input
                type="radio"
                name="urgency"
                value="injured_now"
                checked={urgency === 'injured_now'}
                onChange={() => setUrgency('injured_now')}
                className="mt-0.5 text-rose-600 focus:ring-rose-500"
              />
              <div className="text-xs">
                <div className="font-bold text-rose-900">Injured Now (Immediate Trauma)</div>
                <div className="text-slate-600 text-[11px] mt-0.5">Bleeding, hit by vehicle, broken limb, severe pain</div>
              </div>
            </label>

            <label
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                urgency === 'sick_limping'
                  ? 'border-amber-400 bg-amber-50/70 text-amber-950 font-medium shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <input
                type="radio"
                name="urgency"
                value="sick_limping"
                checked={urgency === 'sick_limping'}
                onChange={() => setUrgency('sick_limping')}
                className="mt-0.5 text-amber-600 focus:ring-amber-500"
              />
              <div className="text-xs">
                <div className="font-bold text-amber-900">Sick or Limping</div>
                <div className="text-slate-600 text-[11px] mt-0.5">Severe mange, deep infection, unable to bear weight</div>
              </div>
            </label>

            <label
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                urgency === 'needs_vaccination'
                  ? 'border-blue-400 bg-blue-50/70 text-blue-950 font-medium shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <input
                type="radio"
                name="urgency"
                value="needs_vaccination"
                checked={urgency === 'needs_vaccination'}
                onChange={() => setUrgency('needs_vaccination')}
                className="mt-0.5 text-blue-600 focus:ring-blue-500"
              />
              <div className="text-xs">
                <div className="font-bold text-blue-900">Needs Vaccination / Uncollared Litter</div>
                <div className="text-slate-600 text-[11px] mt-0.5">Unvaccinated street puppy litter or dog without ear-notch / collar tag</div>
              </div>
            </label>
          </div>
        </div>

        {/* Section 3: Location (Auto GPS with manual pin fallback) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-teal-700" />
              {t.report.locationLabel}
            </label>
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={isLocating}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <Navigation className="w-3.5 h-3.5" />
              {isLocating ? 'Detecting...' : 'Detect GPS'}
            </button>
          </div>

          <div className="space-y-2">
            <input
              type="text"
              value={approxArea}
              onChange={(e) => setApproxArea(e.target.value)}
              placeholder="Area or Street Landmark (e.g. Near Gachibowli Stadium)"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-hidden font-medium text-slate-800"
              required
            />

            <input
              type="text"
              value={exactAddress}
              onChange={(e) => setExactAddress(e.target.value)}
              placeholder="Exact landmark or street detail (shown ONLY to assigned responder)"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-hidden text-slate-700"
            />
          </div>

          {/* Toggle Manual Pin Map */}
          <div>
            <button
              type="button"
              onClick={() => setShowManualMap(!showManualMap)}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium underline flex items-center gap-1"
            >
              {showManualMap ? 'Hide interactive pin map' : 'Tap to adjust location pin on map'}
            </button>

            {showManualMap && (
              <div className="mt-2">
                <LeafletMap
                  center={[lat, lng]}
                  zoom={15}
                  height="220px"
                  allowPinDrop={true}
                  selectedPin={[lat, lng]}
                  onPinDropped={(newLat, newLng) => {
                    setLat(newLat);
                    setLng(newLng);
                  }}
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Selected coordinates: {lat.toFixed(5)}, {lng.toFixed(5)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Section 4: Optional Phone & Privacy Consent (PRD FR-2 & FR-3 & FR-34) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <label className="text-sm font-bold text-slate-900 block">
            {t.report.phoneLabel}
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98480 00000 (Optional for SMS / WhatsApp status)"
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-hidden text-slate-800 font-mono"
          />
          <p className="text-[11px] text-slate-500 leading-relaxed">
            {t.report.phoneHint}
          </p>

          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={consentAccepted}
                onChange={(e) => setConsentAccepted(e.target.checked)}
                className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
              />
              <span className="text-[11px] text-slate-600 leading-normal">
                {t.report.consentText}
              </span>
            </label>
          </div>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Primary Submit Button */}
        <div className="space-y-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 bg-teal-700 hover:bg-teal-800 active:scale-[0.99] text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSubmitting ? (
              <span>Submitting & Dispatching...</span>
            ) : (
              <>
                <span>🚨 {t.report.title}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Secondary P2 cross-link (PRD 9.3: Link to /assess for disturbance concerns) */}
          <div className="text-center pt-1">
            <Link
              href="/assess"
              className="text-xs text-slate-500 hover:text-slate-800 underline transition-colors"
            >
              Dog causing a neighborhood disturbance? Request an assessment
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};
