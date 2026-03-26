const Listing = require("../models/listing.js");
const mbxGeocoding= require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN
const geocodingClient= mbxGeocoding({ accessToken: mapToken });

//index
module.exports.indexControler=async (req, res, next) => {
    const allListing = await Listing.find({});
    res.render("Listings/index.ejs", { allListing });
  };
 
// new form render
module.exports.listingFormRender=(req, res) => {
  res.render("Listings/new.ejs");
};

// new listing
module.exports.newListing=async (req, res, next) => {
    const response= await geocodingClient.forwardGeocode({
      //geocoding is the library of the mapbox. geocoding containg 2types of -->
      //forward coding and backward geocoding-> forward geocoding converts the location to coordinates and backward geocoding does the opposite
     query: req.body.listing.location,
     limit: 1
    }).send();
 

    const url= req.file.path;
    const filename=req.file.filename;
    const newList = new Listing(req.body.listing);
    newList.owner = req.user._id;
    newList.image={url,filename};
    newList.geometry=response.body.features[0].geometry;// from this we are geting coordinates of the location
    // here req.body.listing => .listing is used because we used in ejs file
    //  name="listing[title]" so automatically express creates a object
    //  like ==> req.body={listing:{title: something, price: something  }}  --> so then the data is accessed in like this --> req.body.listing--> inplace of liting we can use any name
    // console.log(newList);
    let savedListing= await newList.save();
    console.log(savedListing)
    req.flash("success", "New listing is created");
    res.redirect("/listings");
  };

  // show listing
module.exports.showListing=async (req, res, next) => {
    let { id } = req.params;
    const listingId = await Listing.findById(id)
      .populate({path:"reviews",
        populate:{
            path:"author",
        }
      })
      .populate("owner");
    if (!listingId) {
      req.flash("error", "Listing you requested for does not exist!");
      return res.redirect("/listings");
    }
    res.render("Listings/show.ejs", { listingId });
  };

  // edit form render
  module.exports.editFormRender=async (req, res, next) => {
      let { id } = req.params;
      const listing = await Listing.findById(id);
      if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
      }
      let originalUrl=listing.image.url;
      originalUrl=originalUrl.replace("/upload","/upload/w_180");
      res.render("Listings/edit.ejs", { listing ,originalUrl});
    };

    // update listing 
  module.exports.updateListing=async (req, res, next) => {
      let { id } = req.params;
      let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });

      if(typeof req.file!=="undefined"){
          let url=req.file.path;
          let filename=req.file.filename;
          listing.image={url,filename};
          await listing.save();
      }
      
  
      req.flash("success", "listing is edited successfully");
      res.redirect(`/listings/${id}`); // route
    };

    // destory listing
    module.exports.destroyListing=async (req, res, next) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    console.log("delete done");
    req.flash("success", "listing is deleted successfully");
    res.redirect(`/listings`);
  };