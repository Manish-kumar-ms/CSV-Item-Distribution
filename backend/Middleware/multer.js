import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public");

    },
    filename: (req, file, cb) =>{
        cb(null,file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();   // e.g. ".csv"
  const allowed = [".csv", ".xlsx", ".xls"];                   //  all valid types

  if (allowed.includes(ext)) {
    cb(null, true);  // accept the file
  } else {
    cb(new Error("Only .csv, .xlsx, or .xls files are allowed"), false);
  }
};

const upload = multer({storage, fileFilter})

export default upload;