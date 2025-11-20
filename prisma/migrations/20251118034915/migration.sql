/*
  Warnings:

  - You are about to drop the column `harga` on the `kategori` table. All the data in the column will be lost.
  - You are about to drop the column `stok` on the `kategori` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `kategori` DROP COLUMN `harga`,
    DROP COLUMN `stok`;
