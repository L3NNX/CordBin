import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/db/connectDB.js";
import fileRoutes from "./src/routes/file.routes.js";
import userRoutes from "./src/routes/user.routes.js";
dotenv.config();
console.log("DISCORD_BOT_TOKEN =", process.env.DISCORD_BOT_TOKEN);
const app = express();
const PORT = process.env.PORT || 3000;
// const FRONTEND_ORIGIN =
  // process.env.FRONTEND_URL

  app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }))


app.use(express.json({ limit: "10mb" }));

app.use("/api/auth", userRoutes);
app.use("/api/files", fileRoutes);

app.get("/", (req, res) => {
  res.send("Discord Bot Server is running!");
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });