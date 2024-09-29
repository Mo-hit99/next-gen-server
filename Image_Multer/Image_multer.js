import multer from "multer"

const Id=crypto.randomUUID();

const storage = multer.diskStorage({
    destination: './public'
    ,
    filename: function (req, file, cb) {
      cb(null, Id + "_" + file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })

  export default upload;