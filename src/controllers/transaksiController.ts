import { Request, Response } from "express";
// Sesuaikan path import ini dengan projectmu
import { PrismaClient } from "../generated/prisma/client"; 

const Prisma = new PrismaClient();

export const createTransaksi = async (req: Request, res: Response) => {
  try {
    // items nanti berisi banyak detail transaksi
    const { items, memberId, diskonId } = req.body;
    const userId = req.user?.id;

    if (!userId || !items || items.length === 0) {
      return res.status(400).json({ message: "Semua field harus diisi" });
    }

    // --- TAHAP 1: CEK STOK & HITUNG TOTAL (VALIDASI) ---
    let totalBayar = 0;
    const detailTransaksiData: { id_produk: number; jumlah: number; subtotal: number }[] = [];  

    for (const item of items) {
      const produkDb = await Prisma.produk.findUnique({
        where: { id: item.produkId }
      });

      // Cek apakah produk ada?
      if (!produkDb) {
        return res.status(404).json({ message: `Produk ID ${item.produkId} tidak ditemukan` });
      }

      // Cek stok cukup gak?
      if (produkDb.stok < item.qty) {
        return res.status(400).json({
          message: `Stok ${produkDb.nama} tidak cukup. Sisa: ${produkDb.stok}, Diminta: ${item.qty}`
        });
      }

      const subTotal = produkDb.harga * item.qty;
      totalBayar += subTotal;

      // Simpan data siap kirim ke DB nanti
      detailTransaksiData.push({
        id_produk: produkDb.id,
        jumlah: item.qty,
        subtotal: subTotal
      });
    } // <--- LOOPING SELESAI DI SINI (PENTING!)

    // --- TAHAP 2: LOGIKA DISKON (OPSIONAL) ---
    // Dilakukan SETELAH semua total dihitung
    if (diskonId) {
      const diskon = await Prisma.diskon.findUnique({
        where: { id: Number(diskonId) }
      });
      
      if (diskon) {
        // Pastikan logic diskon sesuai (persen atau nominal)
        // Asumsi di database kamu kolomnya 'persen'
        if (diskon.persen) {
          const potongan = (totalBayar * diskon.persen) / 100;
          totalBayar -= potongan;
        }
        // Jika ada logika nominal, tambahkan else if di sini
      }
    }
    
    // Pastikan total tidak negatif
    if (totalBayar < 0) totalBayar = 0;

    // --- TAHAP 3: EKSEKUSI TRANSAKSI (DATABASE TRANSACTION) ---
    // Gunakan prisma.$transaction biar ATOMIC (Semua sukses atau Gagal semua)
    const result = await Prisma.$transaction(async (tx) => {
      
      // A. Buat Header Transaksi
      const transaksiBaru = await tx.transaksi.create({
        data: {
          kasirId: Number(userId), // Pastikan nama field di DB 'id_user' atau'
          memberId:  Number(memberId),
          diskonId: Number(diskonId),
          total: totalBayar, // Pastikan nama field di DB 'total_bayar' atau 'total
          tglTransaksi: new Date()
        }
      }); 

      // B. Simpan Detail Transaksi & Kurangi Stok
      // Kita loop data yang sudah kita validasi tadi (detailTransaksiData)
      for (const detail of detailTransaksiData) {
        // 1. Masukkan ke tabel Detail Transaksi
        await tx.detailTransaksi.create({
          data: {
            transaksiId: transaksiBaru.id,
            produkId: detail.id_produk,
            qty: detail.jumlah,
            totalHarga: detail.subtotal
          }
        });

        // 2. Kurangi Stok Produk
        await tx.produk.update({
          where: { id: detail.id_produk },
          data: {
            stok: {
              decrement: detail.jumlah // Kurangi stok otomatis
            }
          }
        });
      }

      return transaksiBaru;
    });

    // Kirim respon sukses
    res.status(201).json({ 
        message: "Transaksi berhasil dibuat", 
        data: result 
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Transaksi Gagal", error });
  }
};