const mongoose = require("mongoose")
const connect = mongoose.connect('mongodb://127.0.0.1:27017/E-Commerce_Website');

//check database connected or not 
connect.then(()=>{
    console.log("Database Connected");
})
.catch(()=>{
    console.log("Database Failed");
})

const UserSchema = new mongoose.Schema({
    first_name:{
        type:String,
        required:true
    },
    last_name:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    pincode:{
        type:Number,
        required:true
    },
    locality:{
      type:String,
      required:true
    },
    town:{
      type:String,
      required:true
    },
    state:{
      type:String,
      required:true
    },
    phone: {
      type: String,
      required: true,
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const AdminSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})


const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      brand: {
        type: String,
        required: true
      },
      category: {
        type: String,
        required: true
      },
      discountPercentage: {
        type: Number,
        required: true
      },
      images: {
        type: Array,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      rating: {
        type: Number,
        // required: true
      },
      stock: {
        type: Number,
        required: true
      },
      thumbnail: {
        type: String,
        required: true
      },
    //   isAdded:{
    //     type:Boolean
    //   },

});

const OrderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    title:{
      type:String,
      // required:true,
    },
    category:{
      type:String,
      // required:true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status:{
      type:String
    } 
  }],
}, {
  timestamps: true
});


const Lights = mongoose.model('Lights',ProductSchema)
const Fragrances = mongoose.model('Fragrances',ProductSchema)
const Sunglasses = mongoose.model('Sunglasses',ProductSchema)
const Automotives = mongoose.model('Automotives',ProductSchema)
const WomensJewellery = mongoose.model('WomensJewellery',ProductSchema)
const WomensWatches = mongoose.model('WomensWatches',ProductSchema)
const WomensFootwear = mongoose.model('WomensFootwear',ProductSchema)
const WomensClothes = mongoose.model('WomensClothes',ProductSchema)
const Bags = mongoose.model('Bags',ProductSchema)
const MensWatches = mongoose.model('MensWatches',ProductSchema)
const MensFootwear = mongoose.model('MensFootwear',ProductSchema)
const MensClothes = mongoose.model('MensClothes',ProductSchema)
const TwoWheelers = mongoose.model('TwoWheelers',ProductSchema)
const BeautyToys = mongoose.model('BeautyToys',ProductSchema)
const Appliances = mongoose.model('Appliances',ProductSchema)
const HomeFurniture = mongoose.model('HomeFurniture',ProductSchema)
const Electronics = mongoose.model('Electronics',ProductSchema)
const Fashions = mongoose.model('Fashions',ProductSchema)
const Mobiles = mongoose.model('MobileItem',ProductSchema)
const Grocery = mongoose.model('GroceryItem', ProductSchema);
const Admin = new mongoose.model("admin",AdminSchema)
const Users = new mongoose.model("users",UserSchema)
const Products = new mongoose.model("Products", ProductSchema)
const Carts = mongoose.model('carts', ProductSchema);
const WishList = mongoose.model('wishlist', ProductSchema);
const Order = mongoose.model('Order', OrderSchema);


module.exports = {Users,Admin,Products,Order,Grocery,Mobiles,Fashions,Electronics,HomeFurniture,Appliances,BeautyToys,TwoWheelers,MensClothes,MensFootwear,MensWatches,Bags,WomensClothes,WomensFootwear,WomensWatches,WomensJewellery,Automotives,Sunglasses,Fragrances,Lights,Carts,WishList}