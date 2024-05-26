import { Op } from "sequelize";
import path from "path";
import fs from 'fs';
import Users from "../models/UserModel.js";
import Franchise from "../models/FranchiseModel.js";

export const getAllApprovedFranchise = async (req, res) => {
    try {
        const userFranchise = await Franchise.findAll({
            attributes: [ 'id', 'userId', 'namaFranchise', 
                        'nomorTelepon', 'emailPerusahaan','alamatWebsite', 
                        'deskripsiUsaha', 'modal', 'urlBanner', 
                        'statusApproval'],
            where: {
                statusApproval: 'approved'
            }
        });

        if(!userFranchise || userFranchise.length === 0){
            return res.status(404).json({
                msg: "Users franchise not found!"
            })
        };
        res.json(userFranchise);
    } catch (error) {
        console.error('Error getting all franchise:', error);
        res.sendStatus(500);
    }
};

export const getMeApprovedFranchise = async(req, res) => {
    try {
        const queryConditions = req.queryConditions;
        const userFranchise = await Franchise.findAll({
            attributes: [ 'id', 'userId', 'namaFranchise', 
                        'nomorTelepon', 'emailPerusahaan','alamatWebsite', 
                        'deskripsiUsaha', 'modal', 'urlBanner', 
                        'statusApproval'],
            where: {
                ...queryConditions,
                statusApproval: 'approved'
            }
        });
        if (!userFranchise || userFranchise.length === 0) {
            return res.status(404).json({
                msg: 'Franchises not found!'
            });
        };
        res.json(userFranchise);
    } catch (error) {
        console.error('Error getting all franchise with pending status:', error);
        res.sendStatus(500);
    }
};

export const getMeFranchise = async(req, res) => {
    try {
        const queryConditions = req.queryConditions;
        const userFranchise = await Franchise.findAll({
            attributes: [ 'id', 'userId', 'namaFranchise', 
                        'nomorTelepon', 'emailPerusahaan','alamatWebsite', 
                        'deskripsiUsaha', 'modal', 'urlBanner', 
                        'statusApproval'],
            where: {
                ...queryConditions,
            }
        });
        if (!userFranchise || userFranchise.length === 0) {
            return res.status(404).json({
                msg: 'Franchises not found!'
            });
        };
        res.json(userFranchise);
    } catch (error) {
        console.error('Error getting all franchise with pending status:', error);
        res.sendStatus(500);
    }
};

export const getPendingFranchise = async(req, res) => {
    try {
        const queryConditions = req.queryConditions;

        // Melakukan pencarian berdasarkan kondisi yang ditetapkan
        const franchises = await Franchise.findAll({
            attributes: [ 'id', 'userId', 'namaFranchise', 
                        'nomorTelepon', 'emailPerusahaan','alamatWebsite', 
                        'deskripsiUsaha', 'modal', 'bannerFranchise', 
                        'statusApproval'],
            where: {
                ...queryConditions,
                statusApproval: 'pending'
            }
        });

        if (!franchises || franchises.length === 0) {
            return res.status(404).json({
                msg: 'Franchises not found!'
            });
        }

        res.json(franchises);
    } catch (error) {
        console.error('Error getting all franchise with pending status:', error);
        res.sendStatus(500);
    }
};

export const getRejectedFranchise = async(req, res) => {
    try {
        const queryConditions = req.queryConditions;
 
        // Melakukan pencarian berdasarkan kondisi yang ditetapkan
        const franchises = await Franchise.findAll({
            attributes:[ 'id', 'userId', 'namaFranchise',
                    'nomorTelepon', 'emailPerusahaan','alamatWebsite', 
                    'deskripsiUsaha', 'modal', 'bannerFranchise', 
                    'statusApproval'],
            where: {
                ...queryConditions,
                statusApproval: 'rejected'
            }
        });

        if (!franchises || franchises.length === 0) {
            return res.status(404).json({
                msg: 'Franchises not found!'
            });
        }

        res.json(franchises);
    } catch (error) {
        console.error('Error getting all franchise with rejected status:', error);
        res.sendStatus(500);
    }
};

export const searchApprovedFranchise = async(req, res) => {
    let keyword = req.params.key
    try {
        const userFranchise = await Franchise.findAll({
            attributes: [ 'id', 'userId', 'namaFranchise', 
            'nomorTelepon', 'emailPerusahaan','alamatWebsite', 
            'deskripsiUsaha', 'modal', 'bannerFranchise', 
            'statusApproval'],
            where: {
                [Op.or]: [
                    {namaFranchise: { [Op.substring]: keyword }},
                ],
                statusApproval: 'approved'
            }
        });

        if(!userFranchise || userFranchise.length === 0) {
            return res.status(404).json({
                success: false,
                msg: 'Franchise tidak ditemukan'
            });
        };

        res.json({
            userFranchise,
            msg: "All Franchise has been loaded"
        });
    } catch (error) {
        console.error('Error getting all franchise:', error);
        res.sendStatus(500);
    }
}

export const addFranchise = async(req, res) => {
    try {
        const userId = req.decoded.id;

        const user = await Users.findOne({
            where: {
                id: userId
            }
        });
        if (!user) return res.status(404).json({ msg: 'User not found' });

        if(req.files === null) return res.status(400).json({msg: "No file uploaded"});
        const {namaFranchise, nomorTelepon, 
               emailPerusahaan, alamatWebsite,
               deskripsiUsaha, modal} = req.body;
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        const fileName = file.md5 + ext;
        const urlBanner = `${req.protocol}://${req.get("host")}/images/${fileName}`
        const allowedType = ['.png', '.jpeg', '.jpg'];
        

        if(!allowedType.includes(ext.toLowerCase()))return res.status(422).json({msg: "Invalid Images."})
        if(fileSize > 5000000)return res.status(422).json({msg: "Images must be less than 5MB."})
        file.mv(`./public/images/${fileName}`, async(err)=>{
            if(err) return res.status(500).json({msg: err.message});
            try {
                const newFranchise = await Franchise.create({
                    userId: userId,
                    namaFranchise: namaFranchise,
                    nomorTelepon: nomorTelepon,
                    emailPerusahaan: emailPerusahaan,
                    alamatWebsite: alamatWebsite,
                    deskripsiUsaha: deskripsiUsaha,
                    modal: modal,
                    bannerFranchise: fileName,
                    urlBanner: urlBanner
                });
                res.status(201).json({ msg: 'Data uploaded successfully', Franchise: newFranchise });
            } catch (error) {
                console.log(error.message);
            }
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};

export const updateStatusFranchise = async(req, res) => {
    try {
        const {id} = req.params;
        const {statusApproval} = req.body;
        console.log(id);
        const franchiseToUpdate = await Franchise.findOne({
            where: {
                id: id
            }
        });
        if(!franchiseToUpdate) return res.status(404).json({ msg: 'Franchise not found!' });
        const data = await Franchise.update({
            statusApproval: statusApproval
        },{
            where: {
                id: id
            }
        });
        res.json({
            msg: 'Franchise status updated successfully',
            data: statusApproval
        });
    } catch (error) {
        console.log(error);
        console.error('Error updating status:', error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
}

export const deleteFranchise = async(req, res) => {
    try {
        const {id} = req.params;
        const franchiseToDelete = await Franchise.findOne({
            where: {
                id: id
            }
        });
        
        if(!franchiseToDelete) return res.status(404).json({ msg: 'Franchise not found!' });
        const filePath = `./public/images/${franchiseToDelete.bannerFranchise}`;
        fs.unlinkSync(filePath);

        const data = await Franchise.destroy({
            where: {
                id: id
            }
        });
        res.status(200).json({ msg: 'Franchise deleted successfully!', franchise: data });
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error' });
        console.log(error);
    }
}

export const getFeaturedFranchise = async(req, res) => {
    try {
        const currentDate = new Date();
        const featuredFranchises = await Franchise.findAll({
            attributes: [ 'id', 'userId', 'namaFranchise', 
                    'nomorTelepon', 'emailPerusahaan','alamatWebsite', 
                    'deskripsiUsaha', 'modal', 'bannerFranchise', 
                    'statusApproval'],
            where: {
                isFeatured: true,
                featuredUntil: {
                    [Op.gt]: currentDate
                }
            }
        });
        res.json(featuredFranchises);
    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil data waralaba featured:', error);
        res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data waralaba featured.' });
    }
} 