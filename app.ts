import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

//ROUTES
app.get("/:elo", (req, res) => {
  res.send(req.params.elo);
});

export default app;
