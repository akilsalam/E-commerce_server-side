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
    phone:{
        type:Number,
        required:true
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
    category: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    discountPercentage: {
        type: Number,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
});

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

module.exports = {Users,Admin,Grocery,Mobiles,Fashions,Electronics,HomeFurniture,Appliances,BeautyToys,TwoWheelers}