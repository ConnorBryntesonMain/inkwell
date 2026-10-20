// server/src/app.js
//
// Extracted from index.js so tests (and this file) can import the
// Express app without binding a real port — index.js now only
// handles process startup (app.listen), not app construction.

import express from "express";
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import "./events/listeners/log-published-posts.listener.js";
// Lecture 9's listener registers itself as a side effect on import -- carry it over from index.js

export const app = express();
app.use(express.json());
app.use("/api", healthRoutes);
app.use("/api", authRoutes);
app.use("/api", postRoutes);

// Carried over from index.js (Lecture 6) -- dropping this here would
// silently lose the app's JSON error-response contract.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: { code: err.code || "INTERNAL_ERROR", message: err.message },
  });
});
