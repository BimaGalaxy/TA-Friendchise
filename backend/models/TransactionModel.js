import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";
import Franchise from "./FranchiseModel.js";

const { DataTypes } = Sequelize;

const Transactions = db.define('transactions', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    franchiseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    },
    amount: {
        type: DataTypes.DOUBLE,
        allowNull: false
    }
});

Users.hasMany(Transactions, { as: 'transactions' })
Transactions.belongsTo(Users, {as: 'users', foreignKey: 'userId' });

Franchise.hasMany(Transactions, { as: 'transactions' })
Transactions.belongsTo(Franchise, {as: 'franchise', foreignKey: 'franchiseId' });

export default Transactions;
