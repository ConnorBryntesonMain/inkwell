// server/src/routes/post.routes.js
//
// Wires PostService's publish() and listPublished() to
// the API contract's POST /api/posts and GET /api/posts (Lecture 4).
// Same thin-route discipline as auth.routes.js: no business rules here.

import { Router } from "express";
import { PostService } from "../services/post.service.js";

const router = Router();

router.post("/posts", async (req, res) => {
	try {
		const { authorId, title, body } = req.body;
		const post = await PostService.publish({ authorId, title,body });
		res.status(201).json(post);
	} catch (err) {
		res.status(400).json({
			error: { code: err.code || "VALIDATION_ERROR", message:err.message },
		});
	}
});

// server/src/routes/post.routes.js (excerpt, new route)

router.get("/posts", async (req, res) => {
  const { page = 1, search } = req.query;
  const result = search
    ? await PostService.search({ query: search, page: Number(page) })
    : await PostService.listPublished({ page: Number(page) });
  res.status(200).json(result);
});

export default router;


