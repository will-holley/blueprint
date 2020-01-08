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

const handleInvalidJWT = (err, req, res, next) => {
  if (err.code === "invalid_token") {
    res.status(401);
    return res.send({
      error: {
        expired: err.inner.name === "TokenExpiredError",
        message: "invalid token"
      }
    });
  }
  next();
};

// Protected routes can only be accessed by logged in users
const requiresAuthentication = (req, res, next) => {
  if (!req.user) return res.sendStatus(403);
  next();
};

/**
 * TODO!
 * Does this work?
 * https://expressjs.com/en/guide/error-handling.html
 */
const catchErrors = (req, res, next) => {
  try {
    return next();
  } catch (error) {
    console.info("ERROR:", error);
    res.send(error.message);
  }
};

export { requiresAuthentication, handleInvalidJWT, useJWT, catchErrors };
