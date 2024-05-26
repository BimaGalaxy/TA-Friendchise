import express from "express";
import { verifyToken } from "../middleware/VerifyToken.js";
import { getAllUsers, getAllAdmin, getProfile, addUser, updateUser, deleteUser } from "../controllers/User.js";
import { authUserParams, adminOnly } from "../middleware/AuthMiddleware.js";


const userRoute = express.Router();

// User
userRoute.get('/profile', verifyToken, getProfile);

// Users can only delete their own accounts, but admin can delete all user accounts.
userRoute.delete('/users/:id', verifyToken, authUserParams, deleteUser);

// Admin Only
userRoute.get('/admin', verifyToken, adminOnly, getAllAdmin );
userRoute.get('/admin/users', verifyToken, adminOnly, getAllUsers );
userRoute.post('/admin/users', verifyToken, adminOnly, addUser);
userRoute.put('/admin/users/:id', verifyToken, adminOnly, updateUser);


export default userRoute;