import React from 'react';
import { useLocation } from 'wouter';
import { useAppStore } from '../../stores/appStore';
import { UserRole } from '../../types';
import { RotateCcw, FastForward, MessageSquare, ShieldAlert, Sparkles } from 'lucide-react';

export const DemoBar: React.FC = () => {
  const [, setLocation] = useLocation();
  const currentRole = useAppStore((state) => state.currentRole);
  const setRole = useAppStore((state) => state.setRole);
  const demoMode = useAppStore((state) => state.demoMode);
  const setDemoMode = useAppStore((state) => state.setDemoMode);
  const settings = useAppStore((state) => state.settings);
  const setDemoSpeedMultiplier = useAppStore((state) => state.setDemoSpeedMultiplier);
  const resetAllData = useAppStore((state) => state.resetAllData);

  if (!demoMode) return null;

  const handleRoleChange = (role: UserRole) => {
    setRole(role);
    if (role === 'citizen') setLocation('/');
    else if (role === 'responder') setLocation('/responder');
    else if (role === 'vet' || role === 'coordinator') setLocation('/partner');
    else if (role === 'admin') setLocation('/admin');
  };

  return (
    <aside aria-label="Demo Bar" className="bg-slate-900 text-slate-100 text-xs border-b border-slate-800 px-3 py-1.5 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Prototype Badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-semibold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded text-[11px] border border-amber-800/60">
            <Sparkles className="w-3 h-3" />
            Prototype · sample data
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline text-slate-300 font-medium">Role Switcher:</span>
        </div>

        {/* Center: Role Switcher Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-full">
          <button
            onClick={() => handleRoleChange('citizen')}
            className={`px-2 py-1 rounded font-medium whitespace-nowrap transition-colors ${
              currentRole === 'citizen'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            👤 Citizen
          </button>
          <button
            onClick={() => handleRoleChange('responder')}
            className={`px-2 py-1 rounded font-medium whitespace-nowrap transition-colors ${
              currentRole === 'responder'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🦺 Volunteer Arun
          </button>
          <button
            onClick={() => handleRoleChange('vet')}
            className={`px-2 py-1 rounded font-medium whitespace-nowrap transition-colors ${
              currentRole === 'vet'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🏥 Vet Dr. Priya
          </button>
          <button
            onClick={() => handleRoleChange('coordinator')}
            className={`px-2 py-1 rounded font-medium whitespace-nowrap transition-colors ${
              currentRole === 'coordinator'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🏢 NGO Coordinator
          </button>
          <button
            onClick={() => handleRoleChange('admin')}
            className={`px-2 py-1 rounded font-medium whitespace-nowrap transition-colors ${
              currentRole === 'admin'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            ⚙️ Admin
          </button>
        </div>

        {/* Right: Demo controls (Speed & Simulator) */}
        <div className="flex items-center gap-2 ml-auto">
          <div className="flex items-center gap-1 bg-slate-800 rounded px-1.5 py-0.5">
            <FastForward className="w-3 h-3 text-teal-400" />
            <span className="text-[10px] text-slate-400">Clock:</span>
            <button
              onClick={() => setDemoSpeedMultiplier(1)}
              className={`px-1 py-0.2 rounded text-[10px] font-mono ${
                settings.demoSpeedMultiplier === 1 ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              1x
            </button>
            <button
              onClick={() => setDemoSpeedMultiplier(10)}
              className={`px-1 py-0.2 rounded text-[10px] font-mono ${
                settings.demoSpeedMultiplier === 10 ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              10x
            </button>
            <button
              onClick={() => setDemoSpeedMultiplier(30)}
              className={`px-1 py-0.2 rounded text-[10px] font-mono ${
                settings.demoSpeedMultiplier === 30 ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              30x
            </button>
          </div>

          <button
            onClick={() => setLocation('/dev/whatsapp')}
            className="flex items-center gap-1 bg-emerald-700 hover:bg-emerald-600 text-white px-2 py-1 rounded font-medium transition-colors"
            title="Open simulated WhatsApp dispatch screen"
          >
            <MessageSquare className="w-3 h-3" />
            <span className="hidden sm:inline">WhatsApp</span> Sim
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset all demo data back to initial seed state?')) {
                resetAllData();
                setLocation('/');
              }
            }}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
            title="Reset Seed Data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
