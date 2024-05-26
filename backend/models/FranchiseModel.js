import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";
const {DataTypes} = Sequelize;

const Franchise = db.define('franchise',{
    userId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }, 
    namaFranchise:{
        type: DataTypes.STRING,
        validate: {
            notEmpty: false
        }
    },
    nomorTelepon:{
        type: DataTypes.STRING,
        validate: {
            notEmpty: true
        }
    },
    emailPerusahaan:{
        type: DataTypes.STRING,
        validate: {
            notEmpty: true,
            isEmail : true
        }
    },
    alamatWebsite:{
        type: DataTypes.STRING,
    },
    deskripsiUsaha:{
        type: DataTypes.STRING,
        validate: {
            notEmpty: true
        }
    },
    modal:{
        type: DataTypes.DOUBLE,
        validate: {
            notEmpty: true 
        }
    },
    bannerFranchise:{
        type: DataTypes.STRING,
    },
    urlBanner:{
        type: DataTypes.STRING,
    },
    statusApproval:{
        type: DataTypes.ENUM(['pending', 'approved', 'rejected']),
        defaultValue: 'pending'
    },
    isFeatured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    featuredUntil: {
        type: DataTypes.DATE
    },
},{
    freezeTableName: true
}) 

// relasi userAdminId
Users.hasMany(Franchise , { as: 'franchise' });
Franchise.belongsTo(Users, {as: 'users', foreignKey: 'userId'});

export default Franchise;