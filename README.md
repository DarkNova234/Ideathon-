# StraySafe · Clickable Prototype

A mobile-first front-end prototype of **StraySafe** built from the Product Requirements Document (PRD v1) for the E-Cell x AIESEC Ideathon (SDG track).

StraySafe connects ordinary citizens who spot an injured or unvaccinated stray dog with nearby trained volunteers, veterinary clinics, and NGOs through an assured escalation chain that guarantees no case stalls on one person.

---

## 🚀 The End-to-End Demo Path (Judging Script)

You can walk a judge through the entire StraySafe loop in under 2 minutes:

1. **Citizen Report (`/report`)**:
   - Open `/` (Landing page) or tap **Report** in the navigation.
   - Select UI language from the top bar (English, Telugu, Hindi).
   - Dismiss or review the initial **Safety Card** (*"Stay a safe distance. Do not touch the animal"*).
   - Select urgency level (e.g., *Injured Now*), capture/choose camera snapshot, and detect GPS location (or adjust the manual pin).
   - Review the optional phone and privacy consent line, then tap **🚨 Submit Report**.

2. **Case Tracking & Assured Escalation (`/case/[id]`)**:
   - You land on the secret-token case tracking page showing the live state: `Routing to Responders`.
   - The nearest volunteer (*Rahul Reddy, 0.2 km away*) is contacted with a 10-minute accept window.
   - **Demo Acceleration**: Tap the **"Skip wait"** button or use the **10x / 30x** clock control in the top Demo Bar to trigger timeout.
   - The case automatically auto-escalates to the second volunteer (*Arun Kumar, 1.1 km away*).

3. **WhatsApp Dispatch Simulator (`/dev/whatsapp` or `/r/[token]`)**:
   - Tap **"WhatsApp Sim"** in the top Demo Bar or the banner link on the case page.
   - See the real simulated WhatsApp notification with animal photo, distance in km, map landmark, and Accept/Decline actions.
   - Tap **Accept & Set ETA** and pick **15 mins**.
   - Notice the citizen's case tracking page instantly updates to: *"Help is on the way! (15 mins ETA)"*.

4. **Arrive & Close Case (`/r/[token]/close`)**:
   - In `/r/[token]`, tap **Mark Arrived on Scene**.
   - Tap **Complete & Close Case**.
   - Select rescue outcome (*Treated on site*), enter field notes, review closure photo, and submit.
   - The citizen's tracking page updates to **Resolved & Closed** and displays the **"Was this resolved?"** citizen feedback prompt at `/case/[id]/feedback`.

5. **Animal QR Record (`/animal/[tagId]`)**:
   - Tap on the linked animal tag (e.g. `HYD-8492` or create a new tag via `/partner/animals/new`).
   - View the scannable collar QR code, 3 identification photo slots (Face, Side, Markings), rabies vaccination badge, and immutable treatment history log.
   - Notice the page is **view-only for the public**; edit controls appear only when signed in as an authorized Vet or NGO coordinator.

6. **Vet-Confirmed Rabies Observation on Map (`/map` & `/partner/flags`)**:
   - Switch role to **🏥 Partner Vet (Dr. Priya Sharma)** in the top Demo Bar.
   - Open `/partner/flags` and record a suspected rabies observation with clinical notes.
   - Open `/map` to view the static marker with clinic name and date.
   - *In strict adherence to PRD FR-25 & FR-26*: Notice that this is informational only, never pushed as panic notifications, and dogs are **never labeled dangerous or aggressive**.

7. **Pilot Admin Dashboard (`/admin`)**:
   - View real-time computed pilot metrics for Hyderabad Ward 104:
     - Median time to accept (18m baseline)
     - Median time to closure
     - Total reports & active dispatches
     - Animals treated (142+) and vaccinated (89+)
     - Escalation funnel breakdown (Step 1 Volunteer vs Step 2 Clinic vs Step 3 Municipal Helpline)
   - Open `/admin/responders` to manage directory approvals, suspensions, and volunteer invite links.
   - Open `/admin/settings` to adjust the accept window or configure the official GHMC Animal Control helpline fallback contact.

---

## 🎭 Role Switcher & Prototype Controls

The persistent dark **Demo Bar** at the top of every screen allows one-click switching between personas:

| Persona | Role / Permissions |
|---|---|
| **👤 Citizen** | Anonymous reporting, case tracking, "My Reports" device storage, feedback |
| **🦺 Volunteer Arun** | Emergency dispatches, accept with ETA, mark arrived, close cases |
| **🏥 Partner Vet (Dr. Priya)** | Register QR collar animals, edit treatment logs, set/clear rabies flags |
| **🏢 NGO Coordinator (Ramesh)** | Approve volunteer attestations, monitor directory, handle escalations |
| **⚙️ Admin** | Pilot response metrics, fallback helpline configuration, audit logs |

- **Escalation Clock**: Toggle between `1x`, `10x`, and `30x` speed to compress the 10-minute accept window into seconds.
- **Skip Wait Button**: Instantly triggers timeout escalation on active cases.
- **Reset Seed Data Button**: Resets all mock cases, responders, and animals back to the fresh Hyderabad pilot seed state.

---

## 🏛️ Architecture & Clean Services Layer

All data access is decoupled behind typed service functions in `/src/services/` backed by `/src/mocks/fixtures.ts`:
- `caseService.ts` (`createCase`, `acceptCase`, `declineCase`, `timeoutCase`, `closeCase`, `submitFeedback`)
- `responderService.ts` (`listResponders`, `approveResponder`, `suspendResponder`, `inviteResponder`)
- `animalService.ts` (`getAnimal`, `createAnimal`, `updateAnimal`, `addAnimalRecord`)
- `flagService.ts` (`listRabiesFlags`, `setFlag`, `clearFlag`)
- `metricsService.ts` (`getMetrics`)
- `escalationClock.ts` (Dynamic timer service with speed multiplier)

No UI component touches fixtures directly, allowing a real backend (e.g., Supabase / PostGIS) to be dropped in without changing UI code.

---

## 🛡️ Guard Rules & Product Constraints Kept

- **No login for citizens**: Anonymous by default, phone optional, phone numbers automatically anonymized/deleted on closure (FR-34).
- **No "dangerous" or "aggressive" words**: The only marker allowed is a vet-confirmed, suspected-rabies flag (FR-26).
- **No "transfer to shelter" words**: Neighborhood disturbance inquiries go through `/assess` ("Request an assessment"), clearly stating that community dogs belong to their territory under Indian Animal Birth Control (ABC) rules and removal is not promised.
- **"Assured escalation"**, never "guaranteed response".
- **Reporters cannot close cases**: Feedback of "not resolved" flags the case to the coordinator for oversight rather than reopening it.
- **Exact location privacy**: Exact GPS and landmarks are restricted exclusively to the assigned responder and the reporter.
