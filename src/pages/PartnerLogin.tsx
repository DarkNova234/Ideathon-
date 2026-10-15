import React, { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useAppStore } from '../stores/appStore';
import { UserRole } from '../types';
import { Lock, ArrowRight, ShieldCheck, Stethoscope, Building, User } from 'lucide-react';

export const PartnerLogin: React.FC = () => {
  const [, setLocation] = useLocation();
  const setRole = useAppStore((state) => state.setRole);

  const [selectedRole, setSelectedRole] = useState<UserRole>('vet');
  const [email, setEmail] = useState<string>('dr.priya@happypaws.vet');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setRole(selectedRole);

    if (selectedRole === 'admin') {
      setLocation('/admin');
    } else if (selectedRole === 'vet' || selectedRole === 'coordinator') {
      setLocation('/partner');
    } else if (selectedRole === 'responder') {
      setLocation('/responder');
    } else {
      setLocation('/');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6 pb-24">
      <div className="text-center space-y-1">
        <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 mx-auto flex items-center justify-center font-bold text-lg mb-2">
          🔐
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Partner & Staff Sign In
        </h1>
        <p className="text-xs text-slate-500">
          Passwordless magic link or demo persona switcher (PRD 8.3 & 9.1)
        </p>
      </div>

      <form onSubmit={handleSignIn} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-900 block">
            Select Partner Persona
          </label>

          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedRole('vet');
                setEmail('dr.priya@happypaws.vet');
              }}
              className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                selectedRole === 'vet'
                  ? 'border-teal-600 bg-teal-50 text-teal-950 font-bold shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Stethoscope className="w-4 h-4 text-teal-700 shrink-0" />
                <div>
                  <div>Partner Vet (Dr. Priya Sharma)</div>
                  <div className="text-[10px] text-slate-500 font-normal">Can log treatments, register QR tags, set rabies flags</div>
                </div>
              </div>
              {selectedRole === 'vet' && <span className="text-teal-700 font-bold">✓</span>}
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole('coordinator');
                setEmail('ramesh@hart-ngo.org');
              }}
              className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                selectedRole === 'coordinator'
                  ? 'border-teal-600 bg-teal-50 text-teal-950 font-bold shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Building className="w-4 h-4 text-teal-700 shrink-0" />
                <div>
                  <div>NGO Coordinator (Ramesh V. - HART)</div>
                  <div className="text-[10px] text-slate-500 font-normal">Manages volunteer directory, handles escalations</div>
                </div>
              </div>
              {selectedRole === 'coordinator' && <span className="text-teal-700 font-bold">✓</span>}
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole('admin');
                setEmail('pilot.admin@straysafe.org');
              }}
              className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                selectedRole === 'admin'
                  ? 'border-teal-600 bg-teal-50 text-teal-950 font-bold shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
                <div>
                  <div>Pilot Administrator</div>
                  <div className="text-[10px] text-slate-500 font-normal">System dashboard, response metrics, fallback config</div>
                </div>
              </div>
              {selectedRole === 'admin' && <span className="text-teal-700 font-bold">✓</span>}
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 block">Registered Email / Magic Link</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-mono text-slate-800"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
        >
          <span>Continue as {selectedRole.toUpperCase()}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
