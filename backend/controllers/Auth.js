import argon2 from "argon2";
import jwt from "jsonwebtoken";
import Users from "../models/UserModel.js";
import crypto from "crypto";
import nodemailer from "nodemailer"

export const register = async(req, res) => {
    const {name, email, role, password, confPassword} = req.body;
    if(password !== confPassword) return res.status(400).json({ //bad request
        msg: "Password dan Confirm password tidak cocok"
    });
    try {
        const existingUser = await Users.findOne({
            where: {
                email: email
            }
        });
        if(existingUser) return res.status(400).json({ //bad request
            msg: "Email sudah terdaftar"
        });
        const hashPassword = await argon2.hash(password);
        await Users.create({
            name: name,
            email: email,
            role: role,
            password: hashPassword
        });
        res.status(201).json({ //created
            msg: "Register berhasil!"
        });
    } catch (error) {
        res.json({error: error});
        console.log(error);
    }  
};

export const login = async(req, res) => {
    try {
        const user = await Users.findOne({
            where: {
                email: req.body.email
            }
        });
        if(!user) return res.status(404).json({ //not found
            msg: "Email tidak terdaftar!"
        });
        const match = await argon2.verify(user.password, req.body.password);
        if(!match) return res.status(400).json({ //bad request 
            msg: "Password salah!"
        });
        const id = user.id;
        const name = user.name;
        const email = user.email;
        const role = user.role;
        const accessToken = jwt.sign({id, name, email, role}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '15s'
        });
        const refreshToken = jwt.sign({id, name, email, role}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '1d'
        });
        await Users.update({refresh_token: refreshToken}, {
            where:{
                id: id
            }
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ accessToken })
    } catch (error) {
        res.json({error})
        console.log(error);
    }
};

export const logOut = async(req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(204); // no content
        const user = await Users.findAll({
            where: {
                refresh_token: refreshToken
            }
        });
        if(!user[0]) return res.sendStatus(204); // no content
        const userId = user[0].id;
        await Users.update({refresh_token: null}, {
            where: {
                id: userId
            }
        });
        res.clearCookie('refreshToken');
        return res.sendStatus(200).json({msg: "Logout"}); //Ok
    } catch (error) {
        res.status(401)
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const email = req.decoded.email;
        const user = await Users.findOne({
            where: { email: email }
        });
        if (!user) return res.status(404).json({ msg: 'Email not found' });

        const token = crypto.randomBytes(20).toString('hex');
        await Users.update({ resetToken: token }, { where: { email: email } });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset',
            text: `Ini adalah link untuk reset password kamu: http://localhost:8000/reset-password/${token}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).send('Error sending email');
            } else {
                console.log(`Email sent: ${info.response}`);
                return res.status(200).send('Tolong cek email kamu');
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

export const initiateResetPassword = async(req, res) => {
    const { token } = req.params;
    const { password, confPassword } = req.body;
    if(password !== confPassword) return res.status(400).json({ //bad request
        msg: "Password dan Confirm password tidak cocok"
    });
    try {
        const user = await Users.findOne({
            where: {
                resetToken: token
            }
        });
        if(!user) return res.status(400).json({ //bad request
            msg: "Invalid or expired token"
        });
        const hashPassword = await argon2.hash(password);
        await Users.update({
            password: hashPassword
        }, {
            where: {
                resetToken: token
            }
        });
        res.status(201).json({ //created
            msg: "Reset password berhasil!"
        });
    } catch (error) {
        res.json({error: error});
        console.log(error);
    }
};
