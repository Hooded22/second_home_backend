import express from "express";
import cors from "cors";
import authRoute from "./src/auth/router";
import passport from "passport";
import { initialize } from "./src/config/passport.config";
import feedbackRoute from "./src/feedbacks/router";
import roomRouter from "./src/room/router";
import customerRouter from "./src/customers/router";
import reservationRouter from "./src/reservation/router";
initialize(passport);

const app = express();

app.use(express.json());
app.use(cors());
app.use(passport.initialize());

app.use("/auth", authRoute);
app.use("/feedback", feedbackRoute);
app.use("/room", roomRouter);
app.use("/customer", customerRouter);
app.use("/reservation", reservationRouter);

export default app;
