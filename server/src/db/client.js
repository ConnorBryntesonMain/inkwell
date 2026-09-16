// Temporary in-memory database placeholder.
// Replace this module with the real Prisma client when persistence is added.
const users = [];
const posts = [];
let nextUserId = 1;
let nextPostId = 1;

export const prisma = {
  user: {
    async findUnique({ where: { email } }) {
      return users.find((user) => user.email === email) ?? null;
    },
    async create({ data }) {
      const user = { id: String(nextUserId++), ...data };
      users.push(user);
      return user;
    },
  },

  post: {
    async create({ data }) {
      const post = { id: String(nextPostId++), ...data };
      posts.push(post);
      return post;
    },
    async findMany({ where, orderBy, skip = 0, take }) {
      return posts
        .filter((post) => !where?.status || post.status === where.status)
        .sort((a, b) => new Date(b[Object.keys(orderBy)[0]]) - new Date(a[Object.keys(orderBy)[0]]))
        .slice(skip, skip + take);
    },
  },
};
