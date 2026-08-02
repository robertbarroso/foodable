import requireAuth from "./requireAuth.js";
import fakeAuth from "./fakeAuth.js";

/**
 * Prefer a real Bearer token when present; otherwise fall back to fakeAuth
 * so grocery keeps working until shared auth stores a session token.
 */
export default function requireAuthOrFake(req, res, next) {
  if (req.headers.authorization?.startsWith("Bearer ")) {
    return requireAuth(req, res, next);
  }
  return fakeAuth(req, res, next);
}
