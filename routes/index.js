var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt')
const  {Users,Grocery,Mobiles,Fashions, Electronics, HomeFurniture, Appliances, BeautyToys, TwoWheelers,MensClothes,MensFootwear,MensWatches,Bags,WomensClothes,WomensFootwear,WomensWatches,WomensJewellery,Automotives,Sunglasses,Fragrances,Lights, Carts, WishList, Products, Order} = require('../config/config');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json('hi');
});

router.post('/profile', async function (req, res, next) {
  const { email, phone } = req.body;
  // Check if either email or phone is provided
  if (!email && !phone) {
    return res.status(400).json({ error: 'Either email or phone must be provided.' });
  }
  try {
    let profile;

    if (email) {
      // Query the database based on email
      profile = await Users.findOne({ email });
    } else if (phone) {
      // Query the database based on phone
      profile = await Users.findOne({ phone });
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


router.post('/addToCart/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const sourceData1 = await Grocery.findById(id);
    const sourceData2 = await Mobiles.findById(id);
    const sourceData3 = await Fashions.findById(id)
    const sourceData4 = await Electronics.findById(id)
    const sourceData5 = await HomeFurniture.findById(id)
    const sourceData6 = await Appliances.findById(id)
    const sourceData7 = await BeautyToys.findById(id)
    const sourceData8 = await TwoWheelers.findById(id)
    const sourceData9 = await MensClothes.findById(id)
    const sourceData10 = await MensFootwear.findById(id)
    const sourceData11= await Bags.findById(id)
    const sourceData12 = await WomensClothes.findById(id)
    const sourceData13 = await WomensFootwear.findById(id)
    const sourceData14 = await WomensWatches.findById(id)
    const sourceData15 = await WomensJewellery.findById(id)
    const sourceData16 = await Automotives.findById(id)
    const sourceData17 = await Sunglasses.findById(id)
    const sourceData18 = await Fragrances.findById(id)
    const sourceData19 = await Lights.findById(id)

    if (!sourceData1 && !sourceData2 && !sourceData3 && !sourceData4 && !sourceData5 && !sourceData6 && !sourceData7 && !sourceData8 && !sourceData9 && !sourceData10 && !sourceData11 && !sourceData12 && !sourceData13 && !sourceData14 && !sourceData15 && !sourceData16 && !sourceData17 && !sourceData18 && !sourceData19) {
      // Handle the case where both source data are null
      return res.status(404).json({ error: 'Data not found for the given id' });
    }

    // Prepare data for insertion into the destination collection
    const cartData1 = sourceData1
      ? {
          title: sourceData1.title,
          description: sourceData1.description,
          category: sourceData1.category,
          brand: sourceData1.brand,
          rating: sourceData1.rating,
          discountPercentage: sourceData1.discountPercentage,
          images: sourceData1.images,
          price: sourceData1.price,
          stock: sourceData1.stock,
          thumbnail: sourceData1.thumbnail, // Replace with the actual thumbnail URL
          // isAdded:true
        }
      : null;

    const cartData2 = sourceData2
      ? {
          title: sourceData2.title,
          description: sourceData2.description,
          category: sourceData2.category,
          brand: sourceData2.brand,
          rating: sourceData2.rating,
          discountPercentage: sourceData2.discountPercentage,
          images: sourceData2.images,
          price: sourceData2.price,
          stock: sourceData2.stock,
          thumbnail: sourceData2.thumbnail, // Replace with the actual thumbnail URL
          // isAdded:true
        }
      : null;

      const cartData3 = sourceData3
      ? {
          title: sourceData3.title,
          description: sourceData3.description,
          category: sourceData3.category,
          brand: sourceData3.brand,
          rating: sourceData3.rating,
          discountPercentage: sourceData3.discountPercentage,
          images: sourceData3.images,
          price: sourceData3.price,
          stock: sourceData3.stock,
          thumbnail: sourceData3.thumbnail, // Replace with the actual thumbnail URL
          // isAdded:true
        }
      : null;

      const cartData4 = sourceData4
      ? {
          title: sourceData4.title,
          description: sourceData4.description,
          category: sourceData4.category,
          brand: sourceData4.brand,
          rating: sourceData4.rating,
          discountPercentage: sourceData4.discountPercentage,
          images: sourceData4.images,
          price: sourceData4.price,
          stock: sourceData4.stock,
          thumbnail: sourceData4.thumbnail, // Replace with the actual thumbnail URL
          // isAdded:true
        }
      : null;

      const cartData5 = sourceData5
      ? {
          title: sourceData5.title,
          description: sourceData5.description,
          category: sourceData5.category,
          brand: sourceData5.brand,
          rating: sourceData5.rating,
          discountPercentage: sourceData5.discountPercentage,
          images: sourceData5.images,
          price: sourceData5.price,
          stock: sourceData5.stock,
          thumbnail: sourceData5.thumbnail, // Replace with the actual thumbnail URL
          // isAdded:true
        }
      : null;

      const cartData6 = sourceData6
      ? {
          title: sourceData6.title,
          description: sourceData6.description,
          category: sourceData6.category,
          brand: sourceData6.brand,
          rating: sourceData6.rating,
          discountPercentage: sourceData6.discountPercentage,
          images: sourceData6.images,
          price: sourceData6.price,
          stock: sourceData6.stock,
          thumbnail: sourceData6.thumbnail, // Replace with the actual thumbnail URL
          // isAdded:true
        }
      : null;

      const cartData7 = sourceData7
      ? {
          title: sourceData7.title,
          description: sourceData7.description,
          category: sourceData7.category,
          brand: sourceData7.brand,
          rating: sourceData7.rating,
          discountPercentage: sourceData7.discountPercentage,
          images: sourceData7.images,
          price: sourceData7.price,
          stock: sourceData7.stock,
          thumbnail: sourceData7.thumbnail, // Replace with the actual thumbnail URL
          // isAdded:true
        }
      : null;

      const cartData8 = sourceData8
      ? {
          title: sourceData8.title,
          description: sourceData8.description,
          category: sourceData8.category,
          brand: sourceData8.brand,
          rating: sourceData8.rating,
          discountPercentage: sourceData8.discountPercentage,
          images: sourceData8.images,
          price: sourceData8.price,
          stock: sourceData8.stock,
          thumbnail: sourceData8.thumbnail, // Replace with the actual thumbnail URL
          // isAdded:true
        }
      : null;

      const cartData9 = sourceData9
      ? {
          title: sourceData9.title,
          description: sourceData9.description,
          category: sourceData9.category,
          brand: sourceData9.brand,
          rating: sourceData9.rating,
          discountPercentage: sourceData9.discountPercentage,
          images: sourceData9.images,
          price: sourceData9.price,
          stock: sourceData9.stock,
          thumbnail: sourceData9.thumbnail, // Replace with the actual thumbnail URL
          // isAdded:true
        }
      : null;

      const cartData10 = sourceData10
      ? {
          title: sourceData10.title,
          description: sourceData10.description,
          category: sourceData10.category,
          brand: sourceData10.brand,
          rating: sourceData10.rating,
          discountPercentage: sourceData10.discountPercentage,
          images: sourceData10.images,
          price: sourceData10.price,
          stock: sourceData10.stock,
          thumbnail: sourceData10.thumbnail, // Replace with the actual thumbnail URL
          // isAdded:true
        }
      : null;

      const cartData11 = sourceData11
      ? {
          title: sourceData11.title,
          description: sourceData11.description,
          category: sourceData11.category,
          brand: sourceData11.brand,
          rating: sourceData11.rating,
          discountPercentage: sourceData11.discountPercentage,
          images: sourceData11.images,
          price: sourceData11.price,
          stock: sourceData11.stock,
          thumbnail: sourceData11.thumbnail, // Replace with the actual thumbnail URL
          // isAdded:true
        }
      : null;
    
      const cartData12 = sourceData12
      ? {
          title: sourceData12.title,
          description: sourceData12.description,
          category: sourceData12.category,
          brand: sourceData12.brand,
          rating: sourceData12.rating,
          discountPercentage: sourceData12.discountPercentage,
          images: sourceData12.images,
          price: sourceData12.price,
          stock: sourceData12.stock,
          thumbnail: sourceData12.thumbnail, // Replace with the actual thumbnail URL
          // isAdded:true
        }
      : null;

      const cartData13 = sourceData13
      ? {
          title: sourceData13.title,
          description: sourceData13.description,
          category: sourceData13.category,
          brand: sourceData13.brand,
          rating: sourceData13.rating,
          discountPercentage: sourceData13.discountPercentage,
          images: sourceData13.images,
          price: sourceData13.price,
          stock: sourceData13.stock,
          thumbnail: sourceData13.thumbnail, // Replace with the actual thumbnail URL
          // isAdded:true
        }
      : null;

      const cartData14 = sourceData14
      ? {
          title: sourceData14.title,
          description: sourceData14.description,
          category: sourceData14.category,
          brand: sourceData14.brand,
          rating: sourceData14.rating,
          discountPercentage: sourceData14.discountPercentage,
          images: sourceData14.images,
          price: sourceData14.price,
          stock: sourceData14.stock,
          thumbnail: sourceData14.thumbnail, // Replace with the actual thumbnail URL
          // isAdded:true
        }
      : null;

      const cartData15 = sourceData15
      ? {
          title: sourceData15.title,
          description: sourceData15.description,
          category: sourceData15.category,
          brand: sourceData15.brand,
          rating: sourceData15.rating,
          discountPercentage: sourceData15.discountPercentage,
          images: sourceData15.images,
          price: sourceData15.price,
          stock: sourceData15.stock,
          thumbnail: sourceData15.thumbnail, // Replace with the actual thumbnail URL
          // isAdded:true
        }
      : null;

      const cartData16 = sourceData16
      ? {
          title: sourceData16.title,
          description: sourceData16.description,
          category: sourceData16.category,
          brand: sourceData16.brand,
          rating: sourceData16.rating,
          discountPercentage: sourceData16.discountPercentage,
          images: sourceData16.images,
          price: sourceData16.price,
          stock: sourceData16.stock,
          thumbnail: sourceData16.thumbnail, // Replace with the actual thumbnail URL
          // isAdded:true
        }
      : null;

      const cartData17 = sourceData17
      ? {
          title: sourceData17.title,
          description: sourceData17.description,
          category: sourceData17.category,
          brand: sourceData17.brand,
          rating: sourceData17.rating,
          discountPercentage: sourceData17.discountPercentage,
          images: sourceData17.images,
          price: sourceData17.price,
          stock: sourceData17.stock,
          thumbnail: sourceData17.thumbnail, // Replace with the actual thumbnail URL
          // isAdded:true
        }
      : null;

      const cartData18 = sourceData18
      ? {
          title: sourceData18.title,
          description: sourceData18.description,
          category: sourceData18.category,
          brand: sourceData18.brand,
          rating: sourceData18.rating,
          discountPercentage: sourceData18.discountPercentage,
          images: sourceData18.images,
          price: sourceData18.price,
          stock: sourceData18.stock,
          thumbnail: sourceData18.thumbnail, // Replace with the actual thumbnail URL
          // isAdded:true
        }
      : null;

      const cartData19 = sourceData19
      ? {
          title: sourceData19.title,
          description: sourceData19.description,
          category: sourceData19.category,
          brand: sourceData19.brand,
          rating: sourceData19.rating,
          discountPercentage: sourceData19.discountPercentage,
          images: sourceData19.images,
          price: sourceData19.price,
          stock: sourceData19.stock,
          thumbnail: sourceData19.thumbnail, // Replace with the actual thumbnail URL
          // isAdded:true
        }
      : null;

// Insert data into the destination collection
try {
  const insertedData1 = cartData1 ? await Carts.insertMany([cartData1]) : [];
  const insertedData2 = cartData2 ? await Carts.insertMany([cartData2]) : [];
  const insertedData3 = cartData3 ? await Carts.insertMany([cartData3]) : []; 
  const insertedData4 = cartData4 ? await Carts.insertMany([cartData4]) : [];
  const insertedData5 = cartData5 ? await Carts.insertMany([cartData5]) : [];
  const insertedData6 = cartData6 ? await Carts.insertMany([cartData6]) : [];
  const insertedData7 = cartData7 ? await Carts.insertMany([cartData7]) : [];
  const insertedData8 = cartData8 ? await Carts.insertMany([cartData8]) : [];
  const insertedData9 = cartData9 ? await Carts.insertMany([cartData9]) : [];
  const insertedData10 = cartData10 ? await Carts.insertMany([cartData10]) : [];
  const insertedData11 = cartData11 ? await Carts.insertMany([cartData11]) : [];
  const insertedData12 = cartData12 ? await Carts.insertMany([cartData12]) : [];
  const insertedData13 = cartData13 ? await Carts.insertMany([cartData13]) : [];
  const insertedData14 = cartData14 ? await Carts.insertMany([cartData14]) : [];
  const insertedData15 = cartData15 ? await Carts.insertMany([cartData15]) : [];
  const insertedData16 = cartData16 ? await Carts.insertMany([cartData16]) : [];
  const insertedData17 = cartData17 ? await Carts.insertMany([cartData17]) : [];
  const insertedData18 = cartData18 ? await Carts.insertMany([cartData18]) : [];
  const insertedData19 = cartData19 ? await Carts.insertMany([cartData19]) : [];

  res.json({ message: 'Data moved successfully', insertedData1, insertedData2 ,insertedData3,insertedData4,insertedData5,insertedData6,insertedData7,insertedData8,insertedData9,insertedData10,insertedData11,insertedData12,insertedData13,insertedData14,insertedData15,insertedData16,insertedData17,insertedData18,insertedData19});
} catch (error) {
  console.error('Error inserting data into Carts collection:', error);
  res.status(500).json({ error: 'Internal Server Error', message: error.message });
}

  } catch (error) {
    console.error('Error moving data:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});


router.get('/checkCart/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Replace this with your actual logic to check if the item is in the cart
    const isAdded = await Carts.exists({ _id: id });
    res.json({ isAdded });
  } catch (error) {
    console.error('Error checking cart status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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

router.get('/wishlist', async (req, res) => {
  try {
    const wishListProducts = await WishList.find();
    res.json(wishListProducts);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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
    const { customer, productId,title,category, quantity, totalAmount ,date,status } = req.body;

    // Remove the plus sign from the phone number
    const formattedCustomer = customer.replace('+', '');

    // Find the user in the database
    const buyer = await Users.findOne({ phone: formattedCustomer });

    if (buyer) {
      const customerId = buyer._id;

      // Find an existing order for the customer
      const existingOrder = await Order.findOne({ customerId });

      if (existingOrder) {
        // If an existing order is found, update it by adding the new product
        existingOrder.products.push({
          productId,
          title,
          category,
          quantity,
          totalAmount,
          date,
          // Add other relevant fields as needed
        });

        // Update the existing order in the database
        await existingOrder.save();

        console.log('Order updated successfully');
        res.status(201).json({ message: 'Order updated successfully' });
      } else {
        // If no existing order is found, create a new order
        const newOrder = new Order({
          customerId,
          products: [{
            productId,
            title,
            category,
            quantity,
            totalAmount,
            status,
            // Add other relevant fields as needed
          }],
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




module.exports = router;
