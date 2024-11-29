import { redisClient } from "../DB Connection/redis_connection.js";
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

    if (category) {
      query.category = category;
    }
    if (brand) {
      query.brand = brand;
    }
    const cacheKey = 'productData'
    const cachedData =await redisClient.get(cacheKey);
    if(cachedData){
      return res.status(200).json(JSON.parse(cachedData))
    }
    const skip = (page - 1) * pageSize;
    const totalCount = await ProductSchema.countDocuments(query);

    let queryData = await ProductSchema.find(query).limit(pageSize).skip(skip);
    const pageCount = Math.ceil(totalCount / pageSize);
    await redisClient.set(cacheKey,JSON.stringify({
      pagination: {
        page,
        totalCount,
        pageCount,
        pageSize,
      },
      queryData,
    }),{
      EX:5
    })
    res.status(200).json({
      pagination: {
        page,
        totalCount,
        pageCount,
        pageSize,
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
    const cacheKey= `productData${id}`
    const cacheData = await redisClient.get(cacheKey);
    if(cacheData){
      return res.status(200).json(JSON.parse(cacheData))
    }
    const getById = await ProductSchema.findById({ _id: id });

    await redisClient.set(cacheKey,JSON.stringify(getById),{
      EX:3600
    })
    res.status(200).json(getById);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const createProductData = async (req, res) => {
  try {
    const {
      brand,
      title,
      price,
      description,
      category,
      rate,
      count,
      colors,
      sizes,
    } = req.body;
    const fileDataArray = req.files.map((file) => file.path);
    if (!fileDataArray) {
      console.log("no file there!!!");
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
      filename: fileDataArray,
    });

    await productImg.save();
    res.send("file stored in data");
    console.log("file has been stored in database");
  } catch (error) {
    console.log("file has failed to stored in database", {
      error: error,
    });
    res.status(400).json(error.message);
  }
};

// Update the ProductData by Id
export const UpdateProductData = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      brand,
      title,
      price,
      description,
      category,
      rate,
      count,
      colors,
      sizes,
    } = req.body;
    const fileDataArray = req.files.map((file) => file.path);
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
        filename: fileDataArray,
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
    console.log("Product detail failed", error.message);
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


export const productReview = async (req, res) => {
  try {
    const { name, comment, rating } = req.body;
    const productId = req.params.id;

    //Validate input
    if (!name || !comment || !rating) {
      return res.status(400).send({
        success: false,
        message: "Please Right Something",
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
    product.rating = product.reviews.reduce((acc, item) => acc + item.rating, 0) / product.numReviews;

    await product.save();
    console.log("Review added!");
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
      return res.status(404).json({ error: "Product not found" });
    }
    const productCommentIndx =  product.reviews.findIndex((ele) => ele._id.toString() === reviewId)
    product.reviews.splice(
      productCommentIndx,
      1
    );

    if (product.reviews.length === 0) {
      product.numReviews = 0;
      product.rating = 0;
    }
    if(product.reviews.length){
      product.numReviews = product.reviews.length
    }
    // Save the updated product document
    await product.save();
    res.status(200).json({ message: "Review deleted successfully" });
    console.log("Review deleted");
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log("Failed to delete review");
  }
};

// update product reviews

export const productUpdateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { productId } = req.params;
    const { upDatedComment } = req.body;
    if (!upDatedComment) {
      return res
        .status(400)
        .json({ success: false, message: "please edit your comment!" });
    }
    // Fetch the product by ID
    const product = await ProductSchema.findById(productId);

    // Check if the product exists
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const updateComment = await product.reviews.find(
      (ele) => ele._id.toString() === reviewId
    );
    updateComment.comment = upDatedComment;
    // Save the updated product document
    await product.save();
    res.status(200).json({ message: "Review update successfully" });
    console.log("Review update");
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log("Failed to update review");
  }
};
