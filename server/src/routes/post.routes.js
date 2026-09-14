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

router.get("/posts", async (req, res, next) => {
	try {
		const page = Number(req.query.page) || 1;
		const result = await PostService.listPublished({ page });
		res.status(200).json(result);
	} catch (err){
		next(err);
	}
});

export default router;


