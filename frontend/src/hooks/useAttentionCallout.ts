import { useEffect, useRef } from "react"
import { DISTRACTED_STATUSES, type AttentionStatus } from "../lib/attentionStatus"
import { speakCallout } from "../lib/speechApi"

// How long a distracted status has to hold continuously before it counts as
// a real lapse worth calling out, not a one-off glance or a blink.
const DISTRACTION_HOLD_MS = 8_000
// Minimum time between callouts, so the agent nudges rather than nags.
const COOLDOWN_MS = 3 * 60_000

const MESSAGES: Partial<Record<AttentionStatus, (name: string) => string>> = {
  "looking-away": (name) => `Hey ${name}, you seem distracted. It's better to take a short break and come back.`,
  "gaze-away": (name) => `Hey ${name}, your eyes have wandered off the lecture. Take a short break and come back.`,
  "eyes-closed": (name) => `Hey ${name}, looks like you're dozing off. A quick break might help.`,
  "no-face": (name) => `Hey ${name}, I can't see you anymore. Come back when you're ready to continue.`,
  "object-detected": (name) => `Hey ${name}, try putting your phone away so you can focus on the lecture.`,
}

/** Watches a stream of AttentionMonitor statuses and, once a distracted
 * state has held continuously for DISTRACTION_HOLD_MS, speaks a callout via
 * Azure TTS — at most once per continuous distracted stretch, and never
 * more often than COOLDOWN_MS apart. The specific distracted sub-reason
 * (head turned vs. eyes closed vs. phone) can change mid-stretch without
 * resetting the hold timer — only actually regaining attention does. */
export function useAttentionCallout(status: AttentionStatus, enabled: boolean, userName: string | undefined) {
  const latestStatusRef = useRef<AttentionStatus>(status)
  const lastCalloutAtRef = useRef(0)
  const isDistracted = enabled && DISTRACTED_STATUSES.has(status)

  useEffect(() => {
    latestStatusRef.current = status
  }, [status])

  useEffect(() => {
    if (!isDistracted) return

    const timer = setTimeout(() => {
      const sinceLastCallout = Date.now() - lastCalloutAtRef.current
      if (sinceLastCallout < COOLDOWN_MS) return

      const finalStatus = latestStatusRef.current
      if (!DISTRACTED_STATUSES.has(finalStatus)) return

      lastCalloutAtRef.current = Date.now()
      const buildMessage = MESSAGES[finalStatus] ?? MESSAGES["looking-away"]!
      const name = userName?.trim().split(/\s+/)[0] || "there"
      speakCallout(buildMessage(name)).catch(() => {
        // best-effort: a failed callout shouldn't disrupt the lecture
      })
    }, DISTRACTION_HOLD_MS)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDistracted, userName])
}
