import { Request, Response } from "express";
// Pastikan path ini sesuai dengan projectmu
import { PrismaClient } from "../generated/prisma/client";

const Prisma = new PrismaClient();

// --- GET ALL ---
export const getAllDiskon = async (req: Request, res: Response) => {
  try {
    const diskons = await Prisma.diskon.findMany();
    res.json({ message: "Data diskon berhasil diambil", data: diskons });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan saat mengambil diskon", error })
  }
};

export const getDiskonById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const diskon = await Prisma.diskon.findUnique({ where: { id: Number(id) } });
    res.json({ message: "Data diskon berhasil diambil", data: diskon });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan saat mengambil diskon", error })
  }
}

// --- CREATE ---
export const createDiskon = async (req: Request, res: Response) => {
  try {
    const { nama, persen, deksripsi, tglMulai, tglAkhir } = req.body;

    // Validasi field wajib
    if (!nama || !persen || !deksripsi || !tglMulai) {
      return res.status(400).json({ message: "Semua field harus diisi" });
    }

    // Logika Tgl Akhir: Jika kosong, samakan dengan Tgl Mulai
    let finalTglAkhir = tglAkhir;
    if (!tglAkhir) {
      finalTglAkhir = tglMulai;
    }

    const diskon = await Prisma.diskon.create({
      data: {
        nama,
        persen: Number(persen), // Pastikan jadi number
        deksripsi, // (Note: Cek spelling di schema.prisma kamu, 'deksripsi' atau 'deskripsi'?)
        tglMulai: new Date(tglMulai), // Convert String ke Date
        tglAkhir: new Date(finalTglAkhir) // Convert String ke Date
      }
    });

    res.status(201).json({ message: "Diskon berhasil dibuat", data: diskon });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Terjadi kesalahan saat membuat diskon", error })
  }
}

// --- UPDATE ---
export const updateDiskon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nama, persen, deksripsi, tglMulai, tglAkhir } = req.body;

    if (!id) return res.status(400).json({ message: "ID harus diisi" });

    const diskon = await Prisma.diskon.update({
      where: { id: Number(id) },
      data: {
        nama,
        persen: persen ? Number(persen) : undefined,
        deksripsi,
        tglMulai: tglMulai ? new Date(tglMulai) : undefined,
        tglAkhir: tglAkhir ? new Date(tglAkhir) : undefined
      }
    });

    res.status(200).json({ message: "Diskon berhasil diupdate", data: diskon });
  } catch (error) {
    res.status(500).json({ message: "Gagal update diskon", error });
  }
}

// --- DELETE ---
export const deleteDiskon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "ID harus diisi" });

    await Prisma.diskon.delete({
      where: { id: Number(id) }
    });

    res.status(200).json({ message: "Diskon berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal hapus diskon", error });
  }
}