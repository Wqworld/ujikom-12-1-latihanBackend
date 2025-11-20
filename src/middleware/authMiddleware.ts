import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.SECRET_KEY;
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Akses ditolak: Token tidak ada" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as { id: number; role: string };
    req.user = decoded; // Tempel data user ke request
    next(); // Lanjut ke controller/middleware berikutnya
  } catch (error) { 
    return res.status(403).json({ message: "Token tidak valid" });
  }
};

export const authorizeRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Akses terlarang: Role tidak sesuai" });
    }

    next();
  }
}