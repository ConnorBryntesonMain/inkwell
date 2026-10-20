// server/src/routes/__tests__/auth.integration.test.js
//
// Exercise 1: registration and login work together.
// Same strategy as posts.integration.test.js: real Routes, real
// Services, real Repositories, real (isolated) test database — no
// mocks anywhere in this file.

import request from "supertest";
import { app } from "../../app.js";
import { prisma } from "../../db/client.js";
import { resetDatabase } from "../../test-utils/fixtures.js";

beforeEach(async () => {
  await resetDatabase();
});

// Close the PrismaClient connection pool, so Jest does not wait for an open handle.
afterAll(async () => {
  await prisma.$disconnect();
});

test("full flow: register, then log in with the same credentials (US-01, US-02 validation)", async () => {
  // Arrange + Act: register a real user
  const registerRes = await request(app)
    .post("/api/auth/register")
    .send({ email: "alice@example.com", displayName: "Alice", password: "correcthorse" });

  expect(registerRes.status).toBe(201);
  const registeredUser = registerRes.body.user;

  // Act: log in as that user
  const loginRes = await request(app)
    .post("/api/auth/login")
    .send({ email: "alice@example.com", password: "correcthorse" });

  // Assert: login finds the same user that registration created
  expect(loginRes.status).toBe(200);
  expect(loginRes.body.user.id).toBe(registeredUser.id);
  expect(typeof loginRes.body.accessToken).toBe("string");
});

test("a registered account cannot log in with a wrong password (US-02 extension)", async () => {
  await request(app)
    .post("/api/auth/register")
    .send({ email: "alice@example.com", displayName: "Alice", password: "correcthorse" });

  const loginRes = await request(app)
    .post("/api/auth/login")
    .send({ email: "alice@example.com", password: "wrongpassword" });

  expect(loginRes.status).toBe(401);
  expect(loginRes.body.accessToken).toBeUndefined();
});
