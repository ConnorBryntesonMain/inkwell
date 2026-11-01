// client/src/components/LoginForm.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveToken, saveUser } from "../lib/auth";

const STATES = { IDLE: "idle", EDITING: "editing", SUBMITTING: "submitting" };

export function LoginForm() {
  const [status, setStatus] = useState(STATES.IDLE);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  async function handleLogin() {
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
        setStatus(STATES.EDITING);
        return;
      }

      const { accessToken, user } = await response.json();
      saveToken(accessToken);
      saveUser(user);
      navigate("/");
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus(STATES.EDITING);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Log In</h1>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <div>
          <label
            htmlFor="login-email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setStatus(STATES.EDITING);
            }}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm"
            aria-describedby={errorMessage ? "login-error" : undefined}
          />
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setStatus(STATES.EDITING);
            }}
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
          className="w-full md:w-auto min-h-[44px] rounded bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {status === STATES.SUBMITTING ? "Logging in…" : "Log In"}
        </button>
      </form>
    </div>
  );
}
