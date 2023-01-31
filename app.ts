import express from "express";
import cors from "cors";
import authRoute from "./src/routes/authRoute";
import passport from "passport";
import { initialize } from "./src/config/passport.config";
import feedbackRoute from "./src/routes/feedbackRoutes";
import roomRouter from "./src/rooms/roomRoute";
import customerRouter from "./src/routes/customerRoute";
import reservationRouter from "./src/routes/reservationRoute";
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
