import { Case, CaseEvent, Responder, Partner, User, Animal, AnimalRecord, RabiesFlag, Settings } from '../types';

export const INITIAL_SETTINGS: Settings = {
  acceptWindowMinutes: 10,
  chainOrder: [
    'Nearest Volunteer',
    'Next Nearest Volunteer',
    'Partner Vet Clinic',
    'NGO Coordinator',
    'Municipal Animal Helpline (GHMC)'
  ],
  fallbackContact: {
    name: 'GHMC Animal Control / Blue Cross Hyderabad Helpline',
    phone: '040-23225397 / 1800-425-0033',
    office: 'Greater Hyderabad Municipal Corporation, Veterinary Section'
  },
  demoSpeedMultiplier: 1,
  repeatReporterThreshold: 3
};

export const INITIAL_PARTNERS: Partner[] = [
  {
    id: 'partner_1',
    name: 'HappyPaws Veterinary Clinic',
    type: 'vet',
    verified: true,
    registrationNote: 'State Vet Council Reg #TS-VET-4192, Dr. Priya Sharma',
    address: 'Road No. 36, Jubilee Hills, Hyderabad',
    contact: '+91 98480 34567'
  },
  {
    id: 'partner_2',
    name: 'Hyderabad Animal Rescue Trust (HART)',
    type: 'ngo',
    verified: true,
    registrationNote: 'NGO Reg #HYD-TRUST-8821, Coordinator Ramesh V.',
    address: 'Banjara Hills, Hyderabad',
    contact: '+91 98480 45678'
  }
];

export const INITIAL_RESPONDERS: Responder[] = [
  {
    id: 'resp_1',
    name: 'Rahul Reddy',
    phone: '+91 98480 12345',
    role: 'volunteer',
    status: 'approved',
    available: true,
    lat: 17.4415,
    lng: 78.3495,
    radiusKm: 3.0,
    channel: 'whatsapp',
    trainingAttested: true,
    vaccinatedAttested: true,
    approvedBy: 'Ramesh V. (HART NGO)',
    ward: 'Gachibowli Ward 104'
  },
  {
    id: 'resp_2',
    name: 'Arun Kumar',
    phone: '+91 98480 23456',
    role: 'volunteer',
    status: 'approved',
    available: true,
    lat: 17.4440,
    lng: 78.3550,
    radiusKm: 4.5,
    channel: 'whatsapp',
    trainingAttested: true,
    vaccinatedAttested: true,
    approvedBy: 'Ramesh V. (HART NGO)',
    ward: 'Gachibowli Ward 104'
  },
  {
    id: 'resp_3',
    name: 'HappyPaws Vet Clinic (On-Call)',
    phone: '+91 98480 34567',
    role: 'clinic',
    status: 'approved',
    available: true,
    lat: 17.4320,
    lng: 78.3980,
    radiusKm: 8.0,
    channel: 'whatsapp',
    trainingAttested: true,
    vaccinatedAttested: true,
    approvedBy: 'System Verified',
    ward: 'Jubilee Hills Ward 105'
  },
  {
    id: 'resp_4',
    name: 'Ramesh V. (HART Coordinator)',
    phone: '+91 98480 45678',
    role: 'ngo',
    status: 'approved',
    available: true,
    lat: 17.4150,
    lng: 78.4350,
    radiusKm: 12.0,
    channel: 'whatsapp',
    trainingAttested: true,
    vaccinatedAttested: true,
    approvedBy: 'Admin',
    ward: 'Central Hyderabad'
  },
  {
    id: 'resp_5',
    name: 'Sneha Patel',
    phone: '+91 98480 56789',
    role: 'volunteer',
    status: 'pending',
    available: false,
    lat: 17.4480,
    lng: 78.3620,
    radiusKm: 3.0,
    channel: 'whatsapp',
    trainingAttested: true,
    vaccinatedAttested: true,
    approvedBy: null,
    ward: 'Kondapur / Hitec City'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user_citizen',
    name: 'Citizen Reporter',
    role: 'citizen',
    contact: '+91 98480 00000'
  },
  {
    id: 'user_responder_1',
    name: 'Rahul Reddy',
    role: 'responder',
    responderId: 'resp_1',
    contact: '+91 98480 12345'
  },
  {
    id: 'user_responder_2',
    name: 'Arun Kumar',
    role: 'responder',
    responderId: 'resp_2',
    contact: '+91 98480 23456'
  },
  {
    id: 'user_vet',
    name: 'Dr. Priya Sharma',
    role: 'vet',
    partnerId: 'partner_1',
    responderId: 'resp_3',
    contact: '+91 98480 34567'
  },
  {
    id: 'user_coordinator',
    name: 'Ramesh V.',
    role: 'coordinator',
    partnerId: 'partner_2',
    responderId: 'resp_4',
    contact: '+91 98480 45678'
  },
  {
    id: 'user_admin',
    name: 'StraySafe Pilot Administrator',
    role: 'admin',
    contact: 'admin@straysafe.org'
  }
];

// Placeholder high-quality SVG data URIs for mock dog images
const DOG_IMG_1 = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300' fill='%23f1f5f9'><rect width='400' height='300' fill='%23e2e8f0'/><circle cx='200' cy='130' r='60' fill='%23b45309'/><circle cx='180' cy='120' r='8' fill='%231e293b'/><circle cx='220' cy='120' r='8' fill='%231e293b'/><ellipse cx='200' cy='145' rx='16' ry='10' fill='%230f172a'/><polygon points='145,85 170,120 135,130' fill='%2392400e'/><polygon points='255,85 230,120 265,130' fill='%2392400e'/><path d='M150,210 Q200,240 250,210 L270,300 L130,300 Z' fill='%23b45309'/><text x='200' y='280' font-family='sans-serif' font-size='14' fill='%23475569' text-anchor='middle'>Brown Indie Dog (Sample Mock Photo)</text></svg>";

const DOG_IMG_2 = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300' fill='%23f1f5f9'><rect width='400' height='300' fill='%23cbd5e1'/><circle cx='200' cy='130' r='60' fill='%23d97706'/><circle cx='180' cy='120' r='8' fill='%231e293b'/><circle cx='220' cy='120' r='8' fill='%231e293b'/><ellipse cx='200' cy='145' rx='14' ry='9' fill='%230f172a'/><path d='M185,155 Q200,165 215,155' stroke='%230f172a' stroke-width='3' fill='none'/><polygon points='140,80 165,115 130,125' fill='%23b45309'/><polygon points='260,80 235,115 270,125' fill='%23b45309'/><text x='200' y='280' font-family='sans-serif' font-size='14' fill='%23334155' text-anchor='middle'>Tan Indie - Street Dog Tagged HYD-8492</text></svg>";

const DOG_IMG_3 = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300' fill='%23f8fafc'><rect width='400' height='300' fill='%23e2e8f0'/><circle cx='200' cy='130' r='55' fill='%23475569'/><circle cx='185' cy='120' r='6' fill='%230f172a'/><circle cx='215' cy='120' r='6' fill='%230f172a'/><ellipse cx='200' cy='140' rx='12' ry='8' fill='%230f172a'/><text x='200' y='280' font-family='sans-serif' font-size='14' fill='%23334155' text-anchor='middle'>Black & Tan Pup (Sample Photo)</text></svg>";

export const INITIAL_ANIMALS: Animal[] = [
  {
    id: 'anim_1',
    tagId: 'HYD-8492',
    faceUrl: DOG_IMG_2,
    sideUrl: DOG_IMG_1,
    markingsUrl: DOG_IMG_3,
    breedNote: 'Indian Pariah (Indie), Tan coat with white chest patch',
    sex: 'male',
    color: 'Tan & White',
    approxAge: '3 years',
    vaccinated: true,
    vaccinationDate: '2026-08-14',
    lastKnownArea: 'DLF Cybercity Gate 2, Gachibowli, Hyderabad',
    lastKnownLat: 17.4438,
    lastKnownLng: 78.3555,
    createdBy: 'HappyPaws Veterinary Clinic',
    createdAt: '2026-08-14T11:20:00Z'
  },
  {
    id: 'anim_2',
    tagId: 'HYD-5104',
    faceUrl: DOG_IMG_1,
    sideUrl: DOG_IMG_2,
    markingsUrl: DOG_IMG_3,
    breedNote: 'Indie mix, Brindle coat with floppy ears',
    sex: 'female',
    color: 'Brown Brindle',
    approxAge: '2 years',
    vaccinated: true,
    vaccinationDate: '2026-09-02',
    lastKnownArea: 'Gachibowli Stadium Inner Circle',
    lastKnownLat: 17.4402,
    lastKnownLng: 78.3485,
    createdBy: 'Hyderabad Animal Rescue Trust (HART)',
    createdAt: '2026-09-02T14:45:00Z'
  }
];

export const INITIAL_ANIMAL_RECORDS: AnimalRecord[] = [
  {
    id: 'rec_1',
    animalId: 'HYD-8492',
    kind: 'vaccination',
    date: '2026-08-14',
    note: 'Annual Anti-Rabies Vaccine (Nobivac Rabies 1ml SC) administered. Healthy condition.',
    loggedBy: 'Dr. Priya Sharma (HappyPaws Clinic)',
    clinicOrNgo: 'HappyPaws Veterinary Clinic',
    caseId: null
  },
  {
    id: 'rec_2',
    animalId: 'HYD-8492',
    kind: 'treatment',
    date: '2026-09-18',
    note: 'Superficial paw laceration cleaned with Betadine, antibiotic topical spray applied.',
    loggedBy: 'Arun Kumar (Trained Volunteer)',
    clinicOrNgo: 'HART Volunteer Network',
    caseId: 'case_past_1'
  },
  {
    id: 'rec_3',
    animalId: 'HYD-5104',
    kind: 'vaccination',
    date: '2026-09-02',
    note: 'Sterilization recovery checked + Anti-Rabies Booster administered. Ear notched (right).',
    loggedBy: 'Dr. Ramesh / HART Vet Team',
    clinicOrNgo: 'HART NGO',
    caseId: null
  }
];

export const INITIAL_RABIES_FLAGS: RabiesFlag[] = [
  {
    id: 'flag_1',
    animalId: null,
    lat: 17.4310,
    lng: 78.4070,
    areaName: 'Jubilee Hills Road 36 / Metro Pillar 1640',
    clinicName: 'HappyPaws Veterinary Clinic',
    vetName: 'Dr. Priya Sharma',
    setBy: 'Dr. Priya Sharma (Reg #TS-VET-4192)',
    setAt: '2026-10-12T10:30:00Z',
    clearedAt: null
  }
];

export const INITIAL_CASES: Case[] = [
  {
    id: 'case_demo_1',
    secretToken: 'tok_demo_1',
    state: 'routing',
    urgency: 'injured_now',
    photoUrl: DOG_IMG_1,
    lat: 17.4410,
    lng: 78.3490,
    approxArea: 'Near Gachibowli Stadium Main Gate, Hyderabad',
    exactAddress: 'Beside Pillar #14, Service Road, Gachibowli Stadium',
    reporterContactId: 'rep_1',
    reporterPhone: '+91 98480 88888',
    createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    assignedResponderId: 'resp_1',
    currentOfferIndex: 0,
    declinedResponderIds: [],
    timedOutResponderIds: []
  },
  {
    id: 'case_demo_2',
    secretToken: 'tok_demo_2',
    state: 'accepted',
    urgency: 'sick_limping',
    photoUrl: DOG_IMG_2,
    lat: 17.4445,
    lng: 78.3555,
    approxArea: 'DLF Cybercity Gate 3, Gachibowli',
    exactAddress: 'Near food truck lane, DLF IT Park',
    reporterContactId: 'rep_2',
    reporterPhone: '+91 98480 77777',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    acceptedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    assignedResponderId: 'resp_2',
    currentOfferIndex: 1,
    etaMinutes: 15,
    declinedResponderIds: ['resp_1'],
    timedOutResponderIds: []
  },
  {
    id: 'case_past_1',
    secretToken: 'tok_past_1',
    state: 'closed',
    urgency: 'injured_now',
    photoUrl: DOG_IMG_3,
    lat: 17.4438,
    lng: 78.3555,
    approxArea: 'DLF Cybercity Outer Ring Road',
    createdAt: '2026-10-14T09:15:00Z',
    acceptedAt: '2026-10-14T09:22:00Z',
    closedAt: '2026-10-14T09:55:00Z',
    outcome: 'treated_on_site',
    closeNote: 'Minor paw wound cleaned and dressed with antiseptic. Dog is alert and eating.',
    closePhotoUrl: DOG_IMG_1,
    animalId: 'HYD-8492',
    feedback: {
      resolved: true,
      note: 'Volunteer Arun arrived in 15 mins. Dog was calm and treated gently. Thank you!',
      createdAt: '2026-10-14T10:10:00Z'
    },
    assignedResponderId: 'resp_2',
    currentOfferIndex: 0,
    declinedResponderIds: [],
    timedOutResponderIds: []
  }
];

export const INITIAL_CASE_EVENTS: CaseEvent[] = [
  {
    id: 'evt_1',
    caseId: 'case_demo_1',
    type: 'submitted',
    at: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    meta: 'Report submitted by citizen anonymously'
  },
  {
    id: 'evt_2',
    caseId: 'case_demo_1',
    type: 'offered',
    responderId: 'resp_1',
    responderName: 'Rahul Reddy',
    at: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    meta: 'Dispatched to nearest volunteer (0.2 km away)'
  },
  {
    id: 'evt_3',
    caseId: 'case_demo_2',
    type: 'submitted',
    at: new Date(Date.now() - 25 * 60 * 1000).toISOString()
  },
  {
    id: 'evt_4',
    caseId: 'case_demo_2',
    type: 'offered',
    responderId: 'resp_1',
    responderName: 'Rahul Reddy',
    at: new Date(Date.now() - 25 * 60 * 1000).toISOString()
  },
  {
    id: 'evt_5',
    caseId: 'case_demo_2',
    type: 'declined',
    responderId: 'resp_1',
    responderName: 'Rahul Reddy',
    at: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
    meta: 'Responder busy with personal work'
  },
  {
    id: 'evt_6',
    caseId: 'case_demo_2',
    type: 'escalated',
    at: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
    meta: 'Auto-escalated to next nearest volunteer Arun Kumar'
  },
  {
    id: 'evt_7',
    caseId: 'case_demo_2',
    type: 'accepted',
    responderId: 'resp_2',
    responderName: 'Arun Kumar',
    at: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    meta: 'Accepted with 15 mins ETA'
  }
];
