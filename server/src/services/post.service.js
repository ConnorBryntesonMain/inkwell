// server/src/services/post.service.js

import { PostRepository } from "../repositories/post.repository.js";
import { assertNonEmpty } from "../utils/validation.js";

export const PostService = {
  publish({ authorId, title, body }) {
    assertNonEmpty(title, "title", "MISSING_TITLE");
    assertNonEmpty(body, "body", "MISSING_BODY");

    return PostRepository.create({
      authorId,
      title,
      body,
      status: "PUBLISHED",
      publishedAt: new Date(),
    });
  },

  async listPublished({ page = 1, pageSize = 10 }) {
    const { posts, hasMore } = await PostRepository.findPublished({ page, pageSize });
    return { posts, page, hasMore };
  },
};
