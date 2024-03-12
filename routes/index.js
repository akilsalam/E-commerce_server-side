var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt')
const  {Users, Carts, WishList, Products, Order, Rate} = require('../config/config');
const CryptoJS = require('crypto-js');
const Razorpay = require('razorpay')
require('dotenv').config();
const crypto =require('crypto');
const { path } = require('../app');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, "client" , "build" , "index.html"))
});

router.post('/profile', async function (req, res, next) {
  const { email, phone } = req.body;
  // Check if either email or phone is provided
  if (!email && !phone) {
    return res.status(400).json({ error: 'Either email or phone must be provided.' });
  }
  try {
    let profile;

    if (email || phone) {
      // Use $or to find a user based on email or phone
      profile = await Users.findOne({ $or: [{ email }, { phone }] });
    }
    if (profile) {
      res.json(profile);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal server error');
  }
});

router.post('/profileEdit/:userId', async (req, res) => {
  try {
    const userId = req.params.userId; // Use req.params.userId to get userId from the URL
    const updates = req.body;

    // Update the user data in the database (use your database library here)
    const editedData = await Users.findByIdAndUpdate(
      userId,
      {
        $set: {
          first_name: updates.firstData,
          last_name: updates.lastData,
          address: updates.addressData,
          pincode: updates.pincode,
          locality: updates.locality,
          town: updates.town,
          state:updates.state,
          email: updates.emailData
        }
      },
      { new: true }
    );

    console.log("Edited Data:", editedData);

    if (editedData) {
      res.json({ success: true, redirectUrl: '/profile' });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Error editing user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async function (req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await Users.findOne({ email });
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        // Passwords match, include a redirection URL in the response
        res.json({ success: true, redirectUrl: '/'  });
        
      } else {
        // Passwords do not match, include an error message in the response
        res.json({ success: false, message: 'Invalid password'  });
      }
    } else {
      // User not found, include an error message in the response
      res.json({ success: false, message: 'User Name Not Found!!🧐' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal server error');
  }
});

router.post('/checkPhoneNumber', async (req, res) => {
  const { phone } = req.body;

  try {
    const user = await Users.findOne({ phone });
    if (user) {
        // Phone number exists in the database
        res.status(200).json({ exists: true });
    } else {
        // Phone number not found in the database
        res.status(200).json({ exists: false });
    }
} catch (error) {
    console.error('Error checking phone number:', error);
    res.status(500).json({ error: 'Internal server error' });
}

});

router.post('/signup', async function(req, res, next) {
  const inputData = {
    first_name: req.body.firstData,
    last_name: req.body.lastData,
    address: req.body.address,
    pincode: req.body.pincode,
    locality: req.body.locality,
    town:req.body.town,
    state: req.body.state,
    phone: req.body.phone,
    email: req.body.emailData,
    password: req.body.passwordData
  };
  const existingUser = await Users.findOne({ $or: [{ email: inputData.email }, { phone: inputData.phone }] });
  if (existingUser) {
    // User already exists
    res.json({ success: false, message: 'User already exists.Please enter another email or phone no' });
  } else {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(inputData.password, saltRounds);
    inputData.password = hashedPassword;

    try {
      const userdata = await Users.insertMany([inputData]);
      if (userdata) {
        res.json({ success: true, redirectUrl: '/login' });
      } else {
        res.json({ success: false, message: 'Registration failed' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
});

router.post('/cart', async (req, res) => {
  try {
    const { user, items } = req.body;

    // Validate if items is an array
    if (items && Array.isArray(items)) {
      // Validate each item in the array
      const isValidItems = items.every(item => {
        return (
          item.thumbnail &&
          item.stock &&
          item.price &&
          item.discountPercentage &&
          item.category &&
          item.brand &&
          item.description &&
          item.title
          // Add other relevant fields as needed
        );
      });

      if (isValidItems) {
        // Insert the items into the database
        const cartProducts = await Carts.findOneAndUpdate(
          { user: user }, // Assuming user is a unique identifier for the cart
          { $push: { items: items } }, // Add items to the existing cart or create a new one
          { upsert: true, new: true }
        );

        // Respond with a success message
        res.json({ success: true, message: 'Cart data received successfully' });
      } else {
        // Respond with an error if any item is missing required fields
        res.status(400).json({ success: false, message: 'Invalid item format' });
      }
    } else {
      // Respond with an error if the request is not in the expected format
      res.status(400).json({ success: false, message: 'Invalid request format' });
    }
  } catch (error) {
    // Handle other errors
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.delete('/cart/:productId', async (req, res) => {
  const productId = req.params.productId;
  const user = req.body.user;

  if (user) {
    try {
      await Carts.updateOne(
        { user: user },
        { $pull: { items: { _id: productId } } }
      );

      res.json({ message: 'Product deleted from the user\'s cart in the database' });
    } catch (error) {
      console.error('Error deleting cart data from the database:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(400).json({ error: 'User information not provided' });
  }
});


router.get('/carts', async (req, res) => {
  try {
    const cartProducts = await Carts.find();
    res.json(cartProducts);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Modify the backend code to use findOne instead of findById
router.get('/cart/:user', async (req, res) => {
  const { user } = req.params;
  try {
    const userCart = await Carts.findOne({ user: user });
    if (userCart) {
      res.json(userCart.items);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error('Error fetching user cart from the database:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/cartExist/:productId', async (req, res) => {
  const { productId } = req.params;
  const { user } = req.query;

  try {
    const userCart = await Carts.findOne({ user: user, 'items._id': productId });
    const existsInCart = userCart !== null;
    res.json({ exists: existsInCart });
  } catch (error) {
    console.error('Error checking if product exists in cart:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.get('/wishlist/:user', async (req, res) => {
  const { user } = req.params;
  try {
    const userCart = await WishList.findOne({ user: user });
    if (userCart) {
      res.json(userCart.items);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error('Error fetching user wishlist from the database:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/wishlist', async (req, res) => {
  try {
    const { user, items } = req.body;

    // Validate if items is an array
    if (items && Array.isArray(items)) {
      // Validate each item in the array
      const isValidItems = items.every(item => {
        return (
          item.thumbnail &&
          item.stock &&
          item.price &&
          item.discountPercentage &&
          item.category &&
          item.brand &&
          item.description &&
          item.title
          // Add other relevant fields as needed
        );
      });

      if (isValidItems) {
        // Insert the items into the database
        const wishListProducts = await WishList.findOneAndUpdate(
          { user: user }, // Assuming user is a unique identifier for the cart
          { $push: { items: items } }, // Add items to the existing cart or create a new one
          { upsert: true, new: true }
        );

        // Respond with a success message
        res.json({ success: true, message: 'WishList data received successfully' });
      } else {
        // Respond with an error if any item is missing required fields
        res.status(400).json({ success: false, message: 'Invalid item format' });
      }
    } else {
      // Respond with an error if the request is not in the expected format
      res.status(400).json({ success: false, message: 'Invalid request format' });
    }
  } catch (error) {
    // Handle other errors
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.get('/wishExist/:productId', async (req, res) => {
  const { productId } = req.params;
  const { user } = req.query;

  try {
    const userCart = await WishList.findOne({ user: user, 'items._id': productId });
    const existsInCart = userCart !== null;
    res.json({ exists: existsInCart });
  } catch (error) {
    console.error('Error checking if product exists in cart:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.delete('/wishlist/:productId', async (req, res) => {
  const productId = req.params.productId;
  const user = req.body.user;

  if (user) {
    try {
      await WishList.updateOne(
        { user: user },
        { $pull: { items: { _id: productId } } }
      );

      res.json({ message: 'Product deleted from the user\'s wishlist in the database' });
    } catch (error) {
      console.error('Error deleting wishlist data from the database:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(400).json({ error: 'User information not provided' });
  }
});

router.get('/groceries', async (req, res) => {
  try {
    const products = await Products.find({category:'Groceries'});
    res.json(products);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/smartphones', async (req, res) => {
  try {
    const groceries = await Products.find({category:'Mobiles'});
    res.json(groceries);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/fashions', async (req, res) => {
  try {
    const products = await Products.find({category:'Fashions'});
    res.json(products);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/electronics', async (req, res) => {
  try {
    const products = await Products.find({category:'Electronics'});
    res.json(products);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/furniture', async (req, res) => {
  try {
    const products = await Products.find({category:'Furniture'});
    res.json(products);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/appliances', async (req, res) => {
  try {
    const products = await Products.find({category:'Appliances'});
    res.json(products);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/beautyToys', async (req, res) => {
  try {
    const products = await Products.find({category:'Beauty or Toys'});
    res.json(products);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/two-wheelers', async (req, res) => {
  try {
    const products = await Products.find({category:'Two Wheelers'});
    res.json(products);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/mens-clothes', async (req, res) => {
  try {
    const products = await Products.find({category:'Mens Clothes'});
    res.json(products);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/mens-watches', async (req, res) => {
  try {
    const products = await Products.find({category:'Mens Watches'});
    res.json(products);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/mens-footwears', async (req, res) => {
  try {
    const products = await Products.find({category:'Mens Footwears'});
    res.json(products);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/bags', async (req, res) => {
  try {
    const products = await Products.find({category:'Bags'});
    res.json(products);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/women-clothes', async (req, res) => {
  try {
    const products = await Products.find({category:'Womens Clothes'});
    res.json(products);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/women-watches', async (req, res) => {
  try {
    const products = await Products.find({category:'Womens Watches'});
    res.json(products);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/women-footwears', async (req, res) => {
  try {
    const products = await Products.find({category:'Womens Footwear'});
    res.json(products);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/women-jewellery', async (req, res) => {
  try {
    const products = await Products.find({category:'Womens Jewellery'});
    res.json(products);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/automotive', async (req, res) => {
  try {
    const products = await Products.find({category:'Automotives'});
    res.json(products);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/sunglasses', async (req, res) => {
  try {
    const products = await Products.find({category:'Sunglasses'});
    res.json(products);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/fragrances', async (req, res) => {
  try {
    const products = await Products.find({category:'Fragrances'});
    res.json(products);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/lights', async (req, res) => {
  try {
    const products = await Products.find({category:'Lights'});
    res.json(products);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/View/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Products.findById(id)

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/checkout/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Products.findById(id)

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/placeOrder', async (req, res) => {
  try {
    const { customer, products } = req.body;
    console.log(req.body);

    // Remove the plus sign from the phone number
    const formattedCustomer = customer.replace('+', '');

    // Find the user in the database
    const buyer = await Users.findOne({ phone: formattedCustomer });

    if (buyer) {
      const customerId = buyer._id;

      // Find an existing order for the customer
      const existingOrder = await Order.findOne({ customerId });

      if (existingOrder) {
        // If an existing order is found, update it by adding the new products
        existingOrder.products.push(...products.map(product => ({
          productId: product.productId,
          title: product.title,
          thumbnail: product.thumbnail,
          category: product.category,
          quantity: product.quantity,
          totalAmount: product.totalAmount,
          date: product.date,
          status: product.status,
          // Add other relevant fields as needed
        })));

        // Update the existing order in the database
        await existingOrder.save();

        console.log('Order updated successfully');
        res.status(201).json({ message: 'Order updated successfully' });
      } else {
        // If no existing order is found, create a new order
        const newOrder = new Order({
          customerId,
          products: products.map(product => ({
            productId: product.productId,
            title: product.title,
            thumbnail: product.thumbnail,
            category: product.category,
            quantity: product.quantity,
            totalAmount: product.totalAmount,
            date: product.date,
            status: product.status,
            // Add other relevant fields as needed
          })),
        });

        // Save the new order to the database
        await newOrder.save();

        console.log('Order placed successfully');
        res.status(201).json({ message: 'Order placed successfully' });
      }
    } else {
      console.log('User not found');
      res.status(400).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/checkoutForm/:id', async (req, res) => {
  const id = req.params.id;

  // const secretKey = 'yourSecretKey';
  // const decryptedUserId = CryptoJS.AES.decrypt(id, secretKey).toString(CryptoJS.enc.Utf8);
  const userId = String(id).replace(/[+/]/g, '');

  const selectUser = await Users.findOne({
    $or: [
      { phone: userId },
      { email: userId }
    ]
  });
  
  if (!selectUser) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  
  res.send(selectUser);
  
});


router.post('/checkoutForm/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;

    // const secretKey = 'yourSecretKey';
    // const decryptedUserId = CryptoJS.AES.decrypt(id, secretKey).toString(CryptoJS.enc.Utf8);
    const userId = String(id).replace(/[+/]/g, '');

    // Find the user
    const user = await Users.findOne({
      $or: [
        { phone: userId },
        { email: userId }
      ]
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.address = updates.addressData;
    user.pincode = updates.pincode;
    user.locality = updates.locality;
    user.town = updates.town;
    user.state = updates.state;

    const editedData = await user.save();

    res.json({ success: true, redirectUrl: '/' });
  } catch (error) {
    console.error('Error editing user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Define the route to fetch product details based on the product ID
router.get('/checkoutProduct/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;

    // Fetch the product order that contains the specified product ID
    const productOrder = await Order.findOne({
      'products.productId': productId
    });

    if (!productOrder) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Find the product details within the product order
    const productDetails = productOrder.products.find(product => String(product.productId) === productId);

    res.json({ success: true, productDetails });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post("/payment", async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
  });

      const options = req.body;

      const order = await razorpay.orders.create(options);

      if (!order) {
          return res.status(500).send("Error");
      }
      res.json(order);
  } catch (err) {
      console.log(err);
      res.status(500).send("Error")
  }
})

router.post("/payment/validate",async (req,res)=>{
  const { razorpay_order_id, razorpay_payment_id,razorpay_signature } = req.body

  const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`)
  const digest = sha.digest("hex");
  if(digest !== razorpay_signature){
      return res.status(400).json({msg: "Transaction is not legit!"});
  }
  res.json({
      msg: "success",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
  })
})

router.post('/rateProduct/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating } = req.body;

    // Find or create a Rate document for the given productId
    let rate = await Rate.findOne({ ProductId: productId });

    if (!rate) {
      rate = await Rate.create({ ProductId: productId });
    }

    // Increment the corresponding star rating field based on the received rating
    switch (rating) {
      case 1:
        rate.OneStar = (rate.OneStar || 0) + 1;
        break;
      case 2:
        rate.TwoStar = (rate.TwoStar || 0) + 1;
        break;
      case 3:
        rate.ThreeStar = (rate.ThreeStar || 0) + 1;
        break;
      case 4:
        rate.FourStar = (rate.FourStar || 0) + 1;
        break;
      case 5:
        rate.FiveStar = (rate.FiveStar || 0) + 1;
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid rating value' });
    }

    await rate.save();

    res.status(200).json({ success: true, message: 'Rating saved successfully' });
  } catch (error) {
    console.error('Error saving rating:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

router.get('/rate/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Find the Rate document for the given productId
    const rate = await Rate.findOne({ ProductId: productId });

    if (!rate) {
      return res.status(404).json({ success: false, message: 'Rate not found for the given product ID' });
    }

    // Send the rate data as the response
    res.status(200).json({ success: true, data: rate });
  } catch (error) {
    console.error('Error fetching rate data:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

module.exports = router;
