const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const adminMiddleware = require("../middleware/admin-middleware");
const uploadMiddleWare = require("../middleware/upload-middleware")
const { uploadImageController, fetchImagesController, deleteImageController } = require("../controllers/image-controller")

//creating a router
const router = express.Router();

//upload the image
router.post(
    '/upload',
    authMiddleware,
    adminMiddleware,
    uploadMiddleWare.single('image'),
    uploadImageController
);


//to get all the image
router.get("/get-all-image", authMiddleware, fetchImagesController)

//delete image route
//68bd38bc290e0d76d8fd6284
router.delete('/:id', authMiddleware, adminMiddleware, deleteImageController)




module.exports = router