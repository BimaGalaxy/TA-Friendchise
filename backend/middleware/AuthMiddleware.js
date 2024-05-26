import jwt from "jsonwebtoken";
import Users from "../models/UserModel.js"
import Franchise from "../models/FranchiseModel.js";

export const adminOnly = async (req, res, next) => {
    try {
        if (req.decoded.role === 'admin') {
            next();
        } else {
            res.status(403).json({ msg: 'Access forbidden: admin role required' });
        }
    } catch (error) {
        console.log(error);
        return res.status(403).json({ msg: 'Access forbidden' }); 
    }
};

// untuk edit jika user hanya bisa mengedit miliknya sendiri, dan jika jika admin bisa mengedit semua data
export const authUserParams = async (req, res, next) => {
    try {
        const { id } = req.params;
        const role = req.decoded.role;
        const userId = req.decoded.id;

        if (role === 'admin') {
            return next();
        }

        if (role === 'user' && id === userId) {
            return next();
        }
        return res.status(403).json({ msg: 'Access forbidden! You do not have permission.' });
    } catch (error) {
        console.error('Error checking permissions:', error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};

export const authFranchiseParams = async (req, res, next) => {
    try {
        const { id } = req.params;
        const role = req.decoded.role;
        const userIdFromToken = req.decoded.id;

        // Temukan waralaba berdasarkan ID yang diberikan
        const franchise = await Franchise.findByPk(id);

        if (!franchise)return res.status(404).json({ msg: 'Franchise not found' });

        if (role === 'admin') {
            return next();
        }

        if (role === 'user' && franchise.userId === userIdFromToken) {
            // Jika pengguna adalah pemilik waralaba, izinkan penghapusan
            return next();
        }
        return res.status(403).json({ msg: 'Access forbidden! You do not have permission.' });
    } catch (error) {
        console.error('Error checking permissions:', error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};

// untuk set condition, jika admin bisa mendapat semua data namun jika user hanya bisa mendapat data miliknya sendiri
export const authUserQuery = (req, res, next) => {
    try {
        const userId = req.decoded.id;
        const role = req.decoded.role;

        // Tentukan kondisi pencarian berdasarkan peran pengguna
        let queryConditions = {};
        if (role === 'admin') {
            // Jika role admin, tidak ada filter pada userId
            queryConditions = {};
        } else if (role === 'user') {
            queryConditions = { userId: userId };
        } else {
            // Jika role tidak dikenal, return 403 Forbidden
            return res.status(403).json({
                msg: 'Access denied'
            });
        }

        // Simpan `queryConditions` di `req` agar dapat digunakan dalam handler
        req.queryConditions = queryConditions;
        next(); // Lanjut ke handler berikutnya
    } catch (error) {
        console.error('Error in setQueryConditions middleware:', error);
        res.sendStatus(500);
    }
};