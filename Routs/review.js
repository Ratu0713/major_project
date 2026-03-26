const express= require("express");
const router= express.Router({mergeParams:true});// here mergeParams used to merge the common routes part those are written in app.js and the left part is written here.. those are marged by this                                                                                         
const wrapAsync=require("../utils/wrapAsync.js");
const {islogedin,isReviewAuthor}=require("../middleware/middleware.js");
const reviewControler=require("../Controllers/reviewControler.js");
const {validateReview}=require("../middleware/middleware.js");


//review route
router.post("/",islogedin,validateReview , wrapAsync(reviewControler.newReview));

// delete review
router.delete("/:reviewsid",islogedin,isReviewAuthor,
    wrapAsync(reviewControler.destroyReview));

module.exports=router;

