// server/src/routes/health.routes.js
//
// Routes are boundary classes (Lecture 4, Section 4.3): they translate
// HTTP requests into calls against Services, and Service results back
// into HTTP responses. This route currently has no Service to call —
// health-check logic is trivial enough to stay in the route itself,
// a deliberate, documented exception, not an oversight.

import { Router } from "express";

const router = Router();

router.get("/health", (req, res) => {
	res.status(200).json({ status: "ok", service: "inkwell-api"
});
});

export default router;
