// server/src/dto/user.dto.js
//
// Sensitive-data-exposure prevention, made structural:
// one function that defines exactly what's safe to expose, so no route
// handler can accidentally leak a field by forgetting to strip it.

export function toPublicUser(user) {
  return {
    id: user.id,
    displayName: user.displayName,
    // deliberately excluded: email, passwordHash, and any future
    // sensitive field — an allowlist, not a denylist, by design
  };
}
