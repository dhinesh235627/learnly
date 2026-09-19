import { app } from "@azure/functions"

app.http("authGoogleStart", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "auth/google",
  handler: async () => {
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      response_type: "code",
      scope: "openid email profile",
      access_type: "online",
      prompt: "select_account",
    })

    return {
      status: 302,
      headers: { Location: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}` },
    }
  },
})
