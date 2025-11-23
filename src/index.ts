import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import kategorisRoutes from "./routes/kategoriRoutes";
import produkRoutes from "./routes/produkRoutes";
import memberRoutes from "./routes/memberRoutes";
import diskonRoutes from "./routes/diskonRoutes";
import userRoutes from "./routes/userRoutes";
import path from "path";
import { getLaporan } from "./controllers/laporanController";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- PASANG ROUTES ---
app.use("/api/auth", authRoutes); 
app.use('/api/kategoris', kategorisRoutes);
app.use('/api/produks', produkRoutes);
app.use('/api/members', memberRoutes);
app.use("/api/diskons", diskonRoutes);
app.use("/api/users", userRoutes);
app.use("/api/laporan", getLaporan);

app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// Route Test (Cuma buat ngecek server nyala)
app.get("/", (req: Request, res: Response) => {
  res.send("Server Ujikom Jalan!");
});

app.listen(port, () => {
  console.log(`[server]: Server berjalan di http://localhost:${port}`);
});