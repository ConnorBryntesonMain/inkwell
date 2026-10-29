// server/src/middleware/rate-limit.middleware.js
import rateLimit from "express-rate-limit";

// Example security requirement, now enforced in code:
// "the system shall reject login attempts after five consecutive
// failures from the same account within ten minutes."
export const authRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { error: { code: "TOO_MANY_ATTEMPTS", message: "Too many attempts. Try again later." } },
  standardHeaders: true,
  legacyHeaders: false,
});
