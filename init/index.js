const mongoose= require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

main().then(()=>{
    console.log("conncet to DB");
}) .catch(err=>{
    console.log(err);
});

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');
};

const initDB= async()=>{
    await Listing.deleteMany({});
    //In arrow functions, if you return an object directly, you must wrap it in parentheses.
    //Without parentheses: JavaScript thinks {} is a function block, not an object.
    initData.data=initData.data.map((obj)=>({...obj}));
    // console.log(initData.data);
    await Listing.insertMany(initData.data);
    console.log("data initialize is done")
};
 initDB();






