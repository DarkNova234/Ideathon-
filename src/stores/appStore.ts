import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Case,
  CaseEvent,
  Responder,
  Partner,
  Animal,
  AnimalRecord,
  RabiesFlag,
  Settings,
  UserRole
} from '../types';
import {
  INITIAL_CASES,
  INITIAL_CASE_EVENTS,
  INITIAL_RESPONDERS,
  INITIAL_PARTNERS,
  INITIAL_ANIMALS,
  INITIAL_ANIMAL_RECORDS,
  INITIAL_RABIES_FLAGS,
  INITIAL_SETTINGS
} from '../mocks/fixtures';
import { Language } from '../messages';

interface AppState {
  cases: Case[];
  events: CaseEvent[];
  responders: Responder[];
  partners: Partner[];
  animals: Animal[];
  animalRecords: AnimalRecord[];
  rabiesFlags: RabiesFlag[];
  settings: Settings;
  
  // App navigation and role
  currentRole: UserRole;
  currentResponderId: string; // Active responder persona when testing responder flows
  language: Language;
  myReportIds: string[]; // device-local stored case IDs (FR-10)
  firstRunSafetyAccepted: boolean;
  demoMode: boolean;
  lastSimulatedCaseId: string | null;

  // Actions
  setRole: (role: UserRole) => void;
  setCurrentResponderId: (id: string) => void;
  setLanguage: (lang: Language) => void;
  setFirstRunSafetyAccepted: (val: boolean) => void;
  setDemoMode: (val: boolean) => void;
  setDemoSpeedMultiplier: (multiplier: number) => void;
  addMyReportId: (caseId: string) => void;
  setLastSimulatedCaseId: (caseId: string | null) => void;

  // Direct state setters used by services
  setCases: (cases: Case[]) => void;
  setEvents: (events: CaseEvent[]) => void;
  setResponders: (responders: Responder[]) => void;
  setAnimals: (animals: Animal[]) => void;
  setAnimalRecords: (records: AnimalRecord[]) => void;
  setRabiesFlags: (flags: RabiesFlag[]) => void;
  setSettings: (settings: Settings) => void;

  // Reset to initial fixtures
  resetAllData: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      cases: INITIAL_CASES,
      events: INITIAL_CASE_EVENTS,
      responders: INITIAL_RESPONDERS,
      partners: INITIAL_PARTNERS,
      animals: INITIAL_ANIMALS,
      animalRecords: INITIAL_ANIMAL_RECORDS,
      rabiesFlags: INITIAL_RABIES_FLAGS,
      settings: INITIAL_SETTINGS,

      currentRole: 'citizen',
      currentResponderId: 'resp_2', // Default to Arun Kumar (Volunteer)
      language: 'en',
      myReportIds: ['case_demo_1', 'case_past_1'],
      firstRunSafetyAccepted: false,
      demoMode: true,
      lastSimulatedCaseId: 'case_demo_1',

      setRole: (role) => set({ currentRole: role }),
      setCurrentResponderId: (id) => set({ currentResponderId: id }),
      setLanguage: (language) => set({ language }),
      setFirstRunSafetyAccepted: (firstRunSafetyAccepted) => set({ firstRunSafetyAccepted }),
      setDemoMode: (demoMode) => set({ demoMode }),
      setDemoSpeedMultiplier: (multiplier) =>
        set((state) => ({
          settings: { ...state.settings, demoSpeedMultiplier: multiplier }
        })),
      addMyReportId: (caseId) =>
        set((state) => ({
          myReportIds: state.myReportIds.includes(caseId)
            ? state.myReportIds
            : [caseId, ...state.myReportIds]
        })),
      setLastSimulatedCaseId: (lastSimulatedCaseId) => set({ lastSimulatedCaseId }),

      setCases: (cases) => set({ cases }),
      setEvents: (events) => set({ events }),
      setResponders: (responders) => set({ responders }),
      setAnimals: (animals) => set({ animals }),
      setAnimalRecords: (animalRecords) => set({ animalRecords }),
      setRabiesFlags: (rabiesFlags) => set({ rabiesFlags }),
      setSettings: (settings) => set({ settings }),

      resetAllData: () =>
        set({
          cases: INITIAL_CASES,
          events: INITIAL_CASE_EVENTS,
          responders: INITIAL_RESPONDERS,
          partners: INITIAL_PARTNERS,
          animals: INITIAL_ANIMALS,
          animalRecords: INITIAL_ANIMAL_RECORDS,
          rabiesFlags: INITIAL_RABIES_FLAGS,
          settings: INITIAL_SETTINGS,
          myReportIds: ['case_demo_1', 'case_past_1'],
          currentRole: 'citizen',
          currentResponderId: 'resp_2',
          lastSimulatedCaseId: 'case_demo_1'
        })
    }),
    {
      name: 'straysafe-storage-v1'
    }
  )
);
