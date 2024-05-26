import express from "express";
import { verifyToken } from "../middleware/VerifyToken.js";
import { authFranchiseParams, authUserQuery, adminOnly } from "../middleware/AuthMiddleware.js";
import {getAllApprovedFranchise, getPendingFranchise,
        getRejectedFranchise, addFranchise, 
        updateStatusFranchise, getMeApprovedFranchise,
        getFeaturedFranchise, deleteFranchise, searchApprovedFranchise, getMeFranchise } from "../controllers/Franchise.js";


const franchiseRoute = express.Router();

// User
// All aprroved franchise
franchiseRoute.get('/franchise', getAllApprovedFranchise );
franchiseRoute.get('/featured', getFeaturedFranchise );
franchiseRoute.get('/franchise/search/:key', searchApprovedFranchise );

franchiseRoute.get('/franchise/approved', verifyToken, authUserQuery, getMeApprovedFranchise );
franchiseRoute.get('/franchise/me', verifyToken, authUserQuery, getMeFranchise );
franchiseRoute.get('/franchise/pending', verifyToken, authUserQuery, getPendingFranchise  );
franchiseRoute.get('/franchise/rejected', verifyToken, authUserQuery, getRejectedFranchise  );
franchiseRoute.post('/franchise/add', verifyToken, addFranchise );
franchiseRoute.put('/admin/franchise/status/:id', verifyToken, adminOnly, updateStatusFranchise );
franchiseRoute.delete('/franchise/delete/:id', verifyToken, authFranchiseParams, deleteFranchise);



export default franchiseRoute;