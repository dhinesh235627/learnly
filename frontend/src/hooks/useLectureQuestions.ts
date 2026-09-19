import { useEffect, useState } from "react"

export type Question = { id: string; text: string; date: string }

function storageKey(lectureId: string) {
  return `learnly:qa:${lectureId}`
}

function read(lectureId: string): Question[] {
  try {
    const raw = localStorage.getItem(storageKey(lectureId))
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function useLectureQuestions(lectureId: string) {
  const [questions, setQuestions] = useState<Question[]>(() => read(lectureId))

  useEffect(() => {
    setQuestions(read(lectureId))
  }, [lectureId])

  function ask(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return
    const next: Question[] = [
      { id: crypto.randomUUID(), text: trimmed, date: new Date().toISOString().slice(0, 10) },
      ...questions,
    ]
    setQuestions(next)
    try {
      localStorage.setItem(storageKey(lectureId), JSON.stringify(next))
    } catch {
      // storage unavailable — question still reflects in this session
    }
  }

  return { questions, ask }
}
