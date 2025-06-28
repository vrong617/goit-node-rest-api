import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRoutes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/avatars", express.static(path.join(__dirname, "public", "avatars")));

app.use("/api/auth", authRouter);
app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.status || 500}: ${err.message}`);

  if (!err.status) {
    console.error("[ERROR] Stack Trace:", err.stack);
  }

  const status = err.status || 500;
  const message = err.message || "Server error";

  res.status(status).json({ message });

  next();
});

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});
