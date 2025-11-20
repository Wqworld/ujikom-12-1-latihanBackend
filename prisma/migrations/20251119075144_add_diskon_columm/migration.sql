/*
  Warnings:

  - Added the required column `tglAkhir` to the `Diskon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tglMulai` to the `Diskon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `diskon` ADD COLUMN `tglAkhir` DATETIME(3) NOT NULL,
    ADD COLUMN `tglMulai` DATETIME(3) NOT NULL;
