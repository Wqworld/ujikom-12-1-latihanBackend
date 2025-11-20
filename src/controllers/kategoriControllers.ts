import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma/client";
const Prisma = new PrismaClient();

export const getAllKategori = async (req: Request, res: Response) => {
  try {
    const kategoris = await Prisma.kategori.findMany();
    res.status(200).json(kategoris);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan saat mengambil kategori", error })
  }
}

export const createKategori = async (req: Request, res: Response) => {
  
  try {
    const { nama } = req.body;
    if(!nama) return res.status(400).json({ message: "Nama kategori harus diisi" });
     const kategori = await Prisma.kategori.create({
      data: {
        nama
      }
     })
     res.status(201).json({message: "Kategori berhasil dibuat", data: kategori});
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan saat membuat kategori", error })
  }
}

export const getKategoriById = async (req: Request, res: Response) => {
  try{
    const {id} = req.params;
    if(!id) return res.status(400).json({ message: "id harus di isi!!"})
    
    const Kategori = await Prisma.kategori.findUnique({
      where: {
        id: Number(id)
      }
    })

    res.status(200).json({message: "Kategori berhasil di update", data: Kategori});
  }catch(error){
    res.status(500).json({ message : "Terjadi kesalah saat mengambil kategori", error})
  }
}

export const updateKategori = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const {nama} = req.body;
    if (!nama) {
        res.status(400).json({message: "Nama kategori harus diisi"});
    }

    const newKategori = await Prisma.kategori.update({
      where: {
        id: Number(id)
      },
      data: { 
        nama
      }
    })

    res.status(200).json({message: "Kategori berhasil di update", data: newKategori});
  } catch (error) {
    res.status(500).json({message: "Terjadi Kesalahan saat mengupdate kategori", error})
  }
}

export const deleteKategori = async (req: Request, res: Response ) => {
  try {
    const {id} = req.params;

    const deletedKategori = await Prisma.kategori.delete({
      where: {
        id: Number(id)
      }
    })
    res.status(200).json({message: "Kategori berhasil dihapus", data: deletedKategori});
  } catch (error) {
    res.status(500).json({message: "Terjadi Kesalahan saat menghapus kategori", error});
  }
}