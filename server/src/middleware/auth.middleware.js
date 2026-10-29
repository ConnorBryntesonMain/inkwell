// server/src/middleware/auth.middleware.js
//
// The missing piece threat model depends on: verifies
// the bearer token issued by TokenService.issueTokens() (Lecture 6)
// and attaches the resulting identity to req.user. Section 1.2 applies
// this middleware and, critically, actually USES req.user instead of
// trusting the request body.

import { TokenService } from "../services/token.service.js";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: { code: "UNAUTHENTICATED", message: "Missing or invalid Authorization header." } });
  }

  try {
    const payload = TokenService.verifyAccessToken(token);
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch {
    return res.status(401).json({ error: { code: "UNAUTHENTICATED", message: "Invalid or expired token." } });
  }
}
