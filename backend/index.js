import express from "express";
import fileUpload from 'express-fileupload';
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import db from "./config/Database.js";
import userRoute from "./routes/UserRoute.js";
import authRoute from "./routes/AuthRoute.js";
import franchiseRoute from "./routes/FranchiseRoute.js";
import transactionRoute from "./routes/TransactionRoute.js";
// import Transactions from "./models/TransactionModel.js";
// import Users from "./models/UserModel.js";
// import Franchise from "./models/FranchiseModel.js";
const app = express();
dotenv.config();

try {
    await db.authenticate();
    console.log("Database connect");
    // await db.sync({alter: true});
    // await db.sync();
} catch (error) {
    console.error(error);
}

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));
app.use(fileUpload());
app.use(userRoute);
app.use(authRoute);
app.use(franchiseRoute);
app.use(transactionRoute);

app.listen(8000, ()=>{
    console.log("sever run at port 80000");
});