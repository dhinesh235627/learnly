import { app } from "@azure/functions"
import { clearSessionCookieHeader } from "../lib/session.js"

app.http("authLogout", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "auth/logout",
  handler: async () => {
    return {
      status: 200,
      headers: { "Set-Cookie": clearSessionCookieHeader() },
      jsonBody: { loggedOut: true },
    }
  },
})
