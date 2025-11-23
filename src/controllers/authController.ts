import { Request, Response } from "express";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Prisma, PrismaClient, Role } from "../generated/prisma/client";
const prisma = new PrismaClient();
dotenv.config();
const JWT_SECRET = process.env.SECRET_KEY ;

type requestUser = Request <
unknown,
unknown,
Prisma.UserCreateInput,
unknown
>;

export const register = async (req: requestUser, res: Response) => {
  try {
    const { nama, username,  password, role } = req.body;

    // Hash password biar aman
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        nama ,
        username,
        password: hashedPassword,
        role: role!, 
      },
    });

    res.status(201).json({ message: "User berhasil dibuat", data: user });
  } catch (error) {
    res.status(500).json({ message: "Gagal register", error });
  }
};

// --- LOGIN (Untuk dapat Token) ---
export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    // 1. Cari user
    const user = await prisma.user.findFirst({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({ message: "User tidak ditemukan" });
    }

    // 2. Cek Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password salah" });
    }

    // 3. Bikin Token (Isinya ID dan Role)
    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.nama }, 
      JWT_SECRET as string, 
      { expiresIn: "1h" }
    );

    res.json({ message: "Login berhasil", token });

};