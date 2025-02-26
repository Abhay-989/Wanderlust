const {mongoose} =require("mongoose");
const Schema =mongoose.Schema;
const Review=require("./review.js");

const listingSchema =new Schema({
    title:{
        type:String,
        require:true,
        trim: true, 
    },
    description:{
        type: String,
        trim: true,
    },

    image: {
        url: String,
        filename: String,
      },
    
    price:Number,
    location: String,
    country: String,
    reviews:[
        {
            type: Schema.Types.ObjectId,ref:"Review",
        },
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref:"User",
    },
    // category:{
    //     type:String,
    //     enum:["mountains","arctic","farms","desert"]
    // }
}); 

listingSchema.post("findOnrAndDelete",async(listing)=>{
    if(listing){
await Review.deleteMany({reviews:{$in:listing.reviews}});
}})

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;

