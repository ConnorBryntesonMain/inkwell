// server/src/services/post.service.js

import { PostRepository } from "../repositories/post.repository.js";
import { assertNonEmpty, ValidationError } from "../utils/validation.js";
import { SubstringSearchStrategy } from "./search/substring-search.strategy.js";
import { EventBus } from "../events/event-bus.js";

const searchStrategy = SubstringSearchStrategy; // swap this line to change search behavior system-wide

// Lecture 15, Exercise 1 (STRIDE: Denial of Service on GET /api/posts):
// without an upper bound, ?pageSize=1000000 makes the database load and
// serialize the whole posts table in one request. Oversized values are
// clamped to MAX_PAGE_SIZE; invalid values are still rejected.
export const MAX_PAGE_SIZE = 50;

function normalizePagination(page, pageSize) {
  if (!Number.isInteger(page) || page < 1) {
    throw new ValidationError("page must be a positive integer.", "INVALID_PAGE");
  }
  if (!Number.isInteger(pageSize) || pageSize < 1) {
    throw new ValidationError("pageSize must be a positive integer.", "INVALID_PAGE_SIZE");
  }
  return { page, pageSize: Math.min(pageSize, MAX_PAGE_SIZE) };
}

export const PostService = {
  async publish({ authorId, title, body, tagNames = [] }) {
    assertNonEmpty(title, "title", "MISSING_TITLE");
    assertNonEmpty(body, "body", "MISSING_BODY");

    const post = await PostRepository.createWithTags({
      authorId,
      title,
      body,
      tagNames,
      status: "PUBLISHED",
      publishedAt: new Date(),
    });

    EventBus.emit("post.published", {
      postId: post.id,
      authorId,
      title: post.title,
      tags: tagNames,
    });

    return post;
  },

  async listPublished({ page = 1, pageSize = 10 }) {
    const safe = normalizePagination(page, pageSize);
    const { posts, hasMore } = await PostRepository.findPublished(safe);
    return { posts, page: safe.page, pageSize: safe.pageSize, hasMore };
  },

  async search({ query, page = 1, pageSize = 10 }) {
    const safe = normalizePagination(page, pageSize);
    return searchStrategy.search(query, safe);
  },
};
