// server/src/db/client.js
//
// A single, shared Prisma client instance. Per ADR-001 (Lecture 5),
// this is the only file that imports @prisma/client directly outside
// the repositories/ layer — repositories import THIS module, not
// @prisma/client, keeping the ORM itself swappable in principle.
import pkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const { PrismaClient } = pkg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma = new PrismaClient({ adapter });
