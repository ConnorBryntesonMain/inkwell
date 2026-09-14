// server/src/repositories/post.repository.js

import { prisma } from "../db/client.js";

export const PostRepository = {
  create({ authorId, title, body, status, publishedAt }) {
    return prisma.post.create({
      data: { authorId, title, body, status, publishedAt },
    });
  },

  async findPublished({ page, pageSize }) {
    const rows = await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize + 1, // fetch one extra row to compute hasMore
    });
    const hasMore = rows.length > pageSize;
    return { posts: rows.slice(0, pageSize), hasMore };
  },
};
