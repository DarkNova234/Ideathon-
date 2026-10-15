import { z } from 'zod';

export type CaseState = 'submitted' | 'routing' | 'accepted' | 'closed' | 'escalated_fallback';
export type CaseUrgency = 'injured_now' | 'sick_limping' | 'needs_vaccination';
export type CaseOutcome = 'treated_on_site' | 'transported_clinic' | 'already_vaccinated' | 'not_found' | 'deceased';

export type EventType = 
  | 'submitted'
  | 'offered'
  | 'accepted'
  | 'declined'
  | 'timed_out'
  | 'escalated'
  | 'arrived'
  | 'closed'
  | 'feedback';

export type ResponderRole = 'volunteer' | 'clinic' | 'ngo';
export type ResponderStatus = 'invited' | 'pending' | 'approved' | 'suspended';
export type ResponderChannel = 'whatsapp' | 'sms';

export type UserRole = 'citizen' | 'responder' | 'vet' | 'coordinator' | 'admin';
export type PartnerType = 'vet' | 'ngo';

export interface CaseEvent {
  id: string;
  caseId: string;
  type: EventType;
  responderId?: string | null;
  responderName?: string;
  at: string; // ISO date
  meta?: Record<string, any> | string;
}

export interface CaseFeedback {
  resolved: boolean;
  note?: string;
  createdAt: string;
  flaggedToCoordinator?: boolean;
}

export interface Case {
  id: string;
  secretToken: string;
  state: CaseState;
  urgency: CaseUrgency;
  photoUrl: string;
  lat: number;
  lng: number;
  approxArea: string;
  exactAddress?: string;
  reporterContactId?: string | null;
  reporterPhone?: string; // Anonymized or deleted on closure (FR-34)
  createdAt: string;
  acceptedAt?: string | null;
  closedAt?: string | null;
  outcome?: CaseOutcome | null;
  closeNote?: string;
  closePhotoUrl?: string;
  animalId?: string | null; // linked tagId
  feedback?: CaseFeedback | null;
  assignedResponderId?: string | null;
  currentOfferIndex: number;
  etaMinutes?: number | null;
  arrivedAt?: string | null;
  declinedResponderIds: string[];
  timedOutResponderIds: string[];
}

export interface Responder {
  id: string;
  name: string;
  phone: string;
  role: ResponderRole;
  status: ResponderStatus;
  available: boolean;
  lat: number;
  lng: number;
  radiusKm: number;
  channel: ResponderChannel;
  trainingAttested: boolean;
  vaccinatedAttested: boolean;
  approvedBy?: string | null;
  ward: string;
  activeCaseCount?: number;
}

export interface Partner {
  id: string;
  name: string;
  type: PartnerType;
  verified: boolean;
  registrationNote: string;
  address: string;
  contact: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  partnerId?: string | null;
  responderId?: string | null;
  contact: string;
}

export interface Animal {
  id: string;
  tagId: string; // e.g. "HYD-8492"
  faceUrl: string;
  sideUrl: string;
  markingsUrl: string;
  breedNote: string;
  sex: 'male' | 'female' | 'unknown';
  color: string;
  approxAge: string;
  vaccinated: boolean;
  vaccinationDate?: string;
  lastKnownArea: string;
  lastKnownLat: number;
  lastKnownLng: number;
  createdBy: string; // e.g. "HappyPaws Vet Clinic"
  createdAt: string;
}

export interface AnimalRecord {
  id: string;
  animalId: string; // tagId
  kind: 'treatment' | 'vaccination';
  date: string;
  note: string;
  loggedBy: string;
  clinicOrNgo: string;
  caseId?: string | null;
}

export interface RabiesFlag {
  id: string;
  animalId?: string | null;
  lat: number;
  lng: number;
  areaName: string;
  clinicName: string;
  vetName: string;
  setBy: string;
  setAt: string;
  clearedAt?: string | null;
  clearedBy?: string;
  clearingNote?: string;
}

export interface Settings {
  acceptWindowMinutes: number;
  chainOrder: string[];
  fallbackContact: {
    name: string;
    phone: string;
    office: string;
  };
  demoSpeedMultiplier: number;
  repeatReporterThreshold: number;
}

// Zod Schemas for runtime form validation
export const reportFormSchema = z.object({
  urgency: z.enum(['injured_now', 'sick_limping', 'needs_vaccination']),
  photoUrl: z.string().min(1, 'Please take a photo of the animal'),
  lat: z.number(),
  lng: z.number(),
  approxArea: z.string().min(2, 'Location is required'),
  exactAddress: z.string().optional(),
  phone: z.string().optional(),
  consentAccepted: z.literal(true, {
    message: 'You must accept the privacy and location terms'
  })
});

export type ReportFormData = z.infer<typeof reportFormSchema>;

export const closeCaseSchema = z.object({
  outcome: z.enum(['treated_on_site', 'transported_clinic', 'already_vaccinated', 'not_found', 'deceased']),
  closeNote: z.string().min(5, 'Please provide a brief closing note (at least 5 characters)'),
  closePhotoUrl: z.string().min(1, 'Please attach a photo confirming closure'),
  linkTagId: z.string().optional()
});

export type CloseCaseFormData = z.infer<typeof closeCaseSchema>;

export const animalRegistrationSchema = z.object({
  tagId: z.string().min(3, 'Tag ID is required (e.g. HYD-XXXX)'),
  faceUrl: z.string().min(1, 'Face photo is required'),
  sideUrl: z.string().min(1, 'Side photo is required'),
  markingsUrl: z.string().min(1, 'Distinct markings photo is required'),
  breedNote: z.string().min(2, 'Indie/Breed description is required'),
  sex: z.enum(['male', 'female', 'unknown']),
  color: z.string().min(2, 'Color description is required'),
  approxAge: z.string().min(1, 'Approximate age is required'),
  lastKnownArea: z.string().min(2, 'Area is required'),
  lastKnownLat: z.number(),
  lastKnownLng: z.number(),
  initialTreatmentKind: z.enum(['treatment', 'vaccination']).optional(),
  initialTreatmentNote: z.string().optional(),
  caseId: z.string().optional()
});

export type AnimalRegistrationFormData = z.infer<typeof animalRegistrationSchema>;

export const rabiesFlagSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  areaName: z.string().min(2, 'Area name is required'),
  animalId: z.string().optional(),
  vetName: z.string().min(2, 'Doctor name is required'),
  clinicName: z.string().min(2, 'Clinic name is required'),
  clinicalNotes: z.string().min(10, 'Clinical observations required for rabies confirmation')
});

export type RabiesFlagFormData = z.infer<typeof rabiesFlagSchema>;
