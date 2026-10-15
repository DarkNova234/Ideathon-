import { useAppStore } from '../stores/appStore';
import { Responder, ResponderRole, ResponderStatus } from '../types';

export async function listResponders(filter?: { status?: ResponderStatus; role?: ResponderRole }): Promise<Responder[]> {
  const { responders } = useAppStore.getState();
  return responders.filter((r) => {
    if (filter?.status && r.status !== filter.status) return false;
    if (filter?.role && r.role !== filter.role) return false;
    return true;
  });
}

export async function getResponder(id: string): Promise<Responder | null> {
  const { responders } = useAppStore.getState();
  return responders.find((r) => r.id === id) || null;
}

export async function approveResponder(id: string, approvedBy: string, ward?: string): Promise<Responder | null> {
  const store = useAppStore.getState();
  const r = store.responders.find((item) => item.id === id);
  if (!r) return null;

  const updated: Responder = {
    ...r,
    status: 'approved',
    available: true,
    approvedBy,
    ward: ward || r.ward
  };

  store.setResponders(store.responders.map((item) => (item.id === id ? updated : item)));
  return updated;
}

export async function suspendResponder(id: string): Promise<Responder | null> {
  const store = useAppStore.getState();
  const r = store.responders.find((item) => item.id === id);
  if (!r) return null;

  const updated: Responder = {
    ...r,
    status: 'suspended',
    available: false
  };

  store.setResponders(store.responders.map((item) => (item.id === id ? updated : item)));
  return updated;
}

export async function updateResponderAvailability(id: string, available: boolean): Promise<Responder | null> {
  const store = useAppStore.getState();
  const r = store.responders.find((item) => item.id === id);
  if (!r) return null;

  const updated: Responder = {
    ...r,
    available
  };

  store.setResponders(store.responders.map((item) => (item.id === id ? updated : item)));
  return updated;
}

export async function inviteResponder(data: {
  name: string;
  phone: string;
  role: ResponderRole;
  ward: string;
  radiusKm?: number;
}): Promise<Responder> {
  const store = useAppStore.getState();
  const id = `resp_${Date.now().toString(36)}`;

  const newResponder: Responder = {
    id,
    name: data.name,
    phone: data.phone,
    role: data.role,
    status: 'invited',
    available: false,
    lat: 17.442 + (Math.random() - 0.5) * 0.02,
    lng: 78.35 + (Math.random() - 0.5) * 0.02,
    radiusKm: data.radiusKm || 3.0,
    channel: 'whatsapp',
    trainingAttested: false,
    vaccinatedAttested: false,
    ward: data.ward
  };

  store.setResponders([newResponder, ...store.responders]);
  return newResponder;
}

export async function completeVolunteerOnboarding(id: string): Promise<Responder | null> {
  const store = useAppStore.getState();
  const r = store.responders.find((item) => item.id === id);
  if (!r) return null;

  const updated: Responder = {
    ...r,
    status: 'pending',
    trainingAttested: true,
    vaccinatedAttested: true
  };

  store.setResponders(store.responders.map((item) => (item.id === id ? updated : item)));
  return updated;
}
