// server/src/services/search/substring-search.strategy.js
//
// The first, simplest SearchStrategy implementation. Any future
// replacement (full-text search, an external search service) only
// needs to satisfy the same interface: search(query, page) -> results.

import { PostRepository } from "../../repositories/post.repository.js";

export const SubstringSearchStrategy = {
  async search(query, { page = 1, pageSize = 10 }) {
    return PostRepository.searchPublished({ query, page, pageSize });
  },
};
