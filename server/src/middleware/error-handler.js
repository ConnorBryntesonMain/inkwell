// server/src/middleware/error-handler.js — AFTER (fixed)
export function errorHandler(err, req, res, next) {
  // A05's fix: never expose stack traces or internal error details to
  // the client in production — log them internally instead (A09, Section 5.6).
  console.error(err); // internal logging only
  const isProd = process.env.NODE_ENV === "production";
  res.status(err.status || 500).json({
    error: {
      code: err.code || "INTERNAL_ERROR",
      message: isProd ? "Something went wrong." : err.message,
    },
  });
}
