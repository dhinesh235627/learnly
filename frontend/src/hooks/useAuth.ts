import { useCallback, useEffect, useState } from "react"
import { API_BASE } from "../lib/api"

export type AuthUser = { email: string; name: string; picture: string }

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, { credentials: "include" })
      const data = res.ok ? await res.json() : null
      setUser(data?.user ?? null)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function logout() {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, { method: "POST", credentials: "include" })
    } catch {
      // network failure on logout — still clear local state below
    }
    setUser(null)
  }

  return { user, loading, refresh, logout }
}
