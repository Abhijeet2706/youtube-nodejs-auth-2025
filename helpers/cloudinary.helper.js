const cloudinary = require("../config/cloudinary");



const uploeadToCloudinary = async (fileFPath) => {
    try {
        const result = await cloudinary.uploader.upload(fileFPath);

        return {
            url: result.secure_url,
            publicId: result.public_id
        }
    } catch (err) {
        console.error("Error while uploading to cloudinary", err);
        throw new Error("Error while uploading to cloudinary")
    }
};


module.exports = {
    uploeadToCloudinary
}