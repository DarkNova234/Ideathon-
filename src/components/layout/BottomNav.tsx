import React from 'react';
import { Link, useLocation } from 'wouter';
import { useTranslation } from '../../messages';
import { useAppStore } from '../../stores/appStore';
import { PlusCircle, FileText, MapPin, ShieldAlert, UserCheck, Stethoscope, LayoutDashboard } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const [location] = useLocation();
  const { t } = useTranslation();
  const currentRole = useAppStore((state) => state.currentRole);

  return (
    <nav aria-label="Bottom Navigation" className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg">
      <div className="grid grid-cols-4 items-center h-16 px-1">
        {/* Tab 1: Primary Action (Report or Role Specific) */}
        {currentRole === 'citizen' && (
          <>
            <Link
              href="/report"
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
                location === '/report' ? 'text-teal-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PlusCircle className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">{t.nav.report}</span>
            </Link>

            <Link
              href="/my-reports"
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
                location === '/my-reports' ? 'text-teal-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">{t.nav.myReports}</span>
            </Link>

            <Link
              href="/map"
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
                location === '/map' ? 'text-teal-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">{t.nav.map}</span>
            </Link>

            <Link
              href="/help/safety"
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
                location === '/help/safety' ? 'text-teal-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldAlert className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">{t.nav.safety}</span>
            </Link>
          </>
        )}

        {currentRole === 'responder' && (
          <>
            <Link
              href="/responder"
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
                location === '/responder' ? 'text-teal-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">My Cases</span>
            </Link>

            <Link
              href="/dev/whatsapp"
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
                location === '/dev/whatsapp' ? 'text-emerald-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">WhatsApp</span>
            </Link>

            <Link
              href="/map"
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
                location === '/map' ? 'text-teal-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">Map</span>
            </Link>

            <Link
              href="/help/safety"
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
                location === '/help/safety' ? 'text-teal-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldAlert className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">Safety</span>
            </Link>
          </>
        )}

        {(currentRole === 'vet' || currentRole === 'coordinator') && (
          <>
            <Link
              href="/partner"
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
                location === '/partner' ? 'text-teal-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Stethoscope className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">Partner Hub</span>
            </Link>

            <Link
              href="/partner/animals/new"
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
                location === '/partner/animals/new' ? 'text-teal-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PlusCircle className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">Tag Animal</span>
            </Link>

            <Link
              href="/partner/flags"
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
                location === '/partner/flags' ? 'text-amber-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldAlert className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">Rabies Flag</span>
            </Link>

            <Link
              href="/map"
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
                location === '/map' ? 'text-teal-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">Live Map</span>
            </Link>
          </>
        )}

        {currentRole === 'admin' && (
          <>
            <Link
              href="/admin"
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
                location === '/admin' ? 'text-teal-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">Metrics</span>
            </Link>

            <Link
              href="/admin/responders"
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
                location === '/admin/responders' ? 'text-teal-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">Responders</span>
            </Link>

            <Link
              href="/admin/settings"
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
                location === '/admin/settings' ? 'text-teal-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldAlert className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">Config</span>
            </Link>

            <Link
              href="/map"
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
                location === '/map' ? 'text-teal-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">Map</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};
