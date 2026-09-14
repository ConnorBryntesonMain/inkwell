// server/src/utils/validation.js
//
// A functionally cohesive (Lecture 4, Section 4.7) validation helper,
// extracted proactively (Section 5.4) to avoid duplicating the same
// check inside both AuthService and PostService.

export class ValidationError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

export function assertNonEmpty(value, fieldName, code) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ValidationError(`${fieldName} is required.`, code);
  }
}
