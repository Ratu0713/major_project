const Listing = require("../models/listing.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../Schema.js");
const Review = require("../models/Review.js");
const {reviewSchema}=require("../Schema.js");



// validate for each filds are properly filled
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errmsg);
    }
    next();   // Don't forget this
};
module.exports.validateReview = (req, res, next) => {
    let { error } =reviewSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errmsg);
    }
    next();   // Don't forget this
};

// when a user want to add listing or edit, update, delete any listing they have to login first
//here req.isAuthenticated() is the passport inbuilt function that checks session created by the user is logedin or not
module.exports.islogedin=(req,res, next)=>{
    // console.log(req.originalUrl);
    if(!req.isAuthenticated()){
        // when islogedin triggered by any routes, we have to store that url and this is possible in req.session because a user information stored in that current session
        req.session.redirectUrl=req.originalUrl;
        
        // req.session.redirectUrl = req.headers.referer || "/listings";
        
        // if req.isAuthenticated does not contain any value that menas user is not logged in 
        req.flash("error","You have to logedin first")
        return res.redirect("/login");
    }
    next();
};

// when user without loggedin request to edit user redirect to login page then after login user will come to that page from where user redirect to login
module.exports.saveUrl=(req,res,next)=>{
    if(req.session.redirectUrl){   
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

// it checks if user is not owner then user can't do edit, delete operation
module.exports.isOwner = async (req,res,next)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);

    if(!listing){
        req.flash("error","Listing does not exist!");
        return res.redirect("/listings");
    }

    if(!listing.owner.equals(req.user._id)){
        req.flash("error","You are not the owner of that listing!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

// If user is not author , auther can't delete the review
module.exports.isReviewAuthor = async (req,res,next)=>{
    const {id,reviewsid} = req.params;

    const review = await Review.findById(reviewsid);

    if(!review){
        req.flash("error","Review does not exist");
        return res.redirect(`/listings/${id}`);
    }

    if(!review.author.equals(req.user._id)){
        req.flash("error","You are not the author of that review");
        return res.redirect(`/listings/${id}`);
    }

    next();
};


