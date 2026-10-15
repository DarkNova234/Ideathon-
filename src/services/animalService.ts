import { useAppStore } from '../stores/appStore';
import { Animal, AnimalRecord, AnimalRegistrationFormData } from '../types';

export async function getAnimal(tagId: string): Promise<Animal | null> {
  const { animals } = useAppStore.getState();
  return animals.find((a) => a.tagId.toUpperCase() === tagId.toUpperCase() || a.id === tagId) || null;
}

export async function listAnimals(): Promise<Animal[]> {
  const { animals } = useAppStore.getState();
  return animals;
}

export async function createAnimal(
  data: AnimalRegistrationFormData,
  loggedByUser: string,
  clinicOrNgo: string
): Promise<Animal> {
  const store = useAppStore.getState();
  const id = `anim_${Date.now().toString(36)}`;
  const tagId = data.tagId.toUpperCase();

  const newAnimal: Animal = {
    id,
    tagId,
    faceUrl: data.faceUrl,
    sideUrl: data.sideUrl,
    markingsUrl: data.markingsUrl,
    breedNote: data.breedNote,
    sex: data.sex,
    color: data.color,
    approxAge: data.approxAge,
    vaccinated: data.initialTreatmentKind === 'vaccination',
    vaccinationDate: data.initialTreatmentKind === 'vaccination' ? new Date().toISOString().split('T')[0] : undefined,
    lastKnownArea: data.lastKnownArea,
    lastKnownLat: data.lastKnownLat,
    lastKnownLng: data.lastKnownLng,
    createdBy: clinicOrNgo,
    createdAt: new Date().toISOString()
  };

  const newRecords: AnimalRecord[] = [];
  if (data.initialTreatmentKind && data.initialTreatmentNote) {
    newRecords.push({
      id: `rec_${Date.now()}`,
      animalId: tagId,
      kind: data.initialTreatmentKind,
      date: new Date().toISOString().split('T')[0],
      note: data.initialTreatmentNote,
      loggedBy: loggedByUser,
      clinicOrNgo,
      caseId: data.caseId || null
    });
  }

  // If this came from a case, also link it back to that case
  if (data.caseId) {
    const updatedCases = store.cases.map((c) => (c.id === data.caseId ? { ...c, animalId: tagId } : c));
    store.setCases(updatedCases);
  }

  store.setAnimals([newAnimal, ...store.animals]);
  if (newRecords.length > 0) {
    store.setAnimalRecords([...newRecords, ...store.animalRecords]);
  }

  return newAnimal;
}

export async function updateAnimal(tagId: string, updates: Partial<Animal>): Promise<Animal | null> {
  const store = useAppStore.getState();
  const animal = store.animals.find((a) => a.tagId.toUpperCase() === tagId.toUpperCase());
  if (!animal) return null;

  const updated: Animal = {
    ...animal,
    ...updates
  };

  store.setAnimals(store.animals.map((a) => (a.tagId.toUpperCase() === tagId.toUpperCase() ? updated : a)));
  return updated;
}

export async function addAnimalRecord(
  tagId: string,
  kind: 'treatment' | 'vaccination',
  note: string,
  loggedBy: string,
  clinicOrNgo: string,
  caseId?: string
): Promise<AnimalRecord> {
  const store = useAppStore.getState();
  const newRecord: AnimalRecord = {
    id: `rec_${Date.now()}`,
    animalId: tagId.toUpperCase(),
    kind,
    date: new Date().toISOString().split('T')[0],
    note,
    loggedBy,
    clinicOrNgo,
    caseId: caseId || null
  };

  const updatedRecords = [newRecord, ...store.animalRecords];
  store.setAnimalRecords(updatedRecords);

  if (kind === 'vaccination') {
    const animal = store.animals.find((a) => a.tagId.toUpperCase() === tagId.toUpperCase());
    if (animal) {
      const updatedAnimal: Animal = {
        ...animal,
        vaccinated: true,
        vaccinationDate: newRecord.date
      };
      store.setAnimals(store.animals.map((a) => (a.tagId.toUpperCase() === tagId.toUpperCase() ? updatedAnimal : a)));
    }
  }

  return newRecord;
}

export async function getAnimalRecords(tagId: string): Promise<AnimalRecord[]> {
  const { animalRecords } = useAppStore.getState();
  return animalRecords.filter((r) => r.animalId.toUpperCase() === tagId.toUpperCase());
}
