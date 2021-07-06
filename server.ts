import mongoose, { CallbackError } from "mongoose";
import app from "./app";
import { DB_URL } from "./src/config/endpoints.config";

mongoose.connect(
  DB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  (err) => errorHandler(err)
);

function errorHandler(err: CallbackError) {
  if (err) {
    console.log("ERROR: ", err);
  } else {
    console.log("Connected to DB");
  }
}

app.listen(3000);
