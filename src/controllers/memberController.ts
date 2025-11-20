import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma/client";

const Prisma = new PrismaClient();
export const getAllMember = async (req: Request, res: Response) => {
  try {
    const members = await Prisma.member.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan saat mengambil member", error });
  }
};

export const createMember = async (req: Request, res: Response) => {
  try {
    const { nama, noTelepon, status } = req.body;

    if (!nama || !noTelepon || !status) return res.status(400).json({ message: "Semua field harus diisi" });

    const exiistTelepon = await Prisma.member.findFirst({
      where: {
        noTelepon: noTelepon
      }
    });

    if (exiistTelepon) return res.status(400).json({ message: "Nomor telepon sudah terdaftar" });

    const member = await Prisma.member.create({
      data: {
        nama,
        noTelepon,
        status
      }
    });
    res.status(201).json({ message: "Member berhasil didaftarkan", data: member });
  } catch (error) {
    console.log(error); // Debugging
    res.status(500).json({ message: "Gagal membuat member", error });
  }
};

export const getMemberById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "id harus di isi!!" })

    const member = await Prisma.member.findUnique({
      where: {
        id: Number(id)
      }
    })

    res.status(200).json({ message: "Member berhasil di update", data: member });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalah saat mengambil member", error })
  }
};

export const updateMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nama, noTelepon, status } = req.body;

    if (!id) return res.status(400).json({ message: "id harus di isi!!" })

    if (!nama && !noTelepon && !status) return res.status(400).json({ message: "Semua field harus diisi" });

    const memberCheck = await Prisma.member.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!memberCheck) return res.status(404).json({ message: "Member tidak ditemukan" });

    const member = await Prisma.member.update({
      where: {
        id: Number(id)
      },
      data: {
        nama,
        noTelepon,
        status
      }
    });
    res.status(200).json({ message: "Member berhasil diupdate", data: member });

  } catch (error) {
    res.status(500).json({ message: "Terjadi Kesalahan saat mengupdate member", error })
  }
};

export const deleteMember = async (req: Request, res: Response) => {
  try{
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "id harus di isi!!" })

    const member = await Prisma.member.delete({
      where: {
        id: Number(id)
      }
    })
    res.status(200).json({ message: "Member berhasil dihapus", data: member });
  }catch(error){
    res.status(500).json({ message : "Terjadi kesalahan saat mengupdate member", error })
  }
}