import Logger from "./utils/Logger.js";
import InitializeApp from "./utils/InitializeApp.js";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import TodoRouter from "./routes/duran-todo-routes.js";
import UserRouter from "./routes/duran-user-routes.js";

const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000", // Your Nuxt app URL
    credentials: true,
  })
);
app.use(express.json());
dotenv.config();
Logger.setup(app);

app.use("/tasks", TodoRouter);
app.use("/auth", UserRouter);

InitializeApp.init(app)
  .then(() => {
    const PORT = 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      Logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Initialization error:", error);
    Logger.error("Initialization error:" + error);
  });
