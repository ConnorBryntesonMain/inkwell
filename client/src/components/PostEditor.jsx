// client/src/components/PostEditor.jsx
//
// Implements the state machine from Section 4.4: Idle -> Editing ->
// Publishing -> Published | Error -> Editing.

import { useState } from "react";

const STATES = { IDLE: "idle", EDITING: "editing", PUBLISHING: "publishing", ERROR: "error" };

export function PostEditor({ onPublished }) {
  const [status, setStatus] = useState(STATES.IDLE);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  async function handlePublish() {
    setStatus(STATES.PUBLISHING);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        setErrorMessage(error.message);
        setStatus(STATES.EDITING);
        return;
      }

      const post = await response.json();
      onPublished?.(post);
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus(STATES.EDITING);
    }
  }

  return (
    <div>
      <input
        value={title}
        onChange={(e) => { setTitle(e.target.value); setStatus(STATES.EDITING); }}
        placeholder="Post title"
      />
      <textarea
        value={body}
        onChange={(e) => { setBody(e.target.value); setStatus(STATES.EDITING); }}
        placeholder="Write your post..."
      />
      {errorMessage && <p role="alert">{errorMessage}</p>}
      <button onClick={handlePublish} disabled={status === STATES.PUBLISHING}>
        {status === STATES.PUBLISHING ? "Publishing…" : "Publish"}
      </button>
    </div>
  );
}
