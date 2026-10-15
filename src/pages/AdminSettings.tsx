import React, { useState } from 'react';
import { Link } from 'wouter';
import { useAppStore } from '../stores/appStore';
import { Settings as SettingsType } from '../types';
import { Settings, ArrowLeft, CheckCircle2, Save, FastForward, PhoneCall } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const settings = useAppStore((state) => state.settings);
  const setSettings = useAppStore((state) => state.setSettings);

  const [acceptWindow, setAcceptWindow] = useState<number>(settings.acceptWindowMinutes || 10);
  const [helplineName, setHelplineName] = useState<string>(settings.fallbackContact.name);
  const [helplinePhone, setHelplinePhone] = useState<string>(settings.fallbackContact.phone);
  const [helplineOffice, setHelplineOffice] = useState<string>(settings.fallbackContact.office);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(settings.demoSpeedMultiplier || 1);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SettingsType = {
      ...settings,
      acceptWindowMinutes: acceptWindow,
      demoSpeedMultiplier: speedMultiplier,
      fallbackContact: {
        name: helplineName,
        phone: helplinePhone,
        office: helplineOffice
      }
    };

    setSettings(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 space-y-6 pb-24">
      <div className="flex items-center gap-2">
        <Link href="/admin" className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-teal-700" />
            System & Fallback Configuration (FR-12 & FR-14)
          </h1>
          <p className="text-xs text-slate-500">
            Escalation parameters, Municipal helpline contact, and demo clock
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Accept Window Settings (PRD FR-12) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-900 block">
              Volunteer Accept Window (FR-12)
            </label>
            <span className="text-[11px] font-mono text-slate-400">Minutes before auto-escalating</span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              max="60"
              value={acceptWindow}
              onChange={(e) => setAcceptWindow(parseInt(e.target.value) || 10)}
              className="w-24 text-sm font-bold p-2.5 rounded-xl border border-slate-200 text-center"
              required
            />
            <span className="text-xs text-slate-600">
              Minutes (PRD pilot default: 10 minutes)
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            If the assigned responder does not accept within this window, the case automatically transitions to the next nearest responder.
          </p>
        </div>

        {/* Demo Clock Speed Control (PRD 11) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <FastForward className="w-4 h-4 text-teal-700" />
            Prototype Escalation Clock Speed
          </label>
          <p className="text-xs text-slate-500">
            Accelerate the 10-minute accept window for presentation demos.
          </p>

          <div className="grid grid-cols-3 gap-2">
            {[
              { val: 1, label: '1x (Normal 10 mins)' },
              { val: 10, label: '10x (60 seconds)' },
              { val: 30, label: '30x (20 seconds)' }
            ].map((opt) => (
              <button
                key={opt.val}
                type="button"
                onClick={() => setSpeedMultiplier(opt.val)}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  speedMultiplier === opt.val
                    ? 'border-teal-700 bg-teal-50 text-teal-900 shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Municipal Helpline Fallback (PRD FR-14) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <PhoneCall className="w-4 h-4 text-teal-700" />
            Configured Municipal Helpline Fallback (FR-14)
          </label>
          <p className="text-xs text-slate-500">
            Shown to citizen and coordinator when the volunteer chain is exhausted.
          </p>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Helpline Agency</label>
              <input
                type="text"
                value={helplineName}
                onChange={(e) => setHelplineName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Official Contact Numbers</label>
              <input
                type="text"
                value={helplinePhone}
                onChange={(e) => setHelplinePhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Administrative Section</label>
              <input
                type="text"
                value={helplineOffice}
                onChange={(e) => setHelplineOffice(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200"
                required
              />
            </div>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings saved successfully.</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save System Parameters</span>
        </button>
      </form>
    </div>
  );
};
