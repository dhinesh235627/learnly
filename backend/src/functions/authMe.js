import { app } from "@azure/functions"
import { readSessionCookie, verifySession } from "../lib/session.js"

app.http("authMe", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "auth/me",
  handler: async (request) => {
    const token = readSessionCookie(request)
    const claims = token ? verifySession(token) : null

    if (!claims) {
      return { status: 401, jsonBody: { authenticated: false } }
    }

    return {
      status: 200,
      jsonBody: {
        authenticated: true,
        user: { email: claims.email, name: claims.name, picture: claims.picture },
      },
    }
  },
})
