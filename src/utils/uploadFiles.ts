import multer from "multer";
import path from "path";

//tentukan tempat penyimpanan
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //simpen di folder 'public/uploads'
    cb(null,"public/uploads");
  },
  filename: (req,file, cb) => {
    //buat kasi nama yang unik banget
    const uniqueSuffix =  Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// filter agar cuma bisa upload foto
const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null,true);
  }else {
    cb(new Error("Hanya bisa upload foto"), false);
  }
}

export const upload = multer({storage, fileFilter}); 