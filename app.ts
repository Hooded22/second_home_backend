import express from "express";
import cors from "cors";
import authRoute from "./src/routes/authRoute";
import passport from "passport";
import {initialize} from './src/config/passport.config'
initialize(passport);

const app = express();

app.use(express.json());
app.use(cors());
app.use(passport.initialize());

app.use("/auth", authRoute);


export default app;
