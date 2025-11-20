import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma/client";

const Prisma = new PrismaClient();

export const getLaporan = async (req: Request, res: Response) => {
  try {
    const { tglMulai, tglAkhir } = req.query;
    // Default: Jika tidak ada tanggal, ambil transaksi HARI INI
    let startDate = new Date();
    let endDate = new Date();

    if (tglMulai && tglAkhir) {
      startDate = new Date(String(tglMulai)); // "2025-01-01"
      endDate = new Date(String(tglAkhir));   // "2025-01-31"

      // Trik: Set jam endDate ke 23:59:59 biar transaksi hari terakhir ikut keambil
      endDate.setHours(23, 59, 59, 999);
    } else {
      // Jika hari ini, set dari jam 00:00 sampai 23:59
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
    }

    // Query ke Database
    const transaksi = await Prisma.transaksi.findMany({
      where: {
        tglTransaksi: {
          gte: startDate, // "Greater Than or Equal" (Lebih dari atau sama dengan)
          lte: endDate    // "Less Than or Equal" (Kurang dari atau sama dengan)
        }
      },
      include: {
        kasir: { select: { nama: true } }, // Siapa usernya?
        member: { select: { nama: true } }, // Siapa membernya?
        detailTransaksi: {
          include: { produk: true } // Barang apa aja?
        }
      },
      orderBy: { tglTransaksi: 'desc' }
    });

    // --- BONUS: HITUNG TOTAL PENDAPATAN ---
    // Kita pakai fungsi .reduce() bawaan Javascript buat hitung total manual
    const totalPendapatan = transaksi.reduce((total, item) => {
      return total + item.total; // Pastikan field di DB namanya 'total' atau 'total_bayar'
    }, 0);

    res.status(200).json({
      message: "Data laporan berhasil diambil",
      periode: {
        mulai: startDate,
        sampai: endDate
      },
      total_pendapatan: totalPendapatan,
      jumlah_transaksi: transaksi.length,
      data: transaksi
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan saat mengambil laporan", error })
  }
}