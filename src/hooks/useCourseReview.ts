import { useState } from "react"

export type Review = { rating: number; text: string; date: string }

function storageKey(courseId: string) {
  return `learnly:review:${courseId}`
}

function read(courseId: string): Review | null {
  try {
    const raw = localStorage.getItem(storageKey(courseId))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function useCourseReview(courseId: string) {
  const [review, setReview] = useState<Review | null>(() => read(courseId))

  function submit(rating: number, text: string) {
    const next: Review = { rating, text, date: new Date().toISOString().slice(0, 10) }
    setReview(next)
    try {
      localStorage.setItem(storageKey(courseId), JSON.stringify(next))
    } catch {
      // storage unavailable — review still reflects in this session
    }
  }

  return { review, submit }
}
