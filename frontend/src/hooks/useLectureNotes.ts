import { useEffect, useState } from "react"

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
  const [text, setTextState] = useState(() => read(lectureId))

  useEffect(() => {
    setTextState(read(lectureId))
  }, [lectureId])

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
