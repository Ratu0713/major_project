const cloudinary = require('cloudinary').v2;
const CloudinaryStorage = require("multer-storage-cloudinary").CloudinaryStorage;

// Before uploading the files we have to access the cloudinary account so that we have to config -->
// here we passed the credentials such as cloud_name, api_key, api_secret
cloudinary.config({
    // those variable names shold be same--> cloud_name --> like that
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
});

// Here we defined our storage to store our files --and formats are allowed--> png, jpg,jpeg
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Wanderlust-DEV',
    allowed_formats: ['png','jpg','jpeg'], // supports promises as well
    
  },
});

module.exports={cloudinary, storage}