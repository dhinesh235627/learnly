import { allLectures, courses } from "../data/courses"
import { useIdSet } from "./useIdSet"

const ACTIVITY_KEY = "learnly:activityDates"
export const COMPLETED_KEY = "learnly:completed"

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10)
}

/** Seeds a small, believable history on the very first visit only — after
 * that, every number is a live computation over real stored state. */
function seedOnce() {
  try {
    if (localStorage.getItem(COMPLETED_KEY) === null) {
      const seed = [
        "az-cloud-models",
        "az-capex-opex",
        "aws-shared-responsibility",
        "aws-iam-policies",
        "aws-mfa",
        "aws-ec2-types",
      ]
      localStorage.setItem(COMPLETED_KEY, JSON.stringify(seed))
    }
    if (localStorage.getItem(ACTIVITY_KEY) === null) {
      const dates: string[] = []
      for (let i = 5; i >= 1; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        dates.push(isoDate(d))
      }
      localStorage.setItem(ACTIVITY_KEY, JSON.stringify(dates))
    }
  } catch {
    // storage unavailable — stats just start from zero this session
  }
}

function recordTodayAndGetDates(): string[] {
  seedOnce()
  try {
    const raw = localStorage.getItem(ACTIVITY_KEY)
    const dates: string[] = raw ? JSON.parse(raw) : []
    const today = isoDate(new Date())
    if (!dates.includes(today)) {
      const next = [...dates, today]
      localStorage.setItem(ACTIVITY_KEY, JSON.stringify(next))
      return next
    }
    return dates
  } catch {
    return [isoDate(new Date())]
  }
}

function computeStreak(dates: string[]): number {
  const set = new Set(dates)
  const cursor = new Date()
  let streak = 0
  while (set.has(isoDate(cursor))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export function useLearningStats() {
  seedOnce()
  const completed = useIdSet(COMPLETED_KEY)
  const streak = computeStreak(recordTodayAndGetDates())

  let minutesDone = 0
  let inProgress = 0
  let certificates = 0

  for (const course of courses) {
    const lectures = allLectures(course)
    const done = lectures.filter((l) => completed.has(l.id)).length
    minutesDone += lectures.filter((l) => completed.has(l.id)).reduce((sum, l) => sum + l.minutes, 0)
    if (done > 0 && done < lectures.length) inProgress++
    if (lectures.length > 0 && done === lectures.length) certificates++
  }

  return {
    coursesInProgress: inProgress,
    hoursCompleted: Math.round((minutesDone / 60) * 10) / 10,
    streakDays: streak,
    certificatesEarned: certificates,
    completed,
  }
}
