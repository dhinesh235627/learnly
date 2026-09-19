import { useState } from "react"

function storageKey(lectureId: string) {
  return `learnly:notes:${lectureId}`
}

function read(lectureId: string): string {
  try {
    return localStorage.getItem(storageKey(lectureId)) ?? ""
  } catch {
    return ""
  }
}

export function useLectureNotes(lectureId: string) {
  const [loadedFor, setLoadedFor] = useState(lectureId)
  const [text, setTextState] = useState(() => read(lectureId))

  if (lectureId !== loadedFor) {
    setLoadedFor(lectureId)
    setTextState(read(lectureId))
  }

  function setText(value: string) {
    setTextState(value)
    try {
      localStorage.setItem(storageKey(lectureId), value)
    } catch {
      // storage unavailable — note still reflects in this session
    }
  }

  return { text, setText }
}
