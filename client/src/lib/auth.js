// client/src/lib/auth.js
//
// Minimal token storage. No auth context or global state library has
// been introduced yet, so we keep this deliberately small: PostEditor
// reads the stored token to attach it to authenticated requests.
const TOKEN_KEY = "inkwell_access_token";

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}
