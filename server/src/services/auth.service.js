// server/src/services/auth.service.js
//
// Implements Section 5.2's processing narratives exactly, in order.

import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/user.repository.js";
import { assertNonEmpty, ValidationError } from "../utils/validation.js";
import { TokenService } from "./token.service.js";

class EmailAlreadyRegisteredError extends Error {}
class WeakPasswordError extends Error {}
class InvalidCredentialsError extends Error {}

const MIN_PASSWORD_LENGTH = 8;

export const AuthService = {
  async register({ email, displayName, password }) {
    assertNonEmpty(email, "email", "MISSING_EMAIL");
    assertNonEmpty(displayName, "displayName", "MISSING_DISPLAY_NAME");
    assertNonEmpty(password, "password", "MISSING_PASSWORD");

    const existing = await UserRepository.findByEmail(email);
    if (existing) {
      throw new EmailAlreadyRegisteredError();
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      throw new WeakPasswordError();
    }

    const passwordHash = await bcrypt.hash(password, 10);

    let user;
    try {
      user = await UserRepository.create({ email, displayName, passwordHash });
    } catch (err) {
      // Defense in depth (Lecture 4, Section 6.2): the DB's @unique
      // constraint may reject a race-condition duplicate that slipped
      // past the check above (Section 4.4's concurrency note).
      throw new EmailAlreadyRegisteredError();
    }

    const tokens = TokenService.issueTokens(user);
    return { user, ...tokens };
  },

  async login({ email, password }) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) {
      throw new InvalidCredentialsError();
    }

    const tokens = TokenService.issueTokens(user);
    return { user, ...tokens };
  },
};

export { EmailAlreadyRegisteredError, WeakPasswordError, InvalidCredentialsError };
