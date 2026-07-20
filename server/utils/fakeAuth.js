// This utility/middleware will act as if a user is logged in using john.doe@example.com (John Doe) in the Supabase profile table.
// Great to use to mimic authentication, make sure it is used to test routes that will require it.

export default function fakeAuth(req, res, next) {
  req.user = {
    id: "4cf6e045-fa38-4019-9d25-5d0075962464",
  };

  next();
}
