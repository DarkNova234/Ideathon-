import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useTranslation } from '../messages';
import { ShieldAlert, ArrowLeft, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export const Assess: React.FC = () => {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();

  const [concernType, setConcernType] = useState<string>('barking_night');
  const [description, setDescription] = useState<string>('');
  const [locationText, setLocationText] = useState<string>('Gachibowli, Hyderabad');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6 pb-20">
      <div className="flex items-center gap-2">
        <Link href="/report" className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Request an Assessment</h1>
          <p className="text-xs text-slate-500">Community Welfare & Behavioral Review</p>
        </div>
      </div>

      {/* Mandatory PRD Legal & Welfare Rules Notice */}
      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-xs text-amber-950 space-y-2">
        <div className="font-bold flex items-center gap-1.5 text-amber-900">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Notice Regarding Community Animals (ABC Rules)</span>
        </div>
        <p className="text-slate-700 leading-relaxed text-[11px]">
          In accordance with the Animal Birth Control (ABC) Rules under Indian law, street animals belong to their local territory and removal is prohibited. This assessment request is reviewed by a registered NGO or veterinarian. <strong>Nothing is promised or guaranteed</strong> regarding relocation.
        </p>
      </div>

      {submitted ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-700 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Assessment Request Logged</h2>
          <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
            Your observation has been passed to partner NGO coordinators (HART Hyderabad) for review during routine territory feeding and sterilization rounds.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1 px-4 py-2 bg-teal-700 text-white rounded-xl text-xs font-semibold hover:bg-teal-800 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 block">
              Nature of Observation
            </label>
            <select
              value={concernType}
              onChange={(e) => setConcernType(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-teal-600 outline-hidden text-slate-800"
            >
              <option value="barking_night">Nighttime barking / pack vocalization</option>
              <option value="feeding_territory">Feeding spot dispute or territorial agitation</option>
              <option value="unsterilized_pack">Unsterilized pack needing ABC / vaccination drive</option>
              <option value="fearful_resident">Pedestrian fear / reassurance requested</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 block">
              Street / Area Location
            </label>
            <input
              type="text"
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-teal-600 outline-hidden text-slate-800"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 block">
              Context Notes
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe the situation constructively for the NGO welfare team..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-teal-600 outline-hidden text-slate-800"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Assessment Request</span>
          </button>
        </form>
      )}
    </div>
  );
};
