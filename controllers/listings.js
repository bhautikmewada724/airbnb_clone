const { validationResult } = require("express-validator");
const Listing = require("../models/Listing");
const { listingSchema } = require("../schema");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listing/index", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listing/new.ejs");
};

//Show Listing
module.exports.showListings = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing Doesn't Exsist");
    res.redirect("/listings");
  }
  console.log("LISTINGS :: ", listing);
  res.render("listing/show", { listing });
};

//Create Listing
module.exports.createListing = async (req, res, next) => {
  let result = listingSchema.validate(req.body);
  console.log(result);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("listing/new", { errors: errors.array() });
  }

  let url = req.body.listing.image;
  let filename = "asdf";
  req.body.listing.image = {
    url,
    filename,
  };
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  try {
    await newListing.save();
    req.flash("success", "New Listing Created");
    return res.redirect("/listings");
  } catch (err) {
    console.error(err);
    return next(err);
  }
};


module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing Doesn't Exsist");
    res.redirect("/listings");
  }
  res.render("listing/edit", { listing });
};

//Update Listing
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, {
    new: true,
    runValidators: true,
  });
  if (!updatedListing) {
    return res.status(404).send("Listing not found");
  }
  req.flash("success", "Listing Updated");

  res.redirect(`/listings/${id}`);
};


//Delete Listing
module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
  }