import express from "express";
import { verifyToken } from "../middleware/VerifyToken.js";
import { authUserParams, adminOnly } from "../middleware/AuthMiddleware.js";
import { buyFeatured, getTransaction } from "../controllers/transaction.js";

const transactionRoute = express.Router();

transactionRoute.post( '/buy-featured/:id', verifyToken, buyFeatured )
transactionRoute.get( '/transaction', verifyToken, getTransaction )

export default transactionRoute;