import { Request, Response } from "express"
import { PrismaClient } from "../generated/prisma/client"
import path from "path";
import fs from "fs";
const Prisma = new PrismaClient();
export const getAllProduk = async (req: Request, res: Response) => {
  try {
    const produk = await Prisma.produk.findMany({
      include: {
        kategori: true
      }
    });
    res.status(200).json({ message: "Produk berhasil diambil", data: produk });
  } catch (error) {
    res.status(500).json({ message: "gagal Mengambil produk", error })
  }
};

export const createProduk = async (req: Request, res: Response) => {
  try {
    const { nama, harga, stok, kategoriId } = req.body;
    if (!nama || !harga || !stok || !kategoriId) {
      return res.status(400).json({ message: "Semua field harus di isi" })
    }

    //req.file berisi info yang di upload
    const gambar = req.file ? req.file.filename : "default.jpg";

    const kategoriExist = await Prisma.kategori.findUnique({
      where: {
        id: Number(kategoriId)
      }
    })

    if (!kategoriExist) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" })
    }
    const produk = await Prisma.produk.create({
      data: {
        nama,
        harga: Number(harga),
        stok: Number(stok),
        kategoriId: Number(kategoriId),
        gambar: gambar
      }
    })

    res.status(201).json({ message: "Produk berhasil di tambahkan", data: produk })
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "gagal meambahkan Produk" })
  }
};

export const getProdukById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "id harus di isi!!" })
    }

    const produk = await Prisma.produk.findUnique({
      where: {
        id: Number(id)
      },
      include: { kategori: true }
    })
    res.status(200).json({ message: "Produk berhasil diambil", data: produk });
  } catch (error) {
    res.status(500).json({ message: "gagal Mengambil produk", error })
  }
}

export const updateProduk = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nama, harga, stok, kategoriId } = req.body;

    if (!id) return res.status(400).json({ message: "id harus di isi!!" })

    // 1. Cek dulu produk lamanya
    const oldProduk = await Prisma.produk.findUnique({
        where: { id: Number(id) }
    });

    if (!oldProduk) return res.status(404).json({ message: "Produk tidak ditemukan" });

    // PERBAIKAN 2 (LOGIKA GAMBAR):
    // Jika ada file baru (req.file), pakai nama file baru.
    // Jika TIDAK ada file baru, pakai nama gambar LAMA (oldProduk.gambar).
    let namaGambar = oldProduk.gambar; 

    if (req.file) {
        namaGambar = req.file.filename;
        
        // Opsional: Hapus gambar lama biar storage gak penuh
        if (oldProduk.gambar && oldProduk.gambar !== 'default.jpg') {
            const oldPath = path.join(__dirname, "../../public/uploads", oldProduk.gambar);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
    }

    const produk = await Prisma.produk.update({
      where: {
        id: Number(id)
      },
      data: {
        nama,
        harga: harga ? Number(harga) : undefined, // Pakai undefined biar kalau kosong gak ke-update
        stok: stok ? Number(stok) : undefined,
        kategoriId: kategoriId ? Number(kategoriId) : undefined,
        gambar: namaGambar // Gunakan variabel yang sudah dicek tadi
      }
    })

    res.json({message: "Produk berhasil di update", data: produk})
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Gagal Mengupdate Produk", error })
  }
}

export const deleteProduk = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const produk = await Prisma.produk.findUnique({ where: { id: Number(id) } });
    
    // PERBAIKAN 1: Tambahkan return
    if (!produk) return res.status(404).json({ message: "Produk tidak ditemukan" });

    await Prisma.produk.delete({ where: { id: Number(id) } });

    if (produk.gambar && produk.gambar !== "default.jpg") {
      // Pastikan path folder public/uploads benar relatif terhadap file controller ini
      const imagePath = path.join(__dirname, "../../public/uploads", produk.gambar);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({ message: "Produk berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Error hapus produk", error });
  }
};