import { useEffect, useState } from "react"

type Reminder = { atISO: string }

function storageKey(courseId: string) {
  return `learnly:reminder:${courseId}`
}

function read(courseId: string): Reminder | null {
  try {
    const raw = localStorage.getItem(storageKey(courseId))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/** A per-course "remind me to continue" reminder, persisted locally and
 * fired as a browser notification while Learnly stays open in this tab. */
export function useCourseReminder(courseId: string, courseTitle: string) {
  const [reminder, setReminderState] = useState<Reminder | null>(() => read(courseId))
  const [permission, setPermission] = useState<NotificationPermission>(() =>
    typeof Notification === "undefined" ? "denied" : Notification.permission,
  )

  useEffect(() => {
    setReminderState(read(courseId))
  }, [courseId])

  useEffect(() => {
    if (!reminder) return
    const delay = new Date(reminder.atISO).getTime() - Date.now()
    if (delay <= 0) return
    const timer = window.setTimeout(() => {
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        new Notification("Time to keep learning", {
          body: `Your reminder for "${courseTitle}" is here.`,
        })
      }
      setReminderState(null)
      try {
        localStorage.removeItem(storageKey(courseId))
      } catch {
        // storage unavailable
      }
    }, delay)
    return () => window.clearTimeout(timer)
  }, [reminder, courseId, courseTitle])

  async function setReminder(atISO: string) {
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      const result = await Notification.requestPermission()
      setPermission(result)
    }
    const next: Reminder = { atISO }
    setReminderState(next)
    try {
      localStorage.setItem(storageKey(courseId), JSON.stringify(next))
    } catch {
      // storage unavailable — reminder still reflects in this session
    }
  }

  function clearReminder() {
    setReminderState(null)
    try {
      localStorage.removeItem(storageKey(courseId))
    } catch {
      // storage unavailable
    }
  }

  return { reminder, permission, setReminder, clearReminder }
}
