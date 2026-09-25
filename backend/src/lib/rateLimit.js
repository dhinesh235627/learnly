// Lightweight, single-instance abuse guard for public, unauthenticated,
// paid-model endpoints. Not durable across restarts or multiple Function
// instances — a proper fix (Table/Cosmos-backed) can come later; this just
// stops a casual loop from running up model costs.
export function createRateLimiter(windowMs, maxRequests) {
  const requestLog = new Map()

  return function isRateLimited(clientId) {
    const now = Date.now()
    const timestamps = (requestLog.get(clientId) ?? []).filter((t) => now - t < windowMs)
    timestamps.push(now)
    requestLog.set(clientId, timestamps)
    return timestamps.length > maxRequests
  }
}
