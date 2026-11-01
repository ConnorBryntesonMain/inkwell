// server/src/repositories/post.repository.js

import { prisma } from "../db/client.js";
import { toPublicUser } from "../dto/user.dto.js";

export const PostRepository = {
  create({ authorId, title, body, status, publishedAt }) {
    return prisma.post.create({
      data: { authorId, title, body, status, publishedAt },
    });
  },

  createWithTags({ authorId, title, body, status, publishedAt, tagNames }) {
    return prisma.post.create({
      data: {
        authorId,
        title,
        body,
        status,
        publishedAt,
        tags: {
          create: tagNames.map((name) => ({
            tag: { connectOrCreate: { where: { name }, create: { name } } },
          })),
        },
      },
      include: { tags: { include: { tag: true } } },
    });
  },

  // Lecture 15: author included, then shaped through toPublicUser so
  // email and passwordHash never reach the feed response.
  async findPublished({ page, pageSize }) {
    const rows = await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      include: { author: true },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize + 1, // fetch one extra row to compute hasMore
    });
    const hasMore = rows.length > pageSize;
    return {
      posts: rows.slice(0, pageSize).map((post) => ({ ...post, author: toPublicUser(post.author) })),
      hasMore,
    };
  },

  async searchPublished({ query, page, pageSize }) {
    const where = {
      status: "PUBLISHED",
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { body: { contains: query, mode: "insensitive" } },
      ],
    };
    const rows = await prisma.post.findMany({
      where,
      include: { author: true },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize + 1,
    });
    const hasMore = rows.length > pageSize;
    return {
      posts: rows.slice(0, pageSize).map((post) => ({ ...post, author: toPublicUser(post.author) })),
      hasMore,
    };
  },
  findById(id) {
    return prisma.post.findUnique({ where: { id } });
  },
 
  deleteById(id) {
    return prisma.post.delete({ where: { id } });
  },
};
