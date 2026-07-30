import { DemoDatabase } from './demo-database';

export interface DemoRouteContext {
  db: DemoDatabase;
  params: Record<string, string>;
  query: URLSearchParams;
  body: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface DemoRoute {
  method: string;
  pattern: RegExp;
  handler: (ctx: DemoRouteContext) => unknown;
}

/**
 * Ordered {method, pathname pattern} → handler table for the demo/guest mode fake backend.
 * Patterns are fully anchored (`^...$`), so literal-segment routes (e.g. `/devices/metrics`)
 * must come before same-shaped parametric routes (e.g. `/devices/:id`) — first match wins.
 */
export const DEMO_ROUTES: DemoRoute[] = [
  // --- Organization ---------------------------------------------------------
  { method: 'GET', pattern: /^\/clinics\/me$/, handler: ({ db }) => db.getCurrentClinic() },
  {
    method: 'GET',
    pattern: /^\/physiotherapists\/me\/patients\/therapy-overview$/,
    handler: ({ db }) => db.getOverview(),
  },
  {
    method: 'GET',
    pattern: /^\/physiotherapists\/me\/patients$/,
    handler: ({ db }) => db.getMyPatients(),
  },
  {
    method: 'GET',
    pattern: /^\/physiotherapists\/me$/,
    handler: ({ db }) => db.getCurrentPhysiotherapist(),
  },
  {
    method: 'POST',
    pattern: /^\/patients\/by-physiotherapist$/,
    handler: ({ db, body }) => db.registerPatient(body),
  },
  {
    method: 'PUT',
    pattern: /^\/patients\/by-physiotherapist\/(?<id>[^/]+)$/,
    handler: ({ db, params, body }) => db.updatePatientContact(params['id'], body),
  },
  {
    method: 'PUT',
    pattern: /^\/patients\/(?<id>[^/]+)\/discharge$/,
    handler: ({ db, params }) => {
      db.dischargePatient(params['id']);
      return null;
    },
  },
  {
    method: 'POST',
    pattern: /^\/patients\/(?<patientId>[^/]+)\/treatment-plans$/,
    handler: ({ db, params, body }) => db.createTreatmentPlan(params['patientId'], body),
  },
  {
    method: 'GET',
    pattern: /^\/patients\/(?<patientId>[^/]+)\/treatment-plans\/(?<planId>[^/]+)$/,
    handler: ({ db, params }) => db.getTreatmentPlan(params['patientId'], params['planId']),
  },
  {
    method: 'GET',
    pattern: /^\/patients\/(?<patientId>[^/]+)\/treatment-plans$/,
    handler: ({ db, params }) => db.getTreatmentPlansByPatient(params['patientId']),
  },
  {
    method: 'GET',
    pattern: /^\/patients\/(?<patientId>[^/]+)\/therapy-sessions$/,
    handler: ({ db, params, query }) =>
      db.getHistoryByPatient(params['patientId'], query.get('treatmentPlanId') ?? undefined),
  },
  {
    method: 'GET',
    pattern: /^\/patients\/(?<id>[^/]+)$/,
    handler: ({ db, params }) => db.getPatientById(params['id']),
  },
  {
    method: 'DELETE',
    pattern: /^\/patients\/(?<id>[^/]+)$/,
    handler: ({ db, params }) => {
      db.deletePatient(params['id']);
      return null;
    },
  },

  // --- Planning: exercises ---------------------------------------------------
  { method: 'GET', pattern: /^\/exercises$/, handler: ({ db }) => db.listExercises() },
  {
    method: 'GET',
    pattern: /^\/exercises\/(?<id>[^/]+)$/,
    handler: ({ db, params }) => db.getExerciseById(params['id']),
  },

  // --- Planning: treatment plans ----------------------------------------------
  {
    method: 'GET',
    pattern: /^\/treatment-plans$/,
    handler: ({ db, query }) =>
      db.getAllTreatmentPlans({
        patientId: query.get('patientId') ?? undefined,
        physiotherapistId: query.get('physiotherapistId') ?? undefined,
        status: query.get('status') ?? undefined,
      }),
  },
  {
    method: 'POST',
    pattern: /^\/treatment-plans\/(?<id>[^/]+)\/activate$/,
    handler: ({ db, params }) => db.activateTreatmentPlan(params['id']),
  },
  {
    method: 'POST',
    pattern: /^\/treatment-plans\/(?<id>[^/]+)\/complete$/,
    handler: ({ db, params }) => db.completeTreatmentPlan(params['id']),
  },
  {
    method: 'POST',
    pattern: /^\/treatment-plans\/(?<id>[^/]+)\/cancel$/,
    handler: ({ db, params }) => db.cancelTreatmentPlan(params['id']),
  },
  {
    method: 'POST',
    pattern: /^\/treatment-plans\/(?<id>[^/]+)\/routines$/,
    handler: ({ db, params, body }) => db.addRoutine(params['id'], body),
  },
  {
    method: 'PUT',
    pattern: /^\/treatment-plans\/(?<id>[^/]+)\/routines\/(?<order>[^/]+)$/,
    handler: ({ db, params, body }) =>
      db.updateRoutine(params['id'], Number(params['order']), body),
  },
  {
    method: 'DELETE',
    pattern: /^\/treatment-plans\/(?<id>[^/]+)\/routines\/(?<order>[^/]+)$/,
    handler: ({ db, params }) => db.deleteRoutine(params['id'], Number(params['order'])),
  },
  {
    method: 'GET',
    pattern: /^\/treatment-plans\/(?<id>[^/]+)$/,
    handler: ({ db, params }) => db.getTreatmentPlanById(params['id']),
  },
  {
    method: 'PUT',
    pattern: /^\/treatment-plans\/(?<id>[^/]+)$/,
    handler: ({ db, params, body }) => db.updateTreatmentPlan(params['id'], body),
  },
  {
    method: 'DELETE',
    pattern: /^\/treatment-plans\/(?<id>[^/]+)$/,
    handler: ({ db, params }) => {
      db.deleteTreatmentPlan(params['id']);
      return null;
    },
  },

  // --- Therapy ----------------------------------------------------------------
  {
    method: 'GET',
    pattern: /^\/therapy-sessions\/active\/(?<patientId>[^/]+)$/,
    handler: ({ db, params }) => db.getActiveSession(params['patientId']),
  },
  {
    method: 'GET',
    pattern: /^\/therapy-sessions\/schedule\/(?<patientId>[^/]+)$/,
    handler: ({ db, params, query }) =>
      db.getSchedule(params['patientId'], query.get('date') ?? undefined),
  },
  {
    method: 'GET',
    pattern: /^\/therapy-sessions\/(?<id>[^/]+)\/progress$/,
    handler: ({ db, params }) => db.getProgress(params['id']),
  },
  {
    method: 'GET',
    pattern: /^\/therapy-sessions\/(?<id>[^/]+)\/summary$/,
    handler: ({ db, params }) => db.getSummary(params['id']),
  },
  {
    method: 'GET',
    pattern: /^\/therapy-sessions\/(?<id>[^/]+)\/detail$/,
    handler: ({ db, params }) => db.getDetail(params['id']),
  },

  // --- Device -------------------------------------------------------------------
  { method: 'GET', pattern: /^\/devices\/metrics$/, handler: ({ db }) => db.getFleetMetrics() },
  {
    method: 'GET',
    pattern: /^\/devices\/my-assigned$/,
    handler: ({ db }) => db.getMyAssignedDevice(),
  },
  {
    method: 'GET',
    pattern: /^\/devices\/by-serial-number\/(?<serial>[^/]+)$/,
    handler: ({ db, params }) => db.getDeviceBySerialNumber(decodeURIComponent(params['serial'])),
  },
  {
    method: 'PATCH',
    pattern: /^\/devices\/(?<id>[^/]+)\/status$/,
    handler: ({ db, params, body }) => db.updateDeviceStatus(params['id'], body?.status),
  },
  {
    method: 'PATCH',
    pattern: /^\/devices\/(?<id>[^/]+)\/calibration$/,
    handler: ({ db, params, body }) => db.updateDeviceCalibration(params['id'], body?.action),
  },
  {
    method: 'PATCH',
    pattern: /^\/devices\/(?<id>[^/]+)\/telemetry$/,
    handler: ({ db, params, body }) => db.updateDeviceTelemetry(params['id'], body?.batteryLevel),
  },
  {
    method: 'POST',
    pattern: /^\/devices\/(?<id>[^/]+)\/patient-assignments$/,
    handler: ({ db, params, body }) => db.assignDeviceToPatient(params['id'], body?.patientId),
  },
  {
    method: 'DELETE',
    pattern: /^\/devices\/(?<id>[^/]+)\/patient-assignments$/,
    handler: ({ db, params }) => db.unassignDevice(params['id']),
  },
  {
    method: 'GET',
    pattern: /^\/devices\/(?<id>[^/]+)$/,
    handler: ({ db, params }) => db.getDeviceById(params['id']),
  },
  {
    method: 'DELETE',
    pattern: /^\/devices\/(?<id>[^/]+)$/,
    handler: ({ db, params }) => {
      db.deleteDevice(params['id']);
      return null;
    },
  },
  { method: 'GET', pattern: /^\/devices$/, handler: ({ db }) => db.listDevices() },
];
