// server/src/index.js
//
// Entry point. As of Lecture 5, this file's only job is to assemble
// middleware and mount routers — it contains no business logic itself,
// consistent with ADR-001's layered architecture.

import "dotenv/config";
import { app } from "./app.js";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
	console.log(`Inkwell API listening on port ${PORT}`);
});
