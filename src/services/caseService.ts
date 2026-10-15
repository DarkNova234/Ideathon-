import { useAppStore } from '../stores/appStore';
import { Case, CaseEvent, CaseOutcome, CaseState, ReportFormData, Responder } from '../types';

// Helper to calculate distance in kilometers between two lat/lng coordinates (Haversine formula)
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function getRankedResponders(lat: number, lng: number, excludeIds: string[] = []): Responder[] {
  const { responders } = useAppStore.getState();
  return responders
    .filter((r) => r.status === 'approved' && r.available && !excludeIds.includes(r.id))
    .sort((a, b) => {
      const distA = calculateDistanceKm(lat, lng, a.lat, a.lng);
      const distB = calculateDistanceKm(lat, lng, b.lat, b.lng);
      return distA - distB;
    });
}

export async function createCase(data: ReportFormData): Promise<Case> {
  const store = useAppStore.getState();
  const caseId = `case_${Date.now().toString(36)}`;
  const secretToken = `tok_${Math.random().toString(36).substring(2, 9)}`;

  // Find nearest available responder
  const candidates = getRankedResponders(data.lat, data.lng);
  const assigned = candidates[0] || null;

  const newCase: Case = {
    id: caseId,
    secretToken,
    state: 'routing',
    urgency: data.urgency,
    photoUrl: data.photoUrl,
    lat: data.lat,
    lng: data.lng,
    approxArea: data.approxArea,
    exactAddress: data.exactAddress || data.approxArea,
    reporterPhone: data.phone || undefined,
    reporterContactId: data.phone ? `rep_${Date.now()}` : null,
    createdAt: new Date().toISOString(),
    assignedResponderId: assigned ? assigned.id : null,
    currentOfferIndex: 0,
    declinedResponderIds: [],
    timedOutResponderIds: []
  };

  const newEvents: CaseEvent[] = [
    {
      id: `evt_${Date.now()}_sub`,
      caseId,
      type: 'submitted',
      at: new Date().toISOString(),
      meta: 'Incident report submitted by citizen'
    }
  ];

  if (assigned) {
    const dist = calculateDistanceKm(data.lat, data.lng, assigned.lat, assigned.lng);
    newEvents.push({
      id: `evt_${Date.now()}_off`,
      caseId,
      type: 'offered',
      responderId: assigned.id,
      responderName: assigned.name,
      at: new Date().toISOString(),
      meta: `Dispatched to nearest responder (${dist} km away)`
    });
  } else {
    // Escalate to fallback immediately if no responders available
    newCase.state = 'escalated_fallback';
    newEvents.push({
      id: `evt_${Date.now()}_esc`,
      caseId,
      type: 'escalated',
      at: new Date().toISOString(),
      meta: 'No local volunteers available. Auto-escalated to Municipal Helpline (GHMC).'
    });
  }

  store.setCases([newCase, ...store.cases]);
  store.setEvents([...newEvents, ...store.events]);
  store.addMyReportId(caseId);
  store.setLastSimulatedCaseId(caseId);

  return newCase;
}

export async function getCase(id: string): Promise<Case | null> {
  const { cases } = useAppStore.getState();
  return cases.find((c) => c.id === id) || null;
}

export async function getCaseByToken(token: string): Promise<Case | null> {
  const { cases } = useAppStore.getState();
  return cases.find((c) => c.secretToken === token || c.id === token) || null;
}

export async function acceptCase(caseId: string, responderId: string, etaMinutes: number): Promise<Case | null> {
  const store = useAppStore.getState();
  const c = store.cases.find((item) => item.id === caseId);
  if (!c) return null;

  const responder = store.responders.find((r) => r.id === responderId);

  const updated: Case = {
    ...c,
    state: 'accepted',
    assignedResponderId: responderId,
    acceptedAt: new Date().toISOString(),
    etaMinutes: etaMinutes || 15
  };

  const event: CaseEvent = {
    id: `evt_${Date.now()}`,
    caseId,
    type: 'accepted',
    responderId,
    responderName: responder ? responder.name : 'Responder',
    at: new Date().toISOString(),
    meta: `Accepted with ${etaMinutes} mins ETA`
  };

  store.setCases(store.cases.map((item) => (item.id === caseId ? updated : item)));
  store.setEvents([event, ...store.events]);

  return updated;
}

export async function declineCase(caseId: string, responderId: string, reason?: string): Promise<Case | null> {
  const store = useAppStore.getState();
  const c = store.cases.find((item) => item.id === caseId);
  if (!c) return null;

  const responder = store.responders.find((r) => r.id === responderId);
  const declinedList = [...c.declinedResponderIds, responderId];

  // Log decline event
  const declineEvent: CaseEvent = {
    id: `evt_${Date.now()}_dec`,
    caseId,
    type: 'declined',
    responderId,
    responderName: responder ? responder.name : 'Responder',
    at: new Date().toISOString(),
    meta: reason || 'Responder declined or unavailable'
  };

  // Find next candidate responder
  const candidates = getRankedResponders(c.lat, c.lng, [...declinedList, ...c.timedOutResponderIds]);
  const nextResponder = candidates[0] || null;

  let updatedState: CaseState = c.state;
  let nextOfferIndex = c.currentOfferIndex + 1;
  const newEvents = [declineEvent];

  if (nextResponder) {
    const dist = calculateDistanceKm(c.lat, c.lng, nextResponder.lat, nextResponder.lng);
    newEvents.push({
      id: `evt_${Date.now()}_off`,
      caseId,
      type: 'offered',
      responderId: nextResponder.id,
      responderName: nextResponder.name,
      at: new Date().toISOString(),
      meta: `Escalated to next responder (${dist} km away)`
    });
  } else {
    // Chain exhausted -> fallback
    updatedState = 'escalated_fallback';
    newEvents.push({
      id: `evt_${Date.now()}_esc`,
      caseId,
      type: 'escalated',
      at: new Date().toISOString(),
      meta: 'Responder chain exhausted. Escalated to Municipal Animal Helpline (GHMC).'
    });
  }

  const updated: Case = {
    ...c,
    state: updatedState,
    declinedResponderIds: declinedList,
    assignedResponderId: nextResponder ? nextResponder.id : null,
    currentOfferIndex: nextOfferIndex
  };

  store.setCases(store.cases.map((item) => (item.id === caseId ? updated : item)));
  store.setEvents([...newEvents, ...store.events]);

  return updated;
}

export async function timeoutCase(caseId: string): Promise<Case | null> {
  const store = useAppStore.getState();
  const c = store.cases.find((item) => item.id === caseId);
  if (!c || c.state !== 'routing') return null;

  const currentResponderId = c.assignedResponderId;
  const currentResponder = store.responders.find((r) => r.id === currentResponderId);
  const timedOutList = currentResponderId ? [...c.timedOutResponderIds, currentResponderId] : c.timedOutResponderIds;

  // Log timeout event
  const timeoutEvent: CaseEvent = {
    id: `evt_${Date.now()}_to`,
    caseId,
    type: 'timed_out',
    responderId: currentResponderId,
    responderName: currentResponder ? currentResponder.name : 'Responder',
    at: new Date().toISOString(),
    meta: 'No acceptance within 10-minute window'
  };

  // Find next candidate
  const candidates = getRankedResponders(c.lat, c.lng, [...c.declinedResponderIds, ...timedOutList]);
  const nextResponder = candidates[0] || null;

  let updatedState: CaseState = c.state;
  let nextOfferIndex = c.currentOfferIndex + 1;
  const newEvents = [timeoutEvent];

  if (nextResponder) {
    const dist = calculateDistanceKm(c.lat, c.lng, nextResponder.lat, nextResponder.lng);
    newEvents.push({
      id: `evt_${Date.now()}_off`,
      caseId,
      type: 'offered',
      responderId: nextResponder.id,
      responderName: nextResponder.name,
      at: new Date().toISOString(),
      meta: `Auto-escalated to next nearest responder (${dist} km away)`
    });
  } else {
    updatedState = 'escalated_fallback';
    newEvents.push({
      id: `evt_${Date.now()}_esc`,
      caseId,
      type: 'escalated',
      at: new Date().toISOString(),
      meta: 'Volunteer chain exhausted. Escalated to Municipal Animal Helpline.'
    });
  }

  const updated: Case = {
    ...c,
    state: updatedState,
    timedOutResponderIds: timedOutList,
    assignedResponderId: nextResponder ? nextResponder.id : null,
    currentOfferIndex: nextOfferIndex
  };

  store.setCases(store.cases.map((item) => (item.id === caseId ? updated : item)));
  store.setEvents([...newEvents, ...store.events]);

  return updated;
}

export async function markArrived(caseId: string, responderId: string): Promise<Case | null> {
  const store = useAppStore.getState();
  const c = store.cases.find((item) => item.id === caseId);
  if (!c) return null;

  const responder = store.responders.find((r) => r.id === responderId);

  const updated: Case = {
    ...c,
    arrivedAt: new Date().toISOString()
  };

  const event: CaseEvent = {
    id: `evt_${Date.now()}_arr`,
    caseId,
    type: 'arrived',
    responderId,
    responderName: responder ? responder.name : 'Responder',
    at: new Date().toISOString(),
    meta: 'Responder marked arrival on scene'
  };

  store.setCases(store.cases.map((item) => (item.id === caseId ? updated : item)));
  store.setEvents([event, ...store.events]);

  return updated;
}

export async function closeCase(
  caseId: string,
  responderId: string,
  outcome: CaseOutcome,
  closeNote: string,
  closePhotoUrl: string,
  linkAnimalId?: string
): Promise<Case | null> {
  const store = useAppStore.getState();
  const c = store.cases.find((item) => item.id === caseId);
  if (!c) return null;

  const responder = store.responders.find((r) => r.id === responderId);

  // FR-34: Anonymize or delete phone numbers upon case close
  const updated: Case = {
    ...c,
    state: 'closed',
    closedAt: new Date().toISOString(),
    outcome,
    closeNote,
    closePhotoUrl,
    animalId: linkAnimalId || c.animalId || null,
    reporterPhone: c.reporterPhone ? '***-***-**** (Anonymized)' : undefined
  };

  const event: CaseEvent = {
    id: `evt_${Date.now()}_close`,
    caseId,
    type: 'closed',
    responderId,
    responderName: responder ? responder.name : 'Responder',
    at: new Date().toISOString(),
    meta: `Outcome: ${outcome}. Note: ${closeNote}`
  };

  store.setCases(store.cases.map((item) => (item.id === caseId ? updated : item)));
  store.setEvents([event, ...store.events]);

  return updated;
}

export async function submitFeedback(caseId: string, resolved: boolean, note?: string): Promise<Case | null> {
  const store = useAppStore.getState();
  const c = store.cases.find((item) => item.id === caseId);
  if (!c) return null;

  // OQ-2 & FR-9: "not resolved" flags the case to the coordinator but does not reopen it
  const updated: Case = {
    ...c,
    feedback: {
      resolved,
      note: note || undefined,
      createdAt: new Date().toISOString(),
      flaggedToCoordinator: !resolved
    }
  };

  const event: CaseEvent = {
    id: `evt_${Date.now()}_fb`,
    caseId,
    type: 'feedback',
    at: new Date().toISOString(),
    meta: resolved
      ? 'Citizen confirmed case resolved'
      : `Citizen noted NOT resolved: "${note || 'No notes'}". Flagged to NGO coordinator.`
  };

  store.setCases(store.cases.map((item) => (item.id === caseId ? updated : item)));
  store.setEvents([event, ...store.events]);

  return updated;
}

export function getCaseEvents(caseId: string): CaseEvent[] {
  const { events } = useAppStore.getState();
  return events.filter((e) => e.caseId === caseId).sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
}
