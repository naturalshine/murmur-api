import util from "util";
import multer from "multer";

const maxSize = 2 * 2048 * 2048;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/resources/static/assets/uploads/");
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, file.originalname);
    console.log("DONE");
  },
});

let uploadFile = multer({
  storage: storage,
}).single("file");

export const uploadFileMiddleware = util.promisify(uploadFile);