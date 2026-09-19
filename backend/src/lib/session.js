import jwt from "jsonwebtoken"
import { parseCookie, stringifySetCookie } from "cookie"

const COOKIE_NAME = "learnly_session"
const SEVEN_DAYS = 60 * 60 * 24 * 7

function secret() {
  const s = process.env.SESSION_SECRET
  if (!s) throw new Error("SESSION_SECRET is not configured")
  return s
}

export function signSession(user) {
  return jwt.sign(
    { sub: user.sub, email: user.email, name: user.name, picture: user.picture },
    secret(),
    { expiresIn: "7d" },
  )
}

export function verifySession(token) {
  try {
    return jwt.verify(token, secret())
  } catch {
    return null
  }
}

export function readSessionCookie(request) {
  const header = request.headers.get("cookie")
  if (!header) return null
  const cookies = parseCookie(header)
  return cookies[COOKIE_NAME] ?? null
}

export function sessionCookieHeader(token) {
  return stringifySetCookie({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: SEVEN_DAYS,
  })
}

/** Decodes a Google-issued id_token's claims. Not a full signature/JWKS
 * verification — trust here comes from having just fetched this token
 * directly from Google over TLS in the same call that proved our client
 * secret. Basic claim checks (audience, issuer, expiry) catch the rest. */
export function decodeGoogleIdToken(idToken) {
  const payload = idToken.split(".")[1]
  const json = Buffer.from(payload, "base64url").toString("utf8")
  const claims = JSON.parse(json)

  if (claims.aud !== process.env.GOOGLE_CLIENT_ID) throw new Error("id_token audience mismatch")
  if (!["accounts.google.com", "https://accounts.google.com"].includes(claims.iss)) {
    throw new Error("id_token issuer mismatch")
  }
  if (claims.exp * 1000 < Date.now()) throw new Error("id_token expired")

  return claims
}

export function clearSessionCookieHeader() {
  return stringifySetCookie({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 0,
  })
}
