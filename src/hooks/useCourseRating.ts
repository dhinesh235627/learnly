import { useState } from "react"

function storageKey(courseId: string) {
  return `learnly:rating:${courseId}`
}

function readRating(courseId: string): number | null {
  try {
    const raw = localStorage.getItem(storageKey(courseId))
    return raw ? Number(raw) : null
  } catch {
    return null
  }
}

export function useCourseRating(courseId: string) {
  const [rating, setRating] = useState<number | null>(() => readRating(courseId))

  function rate(value: number) {
    setRating(value)
    try {
      localStorage.setItem(storageKey(courseId), String(value))
    } catch {
      // storage unavailable — rating still reflects in this session
    }
  }

  return { rating, rate }
}
