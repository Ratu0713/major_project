const mongoose = require("mongoose");
const Review= require("./Review");
const {Schema}=mongoose;
const defaultImg = "https://tse4.mm.bing.net/th/id/OIP.5DRuxk0dj4x89_oBt80FHAHaEH?cb=defcachec2&rs=1&pid=ImgDetMain&o=7&rm=3";

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
    },
    image: {
        url:String,
        filename:String,
        
    },
    price: {
        type: Number,
         required: true,    
        min: 0,
    },
    location: {
        type: String,
        trim: true,
    },
    country: {
        type: String,
        trim: true,
    },
    reviews:[{
         type: Schema.Types.ObjectId, 
         ref: 'Review'
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }

});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
