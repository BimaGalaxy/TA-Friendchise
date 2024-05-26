import argon2 from "argon2";
import Users from "../models/UserModel.js";

export const getProfile = async (req, res) => {
    try {
        const user = await Users.findOne({
            where: {
                id: req.decoded.id, // Ambil uuid dari token
            },
            attributes: ['id', 'name', 'email', 'role']
        });
        if (user) {
            res.json(user);
        } else {
            res.sendStatus(404).json({msg: 'User tidak ditemukan'});
        }
    } catch (error) {
       console.error('Error getting profile:', error);
       res.sendStatus(500);
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await Users.findAll({
            attributes: ['id', 'name', 'email', 'role'], 
            where: {
                role: 'user'
            }
        });
        res.json(users);
    } catch (error) {
        console.error('Error getting all users:', error);
        res.sendStatus(500);
    }
};

export const getAllAdmin = async (req, res) => {
    try {
        const users = await Users.findAll({
            attributes: ['id', 'name', 'email', 'role'], 
            where: {
                role: 'admin'
            }
        });
        res.json(users);
    } catch (error) {
        console.error('Error getting all admin:', error);
        res.sendStatus(500);
    }
};

export const updateUser = async(req, res) => {
    try {
        const { id } = req.params;
        const {name, role, email} = req.body;
        const userToUpdate = await Users.findOne({
            where: {
                id: id
            }
        });
        if (!userToUpdate) return res.status(404).json({ msg: 'User not found' });
        await Users.update({
            name: name,
            role: role,
            email: email
        }, {
            where: {
                id: id
            }
        });
        res.status(200).json({msg: 'User updated successfully'});   
    } catch (error) {
        console.log(error);
        console.error('Error updating user:', error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
}

export const addUser = async(req, res) => {
    const {name, email, role, password, confPassword} = req.body;
    if(password !== confPassword) return res.status(400).json({msg: "Password dan confirm password tidak cocok"});
    try {
        const existingUser = await Users.findOne({
            where: {
                email: email,
            }
        });
        if (existingUser) return res.status(400).json({ msg: "Email sudah terdaftar." });
        const hashPassword = await argon2.hash(password);
        await Users.create({
            name: name,
            email: email,
            role: role,
            password: hashPassword
        });
        res.status(201).json({msg: "Penambahan akun berhasil!"});
    } catch (error) {
        console.log(error);
        res.status(500)
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userToDelete = await Users.findOne({
            where: {
                id: id
            }
        });

        if (!userToDelete) {
            return res.status(404).json({ msg: 'User not found' });
        }

        await Users.destroy({
            where: {
                id: id
            }
        });

        res.json({ msg: 'User deleted successfully!' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ msg: 'Internal Server Error' });
        console.log(error);
    }
};
