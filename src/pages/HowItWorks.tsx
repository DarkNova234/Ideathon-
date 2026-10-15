import React from 'react';
import { Link } from 'wouter';
import { useTranslation } from '../messages';
import { ArrowLeft, Clock, ShieldCheck, Tag, MapPin, CheckCircle, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 pb-20">
      <div className="flex items-center gap-2">
        <Link href="/" className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">How StraySafe Works</h1>
          <p className="text-xs text-slate-500">The Assured Escalation Architecture</p>
        </div>
      </div>

      <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 text-xs text-teal-900 leading-relaxed">
        <strong>The Core Promise:</strong> StraySafe was designed so that no emergency report ever gets forgotten or stalls on an unavailable volunteer. Every report automatically routes nearest-first and escalates up to the municipal helpline if needed.
      </div>

      {/* 4 Steps */}
      <div className="space-y-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold text-xs">1</span>
            <h2 className="text-sm font-bold text-slate-900">Zero-Account Citizen Reporting</h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Citizens can submit in under a minute without signups or passwords. Simply capture a camera snapshot and auto-detect your location. Phone number is optional and automatically erased on case resolution.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold text-xs">2</span>
            <h2 className="text-sm font-bold text-slate-900">Nearest-First Dispatch & 10-Minute Accept Window</h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            The platform calculates the nearest trained and rabies-vaccinated volunteer within range. The responder receives an urgent WhatsApp/SMS message with photo, map pin, and distance. They have 10 minutes to Accept and set an ETA.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold text-xs">3</span>
            <h2 className="text-sm font-bold text-slate-900">Guaranteed Auto-Escalation</h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            If the first volunteer declines or does not reply before the timer expires, the case instantly escalates to the next nearest volunteer, then to partner veterinary clinics (HappyPaws), then to the NGO coordinator, and finally to the GHMC Animal Control Helpline.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold text-xs">4</span>
            <h2 className="text-sm font-bold text-slate-900">QR Collar Passport & Resolution Audit</h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Upon attending, the responder uploads treatment notes and closure photo. When vaccinated or treated, the animal is tagged with a physical QR collar. Any resident or doctor who scans the tag accesses the medical and vaccination passport.
          </p>
        </div>
      </div>

      <div className="pt-2 text-center">
        <Link
          href="/report"
          className="inline-flex items-center gap-2 px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
        >
          <span>Test the Loop Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
