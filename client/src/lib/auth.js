// client/src/lib/auth.js
//
// Verification fix: PostEditor needs to know the logged-in user's id to
// send as authorId — the server doesn't derive identity from the token
// itself until Lecture 15's requireAuth middleware, so until then the
// client is the only source of authorId. Without this, every real
// publish attempt below fails server-side with a Prisma
// "Argument `author` is missing" error, invisible to every prior unit
// and integration test because they all supplied authorId directly.

const TOKEN_KEY = "inkwell_access_token";
const USER_KEY = "inkwell_user";

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearUser() {
  localStorage.removeItem(USER_KEY);
}
