import mongoose from "mongoose";
const ReviewProduct = mongoose.Schema({
    name:{type : String},
    rating:{
        type:Number,
        default:0,
    },
    comment:{
        type:String
    },
    createdAt: { type: Date, default: Date.now }
},{timestamps:true})

const Product_DB = mongoose.Schema({
    brand:{type:String},
    title:{type:String},
    price:{type:String},
    description:{type:String},
    category:{type:String},
    rate:{type:String},
    count:{type:String},
    filename:[{type:String}],
    colors: [{ type: String }],
    sizes: [{ type: String }],
    reviews:[ReviewProduct],
    numReviews: {
        type: Number,
        default: 0,
      },
      rating: {
        type: Number,
        default: 0,
      },
},{timestamps:true});

const ProductSchema = mongoose.model('productData',Product_DB);
export{ProductSchema};

