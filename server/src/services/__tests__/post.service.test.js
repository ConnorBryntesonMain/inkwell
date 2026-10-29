// server/src/services/__tests__/post.service.test.js

import { jest } from "@jest/globals";

const mockPostRepository = { createWithTags: jest.fn(), searchPublished: jest.fn(), findPublished: jest.fn() };
const mockEventBus = { emit: jest.fn() };

jest.unstable_mockModule("../../repositories/post.repository.js", () => ({
  PostRepository: mockPostRepository,
}));
jest.unstable_mockModule("../../events/event-bus.js", () => ({
  EventBus: mockEventBus,
}));

const { PostService, MAX_PAGE_SIZE } = await import("../post.service.js");

beforeEach(() => {
  jest.clearAllMocks();
});

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

// Lecture 15, Exercise 1: pageSize upper bound (Denial of Service mitigation)

test("listPublished() clamps an oversized pageSize to MAX_PAGE_SIZE", async () => {
  mockPostRepository.findPublished.mockResolvedValue({ posts: [], hasMore: false });

  const result = await PostService.listPublished({ page: 1, pageSize: 1000000 });

  expect(mockPostRepository.findPublished).toHaveBeenCalledWith({ page: 1, pageSize: MAX_PAGE_SIZE });
  expect(result.pageSize).toBe(MAX_PAGE_SIZE);
});

test("listPublished() keeps a pageSize exactly at MAX_PAGE_SIZE (boundary)", async () => {
  mockPostRepository.findPublished.mockResolvedValue({ posts: [], hasMore: false });

  await PostService.listPublished({ page: 1, pageSize: MAX_PAGE_SIZE });

  expect(mockPostRepository.findPublished).toHaveBeenCalledWith({ page: 1, pageSize: MAX_PAGE_SIZE });
});

test("listPublished() clamps a pageSize one above MAX_PAGE_SIZE (boundary)", async () => {
  mockPostRepository.findPublished.mockResolvedValue({ posts: [], hasMore: false });

  await PostService.listPublished({ page: 1, pageSize: MAX_PAGE_SIZE + 1 });

  expect(mockPostRepository.findPublished).toHaveBeenCalledWith({ page: 1, pageSize: MAX_PAGE_SIZE });
});

test("search() clamps an oversized pageSize to MAX_PAGE_SIZE", async () => {
  mockPostRepository.searchPublished.mockResolvedValue({ posts: [], hasMore: false });

  await PostService.search({ query: "x", page: 1, pageSize: 1000000 });

  expect(mockPostRepository.searchPublished).toHaveBeenCalledWith({ query: "x", page: 1, pageSize: MAX_PAGE_SIZE });
});
