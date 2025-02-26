const Listing=require("../models/listing");

module.exports.index = async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
 };

 module.exports.renderNewForm = (req,res)=>{
    console.log(req.user);
    res.render("listings/new.ejs");
};

// module.exports.showListings = async (req,res)=>{
//     let {id}=req.params;
    
//      const listing =await Listing.findById(id)
//      .populate("owner") 
//      .populate({
//          path:"reviews",
//          populate:{path:"author"}
//      });
//      if (!listing) {
//          req.flash("error","Listing Requested Does Not Exist");
//         return res.redirect("/listings");
//      }
//      console.log(listing);
//      res.render("listings/show",{listing});
//  };


module.exports.showListings = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id)
        .populate("owner") 
        .populate({
            path: "reviews",
            populate: { path: "author" }
        });

    if (!listing) {
        req.flash("error", "Listing Requested Does Not Exist");
        return res.redirect("/listings");
    }

    if (!listing.owner) {
        console.error(" Error: Listing owner is NULL! Full listing:", listing);
    } else {
        console.log(" Listing owner:", listing.owner);
    }

    res.render("listings/show", { listing });
};



 module.exports.createListing = async(req,res)=>{
    let url = req.file.path;
    let filename = req.file.filename;
     const newListing = new Listing(req.body.listing);
     newListing.owner=req.user._id;
     newListing.image= {url, filename};
    await newListing.save();
    req.flash("success","New Listing Created!");
     res.redirect("/listings");
    };






 module.exports.renderEditForm = async (req, res) => {
   
         const { id } = req.params;
         const listing = await Listing.findById(id);
         if (!listing) {
             req.flash("error","Listing Requested Does Not Exist");
             res.redirect("/listings");
         }
         let originalImageUrl =listing.image.url;
         originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_150,w_150")
         res.render("listings/edit.ejs", { listing , originalImageUrl });
     };

//      module.exports.updateListing = async (req, res) => {
//         let { id } = req.params;
       
       
//          let listing =  await Listing.findByIdAndUpdate(id,{...req.body.listing}); 
//         if(typeof req.file !=="undefined"){
//         let url = req.file.path;
//         let filename = req.file.filename;
//         Listing.image= {url, filename};
//         await Listing.save();}
//         req.flash("success","Listing Updated!");
//          res.redirect(`/listings/${id}`); 
//  };
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;


    let listing = await Listing.findById(id);
    
    if (!listing) {
        req.flash("error", "Listing Not Found!");
        return res.redirect("/listings");
    }

   
    Object.assign(listing, req.body.listing);

 
    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    // Save the updated listing instance
    await listing.save();

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};




 module.exports.destroyListing = async (req, res) => {
   
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings"); 

};
