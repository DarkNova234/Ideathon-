import { useAppStore } from '../stores/appStore';
import { RabiesFlag } from '../types';

export async function listRabiesFlags(activeOnly: boolean = true): Promise<RabiesFlag[]> {
  const { rabiesFlags } = useAppStore.getState();
  if (activeOnly) {
    return rabiesFlags.filter((f) => !f.clearedAt);
  }
  return rabiesFlags;
}

export async function setFlag(data: {
  lat: number;
  lng: number;
  areaName: string;
  clinicName: string;
  vetName: string;
  setBy: string;
  animalId?: string;
  notes?: string;
}): Promise<RabiesFlag> {
  const store = useAppStore.getState();
  const id = `flag_${Date.now().toString(36)}`;

  const newFlag: RabiesFlag = {
    id,
    animalId: data.animalId || null,
    lat: data.lat,
    lng: data.lng,
    areaName: data.areaName,
    clinicName: data.clinicName,
    vetName: data.vetName,
    setBy: `${data.vetName} (${data.clinicName})`,
    setAt: new Date().toISOString(),
    clearedAt: null
  };

  store.setRabiesFlags([newFlag, ...store.rabiesFlags]);
  return newFlag;
}

export async function clearFlag(
  flagId: string,
  clearingVet: string,
  clearingNote: string
): Promise<RabiesFlag | null> {
  const store = useAppStore.getState();
  const flag = store.rabiesFlags.find((f) => f.id === flagId);
  if (!flag) return null;

  const updated: RabiesFlag = {
    ...flag,
    clearedAt: new Date().toISOString(),
    clearedBy: clearingVet,
    clearingNote
  };

  store.setRabiesFlags(store.rabiesFlags.map((f) => (f.id === flagId ? updated : f)));
  return updated;
}
