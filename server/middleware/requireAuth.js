import { createSupabaseAuthClient } from "../supabase.js";

// next: Go to the next route handler.
export default async function requireAuth(req, res, next) {
  try {
    // Save the incoming authorization from the header.
    const auth_header = req.headers.authorization;

    // Collect the access_token from the header and clean it up, return null otherwise

    console.log("AUTH HEADER:", req.headers.authorization);

    const access_token = auth_header?.startsWith("Bearer ")
      ? auth_header.slice(7)
      : null;

    console.log("TOKEN RECEIVED:", access_token);
    // If no token was sent
    if (!access_token) {
      return res.status(401).json({
        error: "ERROR: Missing token",
      });
    }

    const supabaseAuth = createSupabaseAuthClient();

    const { data, error } = await supabaseAuth.auth.getUser(access_token);

    if (error || !data.user) {
      return res.status(401).json({
        error: "ERROR: Invalid token",
      });
    }

    req.user = {
      id: data.user.id,
      email: data.user.email,
    };

    return next();
  } catch (error) {
    console.error("ERROR: Requiring auth failed");
    return res.status(500).json({
      error: "ERROR: Require auth failed - server couldn't validate token",
    });
  }
}
