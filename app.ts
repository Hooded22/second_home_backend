import express from "express";
import cors from "cors";
import authRoute from "./src/routes/authRoute";

const app = express();

app.use(express.json());
app.use(cors());

//ROUTES
app.use("/auth", authRoute);

export default app;
