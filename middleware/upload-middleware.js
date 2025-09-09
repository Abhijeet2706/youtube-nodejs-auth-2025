const multer = require("multer");
const path = require("path");


//setting up multer storage


//Diskstorage- The disk storage gives you full control on storing files on disk
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/")
    },
    filename: function (req, file, cb) {//file name will determine the file should be named inside the folder
        cb(null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        )

    }
});


//file filter function
const checkFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true)
    } else {
        cb(new Error("Not an image! Please upload only images"))
    }
};


//creating multer middleware
module.exports = multer({
    storage: storage,
    fileFilter: checkFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

