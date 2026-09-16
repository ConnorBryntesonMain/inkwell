// client/src/components/LoginForm.jsx
//
// Calls POST /api/auth/login (Lecture 6) for the first time from the
// client. Same accessible-field, single-status-value discipline as
// PostEditor (Section 6.3).
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveToken } from "../lib/auth";

const STATES = { IDLE: "idle", SUBMITTING: "submitting" };

export function LoginForm() {
  const [status, setStatus] = useState(STATES.IDLE);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setStatus(STATES.SUBMITTING);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const { error } = await response.json();
        setErrorMessage(error.message);
        setStatus(STATES.IDLE);
        return;
      }
      const { accessToken } = await response.json();
      saveToken(accessToken);
      navigate("/");
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus(STATES.IDLE);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleLogin}>
      <div>
        <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded border-gray-300 shadow-sm"
          aria-describedby={errorMessage ? "login-error" : undefined}
        />
      </div>
      <div>
        <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded border-gray-300 shadow-sm"
        />
      </div>
      {errorMessage && (
        <p id="login-error" role="alert" className="text-sm text-red-600">
          {errorMessage}
        </p>
      )}
      <button
        type="submit"
        disabled={status === STATES.SUBMITTING}
        className="rounded bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {status === STATES.SUBMITTING ? "Logging in…" : "Log In"}
      </button>
    </form>
  );
}
