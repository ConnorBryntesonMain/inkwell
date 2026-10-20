// server/src/test-utils/fixtures.js

import { prisma } from "../db/client.js";
import bcrypt from "bcrypt";

let userCounter = 0;

export async function createTestUser({ email, password = "correcthorse" } = {}) {
  userCounter += 1;
  const resolvedEmail = email ?? `test-user-${userCounter}@example.com`;
  const passwordHash = await bcrypt.hash(password, 4); // low cost factor: tests don't need production security
  return prisma.user.create({
    data: { email: resolvedEmail, displayName: "Test User", passwordHash, isVerified: true },
  });
}

export async function resetDatabase() {
  await prisma.postTag.deleteMany();
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();
}
