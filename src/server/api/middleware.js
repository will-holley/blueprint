import jwt from "express-jwt";

const useJWT = jwt({
  secret: process.env.JWT_SIGNATURE,
  credentialsRequired: false,
  getToken: req => {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      return req.headers.authorization.split(" ")[1];
    }
    return null;
  }
});

// Protected routes can only be accessed by logged in users
const requiresAuthentication = (req, res, next) => {
  if (!req.user) return res.sendStatus(403);
  next();
};

export { useJWT, requiresAuthentication };
