import fs from 'fs';
import { uploadFileMiddleware } from "../middleware/upload";
import { retrieveHash } from '../utils/storeMedia';
import { 
    baseUrl,
    staticPath     
} from "../settings";

export const uploadFile = async (req, res) => {
  try {
    await uploadFileMiddleware(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    res.status(200).send({
      message: "Uploaded the file successfully: "
    });
  } catch (err) {
        if (err.code == "LIMIT_FILE_SIZE") {
            return res.status(500).send({
                message: "File size cannot be larger than 2MB!",
            });
        }

        res.status(500).send({
            message: `Could not upload the file: ${req}. ${err}`,
        });
  }
};

export const getListFiles = (req, res) => {
  const directoryPath = __basedir + "/resources/static/assets/uploads/";

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + staticPath + file,
      });
    });

    res.status(200).send(fileInfos);
  });
};

export const retrieveFileHash = async (req, res) => {
  const hashObj = req.body[0];
  console.log(hashObj)
  console.log("hash OBj ", hashObj)
  const hash = await retrieveHash(hashObj.hash, hashObj.file);
  console.log("HASH =>", hash)
  res.status(200).json({
    message: hash.hash,
  });
}

/*
export const downloadFile = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/resources/static/assets/uploads/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};*/
