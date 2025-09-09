const Image = require("../models/image");
const { uploeadToCloudinary } = require("../helpers/cloudinary.helper");
const fs = require("fs");
const cloudinary = require("../config/cloudinary");


const uploadImageController = async (req, res) => {
    try {
        //checking file is missing in req object
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "File is required.please upload an image"
            })
        };
        //upload to cloudniary
        const { url, publicId } = await uploeadToCloudinary(req.file.path);


        //store the image url and public is along with the uploaded user id in database
        const newlyUploadedImage = new Image({
            url,
            publicId,
            uploadedBy: req.userInfo.userId
        });
        await newlyUploadedImage.save()

        //delete the file from the local storage
        fs.unlinkSync(req.file.path) //removing the image from the local


        res.status(201).json({
            success: true,
            messgae: "Image uploaded successfully",
            image: newlyUploadedImage
        })

    } catch (err) {
        console.log("error", err)
        res.status(500).json({
            success: false,
            message: "Something went wrong on Image controller file  under uploadImageController function!, Please try again"
        })
    }
};

//fetching all the image
const fetchImagesController = async (req, res) => {
    try {

        //page varaible (apply pagination)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        //sorting by createdAt
        const sortBy = req.query.sortBy || "createdAt"; //default value is createdAt
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1; //default value is desc;
        const totalImages = await Image.countDocuments(); //give all the image count
        const totalPages = Math.ceil(totalImages / limit); //total number of pages


        const sortObj = {};
        sortObj[sortBy] = sortOrder;

        const allImages = await Image.find().sort(sortObj).skip(skip).limit(limit);
        if (allImages) {
            res.status(200).json({
                success: true,
                message: "All Image fetched successfully",
                currentPage: page,
                totalImages,
                totalPages,
                data: allImages
            })
        }
    } catch (err) {
        console.log("error", err)
        res.status(500).json({
            success: false,
            message: "Something went wrong on Image controller file in fetchImagesController function!, Please try again"
        })
    }
};

//deleting the image from cloudl
const deleteImageController = async (req, res) => {
    try {
        //getting the image id
        const getCurrentImageId = req.params.id;

        //getting the user id who uploaded the image
        const userId = req.userInfo.userId

        //getting the current image
        const currentImage = await Image.findById(getCurrentImageId.toString());


        if (!currentImage) {
            return res.status(404).json({
                success: false,
                message: "Image not found, bceause this image is not uploaded by you"
            })
        };

        //chekcing if this image is uploaded by the current user who is try to delete
        if (currentImage.uploadedBy.toString() !== userId) {
            return res.status(403).json({
                message: "You are not authorized to delete this image",
                success: false
            })
        };

        //delete first from cloudinray storage and than delete from the mongoDB
        await cloudinary.uploader.destroy(currentImage.publicId)


        //deleting this from mongodb db
        await Image.findByIdAndDelete(getCurrentImageId);


        res.status(200).json({
            success: true,
            message: "Image deleted successfully"
        })
    } catch (error) {
        console.log("Error in delete Image controller function")
        res.status(500).json({
            success: false,
            message: "Something went wrong on Image controller file in deleteImageController function!, Please try again"
        })
    }
}

module.exports = {
    uploadImageController,
    fetchImagesController,
    deleteImageController
}