import { app } from "@azure/functions"
import { decodeGoogleIdToken, sessionCookieHeader, signSession } from "../lib/session.js"

app.http("authGoogleCallback", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "auth/google/callback",
  handler: async (request, context) => {
    const code = request.query.get("code")
    const frontend = process.env.FRONTEND_URL

    if (!code) {
      return { status: 302, headers: { Location: `${frontend}/login?error=google_denied` } }
    }

    try {
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: process.env.GOOGLE_REDIRECT_URI,
          grant_type: "authorization_code",
        }),
      })

      if (!tokenRes.ok) throw new Error(`token exchange failed: ${tokenRes.status}`)
      const tokens = await tokenRes.json()
      const claims = decodeGoogleIdToken(tokens.id_token)

      const sessionToken = signSession({
        sub: claims.sub,
        email: claims.email,
        name: claims.name,
        picture: claims.picture,
      })

      return {
        status: 302,
        headers: {
          Location: `${frontend}/home`,
          "Set-Cookie": sessionCookieHeader(sessionToken),
        },
      }
    } catch (err) {
      context.error("Google OAuth callback failed", err)
      return { status: 302, headers: { Location: `${frontend}/login?error=google_failed` } }
    }
  },
})
