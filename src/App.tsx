/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Route, Switch } from 'wouter';
import { DemoBar } from './components/layout/DemoBar';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { FirstRunSafetyModal } from './components/layout/FirstRunSafetyModal';

// Pages
import { Landing } from './pages/Landing';
import { Report } from './pages/Report';
import { CaseDetail } from './pages/CaseDetail';
import { CaseFeedback } from './pages/CaseFeedback';
import { MyReports } from './pages/MyReports';
import { AnimalDetail } from './pages/AnimalDetail';
import { AreaMap } from './pages/AreaMap';
import { Assess } from './pages/Assess';
import { HowItWorks } from './pages/HowItWorks';
import { Safety } from './pages/Safety';
import { ResponderTokenCase } from './pages/ResponderTokenCase';
import { ResponderCloseCase } from './pages/ResponderCloseCase';
import { ResponderJoin } from './pages/ResponderJoin';
import { ResponderDashboard } from './pages/ResponderDashboard';
import { PartnerLogin } from './pages/PartnerLogin';
import { PartnerJoin } from './pages/PartnerJoin';
import { PartnerDashboard } from './pages/PartnerDashboard';
import { PartnerNewAnimal } from './pages/PartnerNewAnimal';
import { PartnerEditAnimal } from './pages/PartnerEditAnimal';
import { PartnerFlags } from './pages/PartnerFlags';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminResponders } from './pages/AdminResponders';
import { AdminCaseDetail } from './pages/AdminCaseDetail';
import { AdminSettings } from './pages/AdminSettings';
import { DevWhatsApp } from './pages/DevWhatsApp';
import { NotFound } from './pages/NotFound';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Top Demo Bar with Role Switcher & Speed Controller */}
      <DemoBar />

      {/* Main App Navigation Header */}
      <Header />

      {/* First-Run Safety Guidance Modal (PRD 8.1 Step 3) */}
      <FirstRunSafetyModal />

      {/* Main Content Router */}
      <main className="flex-1 w-full">
        <Switch>
          {/* Citizen Routes */}
          <Route path="/" component={Landing} />
          <Route path="/report" component={Report} />
          <Route path="/case/:id/feedback" component={CaseFeedback} />
          <Route path="/case/:id" component={CaseDetail} />
          <Route path="/my-reports" component={MyReports} />
          <Route path="/animal/:tagId" component={AnimalDetail} />
          <Route path="/map" component={AreaMap} />
          <Route path="/assess" component={Assess} />
          <Route path="/help/how-it-works" component={HowItWorks} />
          <Route path="/help/safety" component={Safety} />

          {/* Responder Routes */}
          <Route path="/r/:token/close" component={ResponderCloseCase} />
          <Route path="/r/:token" component={ResponderTokenCase} />
          <Route path="/responder/join/:inviteToken" component={ResponderJoin} />
          <Route path="/responder" component={ResponderDashboard} />

          {/* Partner & Vet Routes */}
          <Route path="/login" component={PartnerLogin} />
          <Route path="/partner/join/:inviteToken" component={PartnerJoin} />
          <Route path="/partner/animals/new" component={PartnerNewAnimal} />
          <Route path="/partner/animals/:tagId/edit" component={PartnerEditAnimal} />
          <Route path="/partner/flags" component={PartnerFlags} />
          <Route path="/partner" component={PartnerDashboard} />

          {/* Admin Routes */}
          <Route path="/admin/responders" component={AdminResponders} />
          <Route path="/admin/cases/:id" component={AdminCaseDetail} />
          <Route path="/admin/settings" component={AdminSettings} />
          <Route path="/admin" component={AdminDashboard} />

          {/* Simulation & Prototype Routes */}
          <Route path="/dev/whatsapp" component={DevWhatsApp} />

          {/* 404 Fallback */}
          <Route component={NotFound} />
        </Switch>
      </main>

      {/* Footer for Desktop & Tablet */}
      <footer className="hidden sm:block border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium">
            <span>🐾 StraySafe Community Animal Rescue Protocol</span>
            <span>·</span>
            <span>Hyderabad Pilot Ward 104</span>
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <a href="/help/safety" className="hover:text-teal-700">Safety Protocol</a>
            <a href="/help/how-it-works" className="hover:text-teal-700">Escalation Rules</a>
            <a href="/map" className="hover:text-teal-700">Area Map</a>
            <a href="/dev/whatsapp" className="hover:text-emerald-700 font-semibold">WhatsApp Sim</a>
            <a href="/admin" className="hover:text-teal-700">Admin Dashboard</a>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Thumb Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
