import supabase from "../supabase.js";

/**
 * Verifies Authorization: Bearer <access_token> via Supabase Auth.
 * Sets req.user = { id } on success; responds 401 otherwise.
 */
export default async function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }

  const token = header.slice("Bearer ".length).trim();

  if (!token) {
    return res.status(401).json({ error: "Missing access token" });
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    return res.status(401).json({ error: "Invalid or expired access token" });
  }

  req.user = { id: data.user.id };
  next();
}
