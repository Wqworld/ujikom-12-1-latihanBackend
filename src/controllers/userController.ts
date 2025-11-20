import { Request, Response } from "express";
// Sesuaikan path import prisma
import { PrismaClient } from "../generated/prisma/client"; 
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// --- GET ALL USERS (Lihat semua kasir/admin) ---
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { // KITA SELECT MANUAL BIAR PASSWORD GAK KELIATAAN
        id: true,
        nama: true,
        role: true,
        createdAt: true
      }
    });
    res.status(200).json({ message: "Data user berhasil diambil", data: users });
  } catch (error) {
    res.status(500).json({ message: "Gagal ambil data user", error });
  }
};

// --- CREATE USER (Admin bikin akun Kasir) ---
export const createUser = async (req: Request, res: Response) => {
  try {
    const { nama, password, username, role } = req.body;

    if (!nama || !password || !role) {
      return res.status(400).json({ message: "Nama, Password, dan Role wajib diisi" });
    }

    // Cek nama sudah ada?
    const existingUser = await prisma.user.findFirst({ where: { nama } });
    if (existingUser) {
      return res.status(400).json({ message: "Nama user sudah digunakan" });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        nama,
        username,
        password: hashedPassword,
        role : "KASIR"
      }
    });

    // Hapus password dari response biar aman
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({ message: "User berhasil dibuat", data: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: "Gagal buat user", error });
  }
};

// --- UPDATE USER (Bisa ganti nama, role, ATAU reset password) ---
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nama, password, role } = req.body; // Password di sini opsional

    if (!id) return res.status(400).json({ message: "ID wajib diisi" });

    // Siapkan object data yang mau diupdate
    let updateData: any = {
      nama,
      role
    };

    // LOGIKA PENTING: Cuma hash password kalau admin ngirim password baru
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: updateData
    });

    // Hapus password dari response
    const { password: _, ...userWithoutPassword } = updatedUser;

    res.status(200).json({ message: "User berhasil diupdate", data: userWithoutPassword });
  } catch (error) {
    res.status(404).json({ message: "User tidak ditemukan", error });
  }
};

// --- DELETE USER ---
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id: Number(id) }
    });

    res.status(200).json({ message: "User berhasil dihapus" });
  } catch (error) {
    res.status(404).json({ message: "User tidak ditemukan", error });
  }
};