const mongoose = require("mongoose");
const MONGODB_URL = 'mongodb+srv://akilsalamnk:akiljithu@cluster0.fymjrfg.mongodb.net/';
const connect = mongoose.connect(MONGODB_URL);

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

const cartSchema = new mongoose.Schema({
  user: {
    type: String, // Assuming user is a unique identifier (replace with the appropriate type)
    required: true,
  },
  items: [ProductSchema],
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
    thumbnail: {
      type: String,
      required: true
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
      type: String,
      default: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }),
    },    
    status:{
      type:String
    } 
  }],
}, {
  timestamps: true
});

const RateSchema = new mongoose.Schema({
  ProductId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  OneStar: {
    type: Number,
    default: 0,
  },
  TwoStar: {
    type: Number,
    default: 0,
  },
  ThreeStar: {
    type: Number,
    default: 0,
  },
  FourStar: {
    type: Number,
    default: 0,
  },
  FiveStar: {
    type: Number,
    default: 0,
  },
});


const Admin = new mongoose.model("admin",AdminSchema)
const Users = new mongoose.model("users",UserSchema)
const Products = new mongoose.model("Products", ProductSchema)
const Carts = mongoose.model('Cart', cartSchema);
const WishList = mongoose.model('wishlist', cartSchema);
const Order = mongoose.model('Order', OrderSchema);
const Rate = new mongoose.model("rate",RateSchema);



module.exports = {Users,Admin,Products,Order,Carts,WishList,Rate}