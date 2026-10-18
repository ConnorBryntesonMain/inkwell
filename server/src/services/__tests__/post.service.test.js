// server/src/services/__tests__/post.service.test.js

import { jest } from "@jest/globals";

const mockPostRepository = { createWithTags: jest.fn(), searchPublished: jest.fn() };
const mockEventBus = { emit: jest.fn() };

jest.unstable_mockModule("../../repositories/post.repository.js", () => ({
  PostRepository: mockPostRepository,
}));
jest.unstable_mockModule("../../events/event-bus.js", () => ({
  EventBus: mockEventBus,
}));

const { PostService } = await import("../post.service.js");

test("publish() creates a PUBLISHED post and emits post.published", async () => {
  mockPostRepository.createWithTags.mockResolvedValue({ id: "p1", title: "Hello", status: "PUBLISHED" });

  const post = await PostService.publish({ authorId: "u1", title: "Hello", body: "World" });

  expect(post.status).toBe("PUBLISHED");
  expect(mockEventBus.emit).toHaveBeenCalledWith(
    "post.published",
    expect.objectContaining({ postId: "p1" })
  );
});

test("publish() rejects an empty title", async () => {
  await expect(
    PostService.publish({ authorId: "u1", title: "", body: "World" })
  ).rejects.toThrow();
});


test("search() rejects a negative page", async () => {
  await expect(
    PostService.search({ query: "x", page: -1, pageSize: 10 })
  ).rejects.toMatchObject({ code: "INVALID_PAGE" });
  expect(mockPostRepository.searchPublished).not.toHaveBeenCalled();
});

test("search() rejects a negative pageSize", async () => {
  await expect(
    PostService.search({ query: "x", page: 1, pageSize: -10 })
  ).rejects.toMatchObject({ code: "INVALID_PAGE_SIZE" });
  expect(mockPostRepository.searchPublished).not.toHaveBeenCalled();
});

test("search() rejects when page and pageSize are both negative", async () => {
  await expect(
    PostService.search({ query: "x", page: -1, pageSize: -10 })
  ).rejects.toMatchObject({ code: "INVALID_PAGE" });
  expect(mockPostRepository.searchPublished).not.toHaveBeenCalled();
});

test("search() passes a valid page and pageSize to the repository", async () => {
  const results = { posts: [{ id: "p1" }], hasMore: false };
  mockPostRepository.searchPublished.mockResolvedValue(results);

  await expect(
    PostService.search({ query: "x", page: 2, pageSize: 10 })
  ).resolves.toEqual(results);
  expect(mockPostRepository.searchPublished).toHaveBeenCalledWith({ query: "x", page: 2, pageSize: 10 });
});
