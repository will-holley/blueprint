import express from "express";
import bodyParser from "body-parser";
// Routers
import nodeRouter from "./node";
import documentRouter from "./document";
import userRouter from "./user";
// Middleware
import { useJWT, handleInvalidJWT } from "./middleware";

//$ Router Setup
const router = express({
  caseSensitive: false
});

//$ Add Middlewares
// parse request body as json
router.use(bodyParser.json());
// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: true }));
// jwt for auth
router.use(useJWT);
// TODO: possibly move this below route attachment
router.use(handleInvalidJWT);

//$ Health check the API
router.get("/", (req, res) => res.sendStatus(200));

//$ Attach models routes.
router.use("/node", nodeRouter);
router.use("/document", documentRouter);
router.use("/user", userRouter);

// Export
export default router;
