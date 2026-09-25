// Split out from AttentionMonitor.tsx so callers that only need the status
// type/set (e.g. useAttentionCallout) don't statically pull in that
// component's heavy TensorFlow.js/Human module graph — that graph should
// only load when AttentionMonitor itself is actually rendered (see its
// lazy() import in Learn.tsx).
export type AttentionStatus =
  | "idle"
  | "loading"
  | "calibrating"
  | "engaged"
  | "no-face"
  | "multiple-faces"
  | "looking-away"
  | "gaze-away"
  | "eyes-closed"
  | "object-detected"
  | "error"

// Statuses that count as "not paying attention" for the caller's own
// sustained-distraction/cooldown logic (see useAttentionCallout).
export const DISTRACTED_STATUSES: ReadonlySet<AttentionStatus> = new Set([
  "no-face",
  "looking-away",
  "gaze-away",
  "eyes-closed",
  "object-detected",
])
