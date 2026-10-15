import React from 'react';
import { Link, useLocation } from 'wouter';
import { useTranslation, Language } from '../../messages';
import { useAppStore } from '../../stores/appStore';
import { ShieldCheck, Globe, Menu, X, PlusCircle } from 'lucide-react';

export const Header: React.FC = () => {
  const { t, language, setLanguage } = useTranslation();
  const [location] = useLocation();
  const currentRole = useAppStore((state) => state.currentRole);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  return (
    <header className="sticky top-0 sm:top-8 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 h-14">
        {/* Zone 1: Brand Wordmark */}
        <Link href="/" className="flex items-center gap-2 text-teal-800 font-bold text-lg tracking-tight whitespace-nowrap shrink-0 hover:opacity-90">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-700 text-white shadow-xs font-black text-base">
            🐾
          </span>
          <span>{t.common.appName}</span>
        </Link>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link
            href="/report"
            className={`whitespace-nowrap transition-colors hover:text-teal-700 ${
              location === '/report' ? 'text-teal-700 font-semibold' : ''
            }`}
          >
            {t.nav.report}
          </Link>

          <Link
            href="/map"
            className={`whitespace-nowrap transition-colors hover:text-teal-700 ${
              location === '/map' ? 'text-teal-700 font-semibold' : ''
            }`}
          >
            {t.nav.map}
          </Link>

          <Link
            href="/my-reports"
            className={`whitespace-nowrap transition-colors hover:text-teal-700 ${
              location === '/my-reports' ? 'text-teal-700 font-semibold' : ''
            }`}
          >
            {t.nav.myReports}
          </Link>

          <Link
            href="/help/safety"
            className={`whitespace-nowrap transition-colors hover:text-teal-700 ${
              location === '/help/safety' ? 'text-teal-700 font-semibold' : ''
            }`}
          >
            {t.nav.safety}
          </Link>

          {/* Role-specific portals */}
          {currentRole === 'responder' && (
            <Link
              href="/responder"
              className={`whitespace-nowrap text-teal-800 font-medium ${
                location.startsWith('/responder') ? 'font-bold' : ''
              }`}
            >
              My Cases
            </Link>
          )}

          {(currentRole === 'vet' || currentRole === 'coordinator') && (
            <Link
              href="/partner"
              className={`whitespace-nowrap text-teal-800 font-medium ${
                location.startsWith('/partner') ? 'font-bold' : ''
              }`}
            >
              Partner Hub
            </Link>
          )}

          {currentRole === 'admin' && (
            <Link
              href="/admin"
              className={`whitespace-nowrap text-teal-800 font-medium ${
                location.startsWith('/admin') ? 'font-bold' : ''
              }`}
            >
              Admin Dashboard
            </Link>
          )}
        </nav>

        {/* Zone 3: Actions (Language picker + Primary Action) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="flex items-center gap-1 bg-slate-100 rounded-md px-2 py-1 text-xs border border-slate-200">
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={language}
              onChange={handleLanguageChange}
              aria-label={t.common.language}
              className="bg-transparent font-medium text-slate-700 focus:outline-hidden cursor-pointer text-xs"
            >
              <option value="en">English</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="hi">हिन्दी (Hindi)</option>
            </select>
          </div>

          <Link
            href="/report"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shadow-xs whitespace-nowrap"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            {t.nav.report}
          </Link>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-md text-slate-600 hover:bg-slate-100"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2 shadow-lg">
          <Link
            href="/report"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-800 hover:text-teal-700 border-b border-slate-100"
          >
            🐾 {t.nav.report}
          </Link>
          <Link
            href="/map"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-800 hover:text-teal-700 border-b border-slate-100"
          >
            🗺️ {t.nav.map}
          </Link>
          <Link
            href="/my-reports"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-800 hover:text-teal-700 border-b border-slate-100"
          >
            📋 {t.nav.myReports}
          </Link>
          <Link
            href="/help/safety"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-800 hover:text-teal-700 border-b border-slate-100"
          >
            🛡️ {t.nav.safety}
          </Link>
          <Link
            href="/help/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-800 hover:text-teal-700 border-b border-slate-100"
          >
            ℹ️ {t.nav.howItWorks}
          </Link>
          <Link
            href="/responder"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-teal-800 border-b border-slate-100"
          >
            🦺 Responder Portal
          </Link>
          <Link
            href="/partner"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-teal-800 border-b border-slate-100"
          >
            🏥 Partner & Vet Hub
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-teal-800"
          >
            ⚙️ Pilot Admin
          </Link>
        </div>
      )}
    </header>
  );
};
