// server/src/index.js
//
// Entry point. As of Lecture 5, this file's only job is to assemble
// middleware and mount routers — it contains no business logic itself,
// consistent with ADR-001's layered architecture.

import "dotenv/config";
import express from "express";
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import "./events/listeners/log-published-posts.listener.js";
import statsRouter from "./routes/stats.js";
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use("/api", healthRoutes);
app.use("/api", authRoutes);
app.use("/api", postRoutes);
app.use("/api/stats", statsRouter);

app.use((err, req, res, next) => {
	console.error(err);
	res.status(err.status || 500).json({
		error: { code: err.code || "INTERNAL_ERROR", message: err.message },
	});
});

app.listen(PORT, () => {
	console.log(`Inkwell API listening on port ${PORT}`);
});
