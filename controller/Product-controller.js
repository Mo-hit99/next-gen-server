import { ProductSchema } from "../models/Product.js";

// get all data
export const getAllProductData = async (req, res) => {
  try {

    const search = req.query.search || "";
    const category = req.query.category || "";
    const brand = req.query.brand || "";
    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 10;
    const query = {
      brand: {
        $regex: search,
        $options: "i",
      },
    };

     if(category){
        query.category=category;
     }
     if(brand){
        query.brand=brand;
     }

    const skip = (page - 1) * pageSize;
    const totalCount = await ProductSchema.countDocuments(query);

    let queryData = await ProductSchema.find(query)
      .limit(pageSize)
      .skip(skip);
    const pageCount = Math.ceil(totalCount/pageSize);
    res.status(200).json({
      pagination: {
        page,
        totalCount,
        pageCount,
        pageSize
      },
      queryData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get by Id
export const getProductDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const getById = await ProductSchema.findById({ _id: id });
    res.status(200).json(getById);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const createProductData = async (req, res) => {
  try {
    const  { brand, title, price, description, category, rate, count,colors,sizes } =
      req.body;
      const fileDataArray = req.files.map(file => file.path);
     if(!fileDataArray){
      console.log('no file there!!!')
     }
    const productImg = new ProductSchema({
        brand,
        title,
        price,
        colors,
        sizes,
        description,
        category,
        rate,
        count,
        filename:fileDataArray,
    });
    
    await productImg.save();
    res.send("file stored in data");
    console.log("file has been stored in database");
  } catch (error) {
    console.log("file has failed to stored in database", {
      error: error,
    });
    res.status(400).json(error.message)
  }
};

// Update the ProductData by Id
export const UpdateProductData = async (req, res) => {
  try {
    const { id } = req.params;
    const  { brand, title, price, description, category, rate, count,colors,sizes } =
      req.body;
      const fileDataArray = req.files.map(file => file.path);
    const updateProduct = await ProductSchema.findOneAndUpdate(
      { _id: id },
      {
        brand,
        title,
        price,
        colors,
        sizes,
        description,
        category,
        rate,
        count,
        filename:fileDataArray,
      },
      { new: true }
    );
    if (!updateProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json("Product detail updated");
    console.log("Product detail updated");
  } catch (error) {
    res.status(400).json({ error: error });
    console.log("Product detail failed" , error.message);
  }
};

// Delete ProductData by Id
export const DeleteProductData = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteProductData = await ProductSchema.findOneAndDelete({ _id: id });
    res.status(200).json(deleteProductData);
    console.log("product is Delete");
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log("product is not Delete");
  }
};

// review product section

// export const productReview = async (req,res)=>{
//   try {
//     const {comment,rating} = req.body;
//     const id = req.params.id;
//     const product = await ProductSchema.findById(id);
//     const alreadyReviewed =  product.reviews.find((r)=> { 
//       return r.user.toString() === req.user._id.toString()
//     });
  
//     if(alreadyReviewed){
//       return res.status(400).send({success:false,message:"product already review"})
//     }
//     const review = {
//       name:req.user.name,
//       rating:Number(rating),
//       comment,
//       user:req.user._id,
//     }
//     product.reviews.push(review);
    
//     product.numReviews = product.reviews.length;
//     product.rating = product.reviews.reduce((acc,item)=> item.rating + acc , 0)/product.reviews.length;
    
//     await product.save();
//     res.status(200).send({success:true,message:"Review Added!"});
//   } catch (error) {
//     console.log(error)
//     // cast error ||  OBJECT ID
//     if (error.name === "CastError") {
//       return res.status(500).send({
//         success: false,
//         message: "Invalid Id",
//       });
//     }
//     res.status(500).send({
//       success: false,
//       message: "Error In Review Comment API",
//       error,
//     });
//   }
  

// }


export const productReview = async (req, res) => {
  try {
    const { name, comment, rating } = req.body;
    const productId = req.params.id;

    //Validate input
    if (!comment || !rating) {
      return res.status(400).send({
        success: false,
        message: "Comment and rating are required",
      });
    }


    const product = await ProductSchema.findById(productId);
    
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

   

    const review = {
      name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    console.log("Review added!")
    res.status(200).send({ success: true, message: "Review added!" });
  } catch (error) {
    console.error(error);
    
    // Handle specific error types
    if (error.name === "CastError") {
      return res.status(400).send({
        success: false,
        message: "Invalid product ID",
      });
    }

    res.status(500).send({
      success: false,
      message: "Error in Review Comment API",
      error: error.message,
    });
  }
};

// delete Product Review
export const productDeleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params; 
    const { productId } = req.params; 

    // Fetch the product by ID
    const product = await ProductSchema.findById(productId);

    // Check if the product exists
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    product.reviews.splice(product.reviews.findIndex(ele => ele._id.toString() === reviewId) , 1)

    // Save the updated product document
    await product.save();
    res.status(200).json({ message: 'Review deleted successfully'});
    console.log("Review deleted");
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log("Failed to delete review");
  }
}

// update product reviews

export const productUpdateReview = async (req,res)=>{
  try {
    const { reviewId } = req.params; 
    const { productId } = req.params; 
    const {upDatedComment} = req.body;
    if(!upDatedComment){
      return res.status(400).json( {success: false,message:"please edit your comment!"})
    }
    // Fetch the product by ID
    const product = await ProductSchema.findById(productId);

    // Check if the product exists
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

   const updateComment = await product.reviews.find( ele => ele._id.toString() === reviewId)
   updateComment.comment = upDatedComment
    // Save the updated product document
    await product.save();
    res.status(200).json({ message: 'Review update successfully'});
    console.log("Review update");
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log("Failed to update review");
  }
}