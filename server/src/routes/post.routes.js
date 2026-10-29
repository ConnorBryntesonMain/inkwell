// server/src/routes/post.routes.js

import { Router } from "express";
import { PostService } from "../services/post.service.js";
import { ValidationError } from "../utils/validation.js";
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
    const { page = "1", pageSize = "10", search } = req.query;
    // Lecture 15, Exercise 1: pageSize is now read from the query string;
    // PostService clamps it to MAX_PAGE_SIZE.
    const pagination = { page: Number(page), pageSize: Number(pageSize) };
    const result = search
      ? await PostService.search({ query: search, ...pagination })
      : await PostService.listPublished(pagination);
    res.status(200).json(result);
  } catch (err) {
    // Bad page/pageSize input is a client error (400), not a server error (500).
    if (err instanceof ValidationError) {
      return res.status(400).json({ error: { code: err.code, message: err.message } });
    }
    next(err);
  }
});

export default router;
