const cloudinary = require('cloudinary').v2;                                    // importing cloudinary module
const { CloudinaryStorage } = require('multer-storage-cloudinary');             // importing CloudinaryStorage class from multer-storage-cloudinary package

cloudinary.config({                                                         // backend ko cloudinary ke account se jodhne ki info isme likhenge
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

//defining storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowedFormats: ["png", "jpg", "jpeg"],
  },
});


//exporting
module.exports = { cloudinary, storage };