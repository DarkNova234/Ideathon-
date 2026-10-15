import React, { useState } from 'react';
import { useRoute, useLocation, Link } from 'wouter';
import { useAppStore } from '../stores/appStore';
import { PartnerType } from '../types';
import { Stethoscope, Building, CheckCircle2, ArrowRight } from 'lucide-react';

export const PartnerJoin: React.FC = () => {
  const [, params] = useRoute('/partner/join/:inviteToken');
  const [, setLocation] = useLocation();
  const setRole = useAppStore((state) => state.setRole);

  const [partnerType, setPartnerType] = useState<PartnerType>('vet');
  const [partnerName, setPartnerName] = useState<string>('HappyPaws Veterinary Clinic');
  const [regNumber, setRegNumber] = useState<string>('TS-VET-4192 (Dr. Priya Sharma)');
  const [completedOrientation, setCompletedOrientation] = useState<boolean>(false);

  const handleFinishOnboarding = () => {
    setRole(partnerType === 'vet' ? 'vet' : 'coordinator');
    // PRD 8.3 Step 5: Ends on /partner/animals/new
    setLocation('/partner/animals/new');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 space-y-6 pb-24">
      <div className="text-center space-y-1">
        <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 mx-auto flex items-center justify-center font-bold text-lg mb-2">
          🏥
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Partner Clinic & NGO Onboarding
        </h1>
        <p className="text-xs text-slate-500">
          Verify credentials & role orientation (PRD 8.3)
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-900 block">Organization Type</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPartnerType('vet')}
              className={`p-3 rounded-xl border text-center text-xs transition-all ${
                partnerType === 'vet'
                  ? 'border-teal-600 bg-teal-50 text-teal-900 font-bold'
                  : 'border-slate-200 text-slate-600'
              }`}
            >
              <Stethoscope className="w-4 h-4 mx-auto mb-1 text-teal-700" />
              <span>Veterinary Clinic</span>
            </button>

            <button
              type="button"
              onClick={() => setPartnerType('ngo')}
              className={`p-3 rounded-xl border text-center text-xs transition-all ${
                partnerType === 'ngo'
                  ? 'border-teal-600 bg-teal-50 text-teal-900 font-bold'
                  : 'border-slate-200 text-slate-600'
              }`}
            >
              <Building className="w-4 h-4 mx-auto mb-1 text-teal-700" />
              <span>Animal NGO / Trust</span>
            </button>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Clinic / Trust Name</label>
            <input
              type="text"
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">State Council Reg. / NGO Reg. #</label>
            <input
              type="text"
              value={regNumber}
              onChange={(e) => setRegNumber(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
              required
            />
          </div>
        </div>

        {/* PRD 8.3 Step 4: Role Orientation Checklist */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
          <div className="font-bold text-slate-900">Role Orientation Checklist:</div>
          {partnerType === 'vet' ? (
            <div className="space-y-1.5 text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
                <span>Learn to register QR collar tags & log treatment histories.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
                <span>Learn to set static suspected rabies flags on the public map.</span>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5 text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
                <span>Learn to review volunteer attestations in the responder directory.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
                <span>Manage escalations and coordinate municipal helpline fallback.</span>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleFinishOnboarding}
          className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
        >
          <span>Complete Verification & Register First Tag</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
