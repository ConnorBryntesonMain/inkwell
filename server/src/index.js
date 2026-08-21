// server/src/index.js
//
// Entry point for the Inkwell API server.
// Lecture 1: intentionally minimal. This file's only job right now
// is to prove the server process boots and can answer one request.
// Middleware, routing modules, and error handling arrive in Lecture 4+.

import express from "express";

const app = express();
const PORT = process.env.PORT || 4000;

app.get("/api/health", (req, res) => {
	res.status(200).json({ status: "ok", service: "inkwell-api"
	});
});

app.listen(PORT, () => {
	console.log(`Inkwell API listening on port ${PORT}`);
});


