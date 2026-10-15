import React, { useState } from 'react';
import { useRoute, useLocation, Link } from 'wouter';
import { useAppStore } from '../stores/appStore';
import { completeVolunteerOnboarding } from '../services/responderService';
import { ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, Lock, Phone } from 'lucide-react';

export const ResponderJoin: React.FC = () => {
  const [, params] = useRoute('/responder/join/:inviteToken');
  const [, setLocation] = useLocation();
  const inviteToken = params?.inviteToken;

  const responders = useAppStore((state) => state.responders);
  const setCurrentResponderId = useAppStore((state) => state.setCurrentResponderId);
  const setRole = useAppStore((state) => state.setRole);

  const [step, setStep] = useState<'verify' | 'conduct' | 'attestation' | 'pending'>('verify');
  const [phone, setPhone] = useState<string>('+91 98480 23456');
  const [otp, setOtp] = useState<string>('4192');
  const [conductAccepted, setConductAccepted] = useState<boolean>(false);
  const [trainingAttested, setTrainingAttested] = useState<boolean>(false);
  const [vaccineAttested, setVaccineAttested] = useState<boolean>(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('conduct');
  };

  const handleConductNext = () => {
    if (!conductAccepted) {
      alert('You must accept the Code of Conduct to proceed.');
      return;
    }
    setStep('attestation');
  };

  const handleAttestationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainingAttested || !vaccineAttested) {
      alert('You must attest to completing training and rabies vaccination.');
      return;
    }

    // Complete onboarding for volunteer Arun Kumar or newly invited responder
    const responderId = 'resp_2';
    await completeVolunteerOnboarding(responderId);
    setCurrentResponderId(responderId);
    setRole('responder');
    setStep('pending');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 space-y-6 pb-24">
      <div className="text-center space-y-1">
        <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 mx-auto flex items-center justify-center font-bold text-lg mb-2">
          🦺
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Volunteer Responder Onboarding
        </h1>
        <p className="text-xs text-slate-500">
          StraySafe Assured Emergency Network · Ward 104
        </p>
      </div>

      {step === 'verify' && (
        <form onSubmit={handleVerify} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-slate-900">Step 1: Verify Phone Number</h2>
            <p className="text-xs text-slate-500">Verify your mobile for emergency WhatsApp dispatch alerts</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Mobile Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-mono"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Verification Code (OTP)</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-mono tracking-widest text-center"
                required
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Demo Code: 4192</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Verify Phone & Continue
          </button>
        </form>
      )}

      {step === 'conduct' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-slate-900">Step 2: Code of Conduct</h2>
            <p className="text-xs text-slate-500">Core ethics and privacy standards (PRD 8.2)</p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 space-y-2.5 text-xs text-slate-700 border border-slate-200">
            <div className="flex items-start gap-2">
              <span className="font-bold text-teal-700">1.</span>
              <span>Only trained and rabies-vaccinated responders handle animals directly.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-teal-700">2.</span>
              <span>Report observations honestly. Never manufacture triage status.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-teal-700">3.</span>
              <span>Use reporter phone number and exact location ONLY for the active rescue.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-teal-700">4.</span>
              <span>Healthy dogs are never displaced from their native feeding territory.</span>
            </div>
          </div>

          <label className="flex items-start gap-2.5 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={conductAccepted}
              onChange={(e) => setConductAccepted(e.target.checked)}
              className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
            />
            <span className="text-xs text-slate-800 font-medium leading-normal">
              I agree to abide by the StraySafe Volunteer Code of Conduct.
            </span>
          </label>

          <button
            type="button"
            onClick={handleConductNext}
            className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Agree & Continue
          </button>
        </div>
      )}

      {step === 'attestation' && (
        <form onSubmit={handleAttestationSubmit} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-slate-900">Step 3: Safety Attestation</h2>
            <p className="text-xs text-slate-500">Mandatory health and training confirmation</p>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={trainingAttested}
                onChange={(e) => setTrainingAttested(e.target.checked)}
                className="mt-0.5 rounded text-teal-600"
                required
              />
              <span className="text-xs text-slate-800 leading-normal">
                I confirm I have completed animal handling & first-aid training with a recognized partner NGO (e.g. HART Hyderabad / Blue Cross).
              </span>
            </label>

            <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={vaccineAttested}
                onChange={(e) => setVaccineAttested(e.target.checked)}
                className="mt-0.5 rounded text-teal-600"
                required
              />
              <span className="text-xs text-slate-800 leading-normal">
                I confirm I have received pre-exposure human anti-rabies vaccination (or recent protective booster titer).
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Submit for Coordinator Approval
          </button>
        </form>
      )}

      {step === 'pending' && (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 mx-auto flex items-center justify-center font-bold">
            ⏳
          </div>
          <h2 className="text-base font-bold text-slate-900">Pending Coordinator Approval</h2>
          <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
            Your attestation is pending independent confirmation by the NGO coordinator in <strong>/admin/responders</strong>. Emergency cases will not be delivered until approved.
          </p>

          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/admin/responders"
              className="py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-xl transition-colors"
            >
              Simulate Coordinator Approval (/admin/responders)
            </Link>

            <Link
              href="/responder"
              className="py-2 px-3 text-xs text-slate-600 hover:text-slate-900"
            >
              Go to Responder Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
