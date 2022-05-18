import express from "express";
import cors from "cors";
import authRoute from "./src/routes/authRoute";
import passport from "passport";
import { initialize } from './src/config/passport.config'
import feedbackRoute from './src/routes/feedbackRoutes';
import roomRouter from "./src/routes/roomRoute";
import customerRouter from "./src/routes/customerRoute";
initialize(passport);

const app = express();

app.use(express.json());
app.use(cors());
app.use(passport.initialize());

app.use("/auth", authRoute);
app.use('/feedback', feedbackRoute);
app.use('/room', roomRouter)
app.use('/customer', customerRouter)


export default app;
