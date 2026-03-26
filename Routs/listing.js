const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { islogedin, isOwner,saveUrl } = require("../middleware/middleware.js");
const { validateListing } = require("../middleware/middleware.js");
const listingControler = require("../Controllers/listingControler.js"); //controler
const multer = require("multer"); //It is used to parse  multipart/form-data
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  // index route
  .get(wrapAsync(listingControler.indexControler))
  //create new listing post route
  .post(islogedin,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingControler.newListing));
 

//create get route
router.get("/new", islogedin,saveUrl, listingControler.listingFormRender);

router
  .route("/:id")
  // show route
  .get(wrapAsync(listingControler.showListing))

  // update route
  .put(
    islogedin,
  upload.single("listing[image]"),
    isOwner,
    validateListing,
    wrapAsync(listingControler.updateListing),
  )

  // delete route
  .delete(islogedin, isOwner, wrapAsync(listingControler.destroyListing));

//edit route
router.get(
  "/:id/edit",
  islogedin,
  isOwner,
  wrapAsync(listingControler.editFormRender),
);

module.exports = router;
