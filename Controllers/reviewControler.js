const Review= require("../models/Review.js");
const Listing = require("../models/listing.js"); 

module.exports.newReview=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    let newReview= new Review(req.body.review);
    newReview.author=req.user._id;
    await newReview.save();

    listing.reviews.push(newReview);
    await listing.save();
    req.flash("success","Review is uploaded successfully");
    res.redirect(`/listings/${id}`);
    // res.send("Review saved");
    // console.log("review saved");
};

module.exports.destroyReview=async(req,res)=>{

    let {id,reviewsid}=req.params;// destructure korar time e amra route jeta likhi setai likhte lage nahole hobe na 
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewsid}}); // listing array theke review ta delete korar jonno  $pull use kora hoyeche --> jate reviews array theke reviewid pull kore remove kore update
    await Review.findByIdAndDelete(reviewsid);
    console.log("delete done");
    req.flash("success","Review is deleted successfully");
    res.redirect(`/listings/${id}`);
};