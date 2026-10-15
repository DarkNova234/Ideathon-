import React, { useState } from 'react';
import { Link } from 'wouter';
import { useTranslation } from '../messages';
import { useAppStore } from '../stores/appStore';
import { approveResponder, suspendResponder, inviteResponder } from '../services/responderService';
import { Responder, ResponderRole } from '../types';
import { Users, PlusCircle, CheckCircle2, Ban, ArrowLeft, ExternalLink, ShieldCheck, Phone } from 'lucide-react';

export const AdminResponders: React.FC = () => {
  const responders = useAppStore((state) => state.responders);

  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [inviteName, setInviteName] = useState<string>('');
  const [invitePhone, setInvitePhone] = useState<string>('+91 98480 ');
  const [inviteRole, setInviteRole] = useState<ResponderRole>('volunteer');
  const [inviteWard, setInviteWard] = useState<string>('Gachibowli Ward 104');
  const [generatedInviteLink, setGeneratedInviteLink] = useState<string>('');

  const handleApprove = async (id: string) => {
    await approveResponder(id, 'Ramesh V. (HART Coordinator)');
  };

  const handleSuspend = async (id: string) => {
    if (window.confirm('Suspend this responder from emergency dispatches?')) {
      await suspendResponder(id);
    }
  };

  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await inviteResponder({
      name: inviteName,
      phone: invitePhone,
      role: inviteRole,
      ward: inviteWard
    });

    const link = `/responder/join/invite_${created.id}`;
    setGeneratedInviteLink(link);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/admin" className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-700" />
              Responder Directory & Approvals (FR-29)
            </h1>
            <p className="text-xs text-slate-500">
              Approved volunteers, partner clinics, and area coordinators
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setGeneratedInviteLink('');
            setShowInviteModal(true);
          }}
          className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Invite Responder</span>
        </button>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Ward / Area</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Attestations</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {responders.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{r.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{r.phone}</div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="capitalize font-semibold text-slate-700">{r.role}</span>
                  </td>

                  <td className="py-3 px-3 text-slate-600">
                    {r.ward} ({r.radiusKm} km)
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        r.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : r.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : r.status === 'suspended'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <div className="space-y-0.5 text-[10px]">
                      <div className={r.trainingAttested ? 'text-emerald-700' : 'text-slate-400'}>
                        {r.trainingAttested ? '✓ Training confirmed' : '— Training pending'}
                      </div>
                      <div className={r.vaccinatedAttested ? 'text-emerald-700' : 'text-slate-400'}>
                        {r.vaccinatedAttested ? '✓ Rabies vaccine attested' : '— Vaccine pending'}
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-right space-x-2">
                    {r.status === 'pending' && (
                      <button
                        onClick={() => handleApprove(r.id)}
                        className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold text-[11px] transition-colors"
                      >
                        Approve
                      </button>
                    )}

                    {r.status === 'approved' && (
                      <button
                        onClick={() => handleSuspend(r.id)}
                        className="px-2 py-1 text-rose-700 hover:bg-rose-50 rounded-lg font-semibold text-[11px] transition-colors"
                      >
                        Suspend
                      </button>
                    )}

                    {r.status === 'invited' && (
                      <Link
                        href={`/responder/join/invite_${r.id}`}
                        className="text-teal-700 hover:underline font-semibold text-[11px]"
                      >
                        Invite Link →
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h2 className="text-base font-bold text-slate-900">Invite New Volunteer Responder</h2>

            {generatedInviteLink ? (
              <div className="space-y-3">
                <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900">
                  <span className="font-bold block mb-1">Invite link generated:</span>
                  <code className="bg-white p-1 rounded font-mono text-[11px] block break-all">
                    {window.location.origin}{generatedInviteLink}
                  </code>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={generatedInviteLink}
                    className="flex-1 py-2 px-3 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl text-center"
                  >
                    Open Onboarding Link Now (PRD 9.3)
                  </Link>
                  <button
                    onClick={() => setShowInviteModal(false)}
                    className="py-2 px-3 bg-slate-100 rounded-xl text-xs font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateInvite} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="e.g. Vikram Sharma"
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mobile Phone (WhatsApp)</label>
                  <input
                    type="text"
                    value={invitePhone}
                    onChange={(e) => setInvitePhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                  >
                    <option value="volunteer">Volunteer Responder</option>
                    <option value="clinic">Partner Clinic</option>
                    <option value="ngo">NGO Coordinator</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Assigned Ward / Campus Area</label>
                  <input
                    type="text"
                    value={inviteWard}
                    onChange={(e) => setInviteWard(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                    required
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 font-medium text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold"
                  >
                    Generate Invite Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
