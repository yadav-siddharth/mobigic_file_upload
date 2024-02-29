const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadFile = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath);
    console.log("File added in uploads folder");
    // console.log(result);
    return result.secure_url;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  uploadFile,
};
