// client/src/components/__tests__/PostCard.security.test.jsx
//
// Section 1.1 row 4's mitigation, verified as a regression test:
// a post body containing a script tag must render as inert text,
// never as executable markup.

import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import { PostCard } from "../PostCard";

test("renders post body as text, never as executable HTML", () => {
  const maliciousPost = {
    id: "1",
    title: "Test",
    body: "<script>window.__xss = true;</script>",
    author: { displayName: "Attacker" },
  };

  render(<PostCard post={maliciousPost} />);

  expect(screen.getByText(/<script>/)).toBeInTheDocument(); // rendered as literal text
  expect(window.__xss).toBeUndefined(); // never executed
});
