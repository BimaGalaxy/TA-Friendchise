import express from "express";
import { login, logOut, register, forgotPassword, initiateResetPassword } from "../controllers/Auth.js"
import { refreshToken } from "../controllers/RefreshToken.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const authRoute = express.Router();

authRoute.post('/register',register);
authRoute.post('/login', login);
authRoute.delete('/logout', logOut);
authRoute.post('/forgot-password', verifyToken, forgotPassword );
authRoute.post('/reset-password/:token', verifyToken, initiateResetPassword );

authRoute.get('/token', refreshToken);

export default authRoute;