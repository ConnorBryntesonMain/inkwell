// client/src/components/PostEditor.jsx
//
// Lecture 7: same state machine as Lecture 6 (Idle -> Editing ->
// Publishing -> Error), now with labeled, accessible fields and error
// messaging anchored to the field it concerns (Section 4.2, golden
// rule "reduce memory load"; Section 4.6, "recognition not recall").
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../lib/auth";

const STATES = { IDLE: "idle", EDITING: "editing", PUBLISHING: "publishing" };

export function PostEditor() {
  const [status, setStatus] = useState(STATES.IDLE);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  async function handlePublish() {
    setStatus(STATES.PUBLISHING);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ title, body }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        setErrorMessage(error.message);
        setStatus(STATES.EDITING);
        return;
      }

      navigate("/"); // Section 5.2: confirm by showing the published post in the feed
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus(STATES.EDITING);
    }
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => { e.preventDefault(); handlePublish(); }}
    >
      <div>
        <label htmlFor="post-title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          id="post-title"
          value={title}
          onChange={(e) => { setTitle(e.target.value); setStatus(STATES.EDITING); }}
          className="mt-1 block w-full rounded border-gray-300 shadow-sm"
          aria-describedby={errorMessage ? "post-error" : undefined}
        />
      </div>

      <div>
        <label htmlFor="post-body" className="block text-sm font-medium text-gray-700">
          Body
        </label>
        <textarea
          id="post-body"
          value={body}
          onChange={(e) => { setBody(e.target.value); setStatus(STATES.EDITING); }}
          rows={10}
          className="mt-1 block w-full rounded border-gray-300 shadow-sm"
        />
      </div>

      {errorMessage && (
        <p id="post-error" role="alert" className="text-sm text-red-600">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === STATES.PUBLISHING}
        className="rounded bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {status === STATES.PUBLISHING ? "Publishing…" : "Publish"}
      </button>
    </form>
  );
}
