// server/src/routes/__tests__/posts.integration.test.js
//
// Section 4.2's sandwich strategy in miniature: real Routes, real
// Services, real Repositories, real (isolated) test database — no
// mocks anywhere in this file.

import request from "supertest";
import { app } from "../../app.js";
import { prisma } from "../../db/client.js";
import { resetDatabase } from "../../test-utils/fixtures.js";

beforeEach(async () => {
  await resetDatabase();
});

// Verification note: without this, Jest reports an open handle and waits
// out its own ~10s timeout before exiting, because app.js's import chain
// creates a real PrismaClient connection pool that nothing ever closes.
afterAll(async () => {
  await prisma.$disconnect();
});

test("full flow: register, publish, and browse (US-01, US-03, US-04 validation)", async () => {
  // Arrange + Act (Section 4.6's AAA pattern): register a real user
  const registerRes = await request(app)
    .post("/api/auth/register")
    .send({ email: "alice@example.com", displayName: "Alice", password: "correcthorse" });

  expect(registerRes.status).toBe(201);
  const { user, accessToken } = registerRes.body;

  // Act: publish a real post as that user
  const publishRes = await request(app)
    .post("/api/posts")
    .set("Authorization", `Bearer ${accessToken}`)
    .send({ authorId: user.id, title: "Hello, Inkwell", body: "My first real post." });

  expect(publishRes.status).toBe(201);

  // Act: browse the feed
  const feedRes = await request(app).get("/api/posts?page=1");

  // Assert: the published post is genuinely visible, end to end
  expect(feedRes.status).toBe(200);
  expect(feedRes.body.posts).toHaveLength(1);
  expect(feedRes.body.posts[0].title).toBe("Hello, Inkwell");
});

test("registering with a duplicate email fails end to end (US-01 extension 3a, validated)", async () => {
  await request(app)
    .post("/api/auth/register")
    .send({ email: "alice@example.com", displayName: "Alice", password: "correcthorse" });

  const secondAttempt = await request(app)
    .post("/api/auth/register")
    .send({ email: "alice@example.com", displayName: "Alice Two", password: "correcthorse" });

  expect(secondAttempt.status).toBe(400);
  expect(secondAttempt.body.error.code).toBe("EMAIL_ALREADY_REGISTERED");
});
