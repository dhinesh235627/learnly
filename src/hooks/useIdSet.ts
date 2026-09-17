import { useEffect, useState } from "react"

function read(key: string): string[] {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function write(key: string, ids: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(ids))
  } catch {
    // storage unavailable — state still updates for this session
  }
  window.dispatchEvent(new CustomEvent(key))
}

/** A small set of ids (wishlist, cart, ...) backed by localStorage and kept
 * in sync across every mounted instance via a window CustomEvent. */
export function useIdSet(key: string) {
  const [ids, setIds] = useState<string[]>(() => read(key))

  useEffect(() => {
    const sync = () => setIds(read(key))
    window.addEventListener(key, sync)
    return () => window.removeEventListener(key, sync)
  }, [key])

  function add(id: string) {
    if (ids.includes(id)) return
    write(key, [...ids, id])
  }

  function remove(id: string) {
    write(
      key,
      ids.filter((x) => x !== id),
    )
  }

  function toggle(id: string) {
    ids.includes(id) ? remove(id) : add(id)
  }

  return { ids, has: (id: string) => ids.includes(id), add, remove, toggle }
}
