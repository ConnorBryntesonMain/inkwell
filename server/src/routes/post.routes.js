// server/src/routes/post.routes.js

import { Router } from "express";
import { PostService } from "../services/post.service.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// Lecture 15 (hardened): requireAuth verifies the JWT, and authorId
// comes from req.user, never from the request body.
router.post("/posts", requireAuth, async (req, res) => {
  try {
    const { title, body } = req.body;
    // Never trust client-supplied identity fields — derive
    // authorId from the authenticated request, not the request body.
    const post = await PostService.publish({
      title,
      body,
      authorId: req.user.id, // set by requireAuth middleware from the verified JWT
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({
      error: { code: err.code || "VALIDATION_ERROR", message: err.message },
    });
  }
});

router.get("/posts", async (req, res, next) => {
  try {
    const { page = 1, search } = req.query;
    const result = search
      ? await PostService.search({ query: search, page: Number(page) })
      : await PostService.listPublished({ page: Number(page) });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
