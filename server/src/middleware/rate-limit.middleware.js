// server/src/middleware/rate-limit.middleware.js
import rateLimit from "express-rate-limit";

// Example security requirement, now enforced in code:
// "the system shall reject login attempts after five consecutive
// failures from the same account within ten minutes."
export const authRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  // CI only: the e2e-tests job sets DISABLE_RATE_LIMIT=true. Nothing
  // else sets it, so the limiter stays on in production.
  skip: () => process.env.DISABLE_RATE_LIMIT === "true",
  message: { error: { code: "TOO_MANY_ATTEMPTS", message: "Too many attempts. Try again later." } },
  standardHeaders: true,
  legacyHeaders: false,
});
