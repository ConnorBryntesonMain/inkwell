// client/src/components/__tests__/PostEditor.test.jsx
//
// A component integration test: renders PostEditor for real, simulates
// real user interaction, and mocks only the network boundary (fetch) —
// everything else (React state, event handlers, rendering) is real.

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi, test, expect, beforeEach } from "vitest";
import { PostEditor } from "../PostEditor";

beforeEach(() => {
  global.fetch = vi.fn();
});

test("shows an error message anchored to the form when publish fails", async () => {
  global.fetch.mockResolvedValue({
    ok: false,
    json: async () => ({ error: { message: "Title is required." } }),
  });

  render(<PostEditor />, { wrapper: MemoryRouter });

  await userEvent.type(screen.getByLabelText(/body/i), "Some content");
  await userEvent.click(screen.getByRole("button", { name: /publish/i }));

  expect(await screen.findByRole("alert")).toHaveTextContent("Title is required.");
});
