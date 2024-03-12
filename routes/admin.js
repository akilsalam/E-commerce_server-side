var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const multer = require('multer');
const { Admin,Lights,Fragrances,Sunglasses,Automotives,WomensJewellery,WomensClothes,WomensWatches,WomensFootwear,Bags,MensClothes,MensFootwear,MensWatches,Grocery,Mobiles,Fashions,Electronics,HomeFurniture,Appliances,BeautyToys,TwoWheelers, Users, Products, Order } = require('../config/config');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/login', async function (req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await Admin.findOne({ email });
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        // Passwords match, include a redirection URL in the response
        res.json({ success: true, redirectUrl: '/admin'  });
        
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

router.get('/users', async (req, res) => {
  try {
    const users = await Users.find().sort({ _id: -1 })
    res.json(users);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/addUser', async function(req, res, next) {
  const inputData = {
    first_name: req.body.firstData,
    last_name: req.body.lastData,
    address: req.body.address,
    pincode: req.body.pincode,
    locality: req.body.locality,
    town: req.body.town,
    state: req.body.state,
    phone: req.body.phone,
    email: req.body.emailData,
    password: req.body.passwordData
  };
  const existingUser = await Users.findOne({ $or: [{ email: inputData.email }, { phone: inputData.phone }] });
  if (existingUser) {
    // User already exists
    res.json({ success: false, message: 'User already exists.Please enter another username' });
  } else {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(inputData.password, saltRounds);
    inputData.password = hashedPassword;

    try {
      const userdata = await Users.insertMany([inputData]);
      if (userdata) {
        res.json({ success: true, redirectUrl: '/admin/users' });
      } else {
        res.json({ success: false, message: 'Registration failed' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
});

router.get('/editUser/:id',async (req,res) => {
  const userId = req.params.id;
  const selectUser = await Users.findById(userId);
  res.send(selectUser)
})

router.post('/editUser/:id', async (req, res) => {
  try {
    const userId = req.params.id;
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
          email: updates.emailData,
          phone: updates.phoneData,
        }
      },
      { new: true }
    );

    console.log("Edited Data:", editedData);

    if (editedData) {
      res.json({ success: true, redirectUrl: '/admin/users' });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Error editing user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.delete('/deleteUser/:id', async (req, res, next) => {
  try {
    const deletedDocument = await Users.findOneAndDelete({ _id: req.params.id });
    if (deletedDocument) {
      res.json({ success: true, redirectUrl: '/admin/users' });
    } else {
      console.log(`Document with ID ${req.params.id} not found`);
      res.status(404).json({ error: 'Document not found' });
    }
  } catch (error) {
    console.error(`Error deleting document with ID ${req.params.id}: ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/products', async (req, res) => {
  try {
    const products = await Products.find().timeout(30000);
    res.json(products);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/otherImages/:id', async (req, res) => {
  const productId = req.params.id;

  try {

    const product = await Products.findById(productId);
      return res.send(product);

  } catch (error) {
    console.error('Error fetching product data:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

router.get('/editProduct/:id', async (req, res) => {
  const productId = req.params.id;

  try {

    const productData = await Products.findById(productId);
    if (productData && productData._id.toString() === productId) {
      return res.send({ product: productData });
    }

    res.status(404).send({ error: 'Product not found' });
  } catch (error) {
    console.error('Error fetching product data:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

router.post('/editProduct/:id', async (req, res) => {
  const productId = req.params.id;
  const updatedData = req.body;

  try {

    const product = await Products.findByIdAndUpdate(productId, updatedData, { new: true });
    if (product) {
      return res.send({ product : product });
    }

    res.status(404).send({ error: 'Product not found' });
  } catch (error) {
    console.error('Error updating product data:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

router.delete('/deleteProduct/:id', async (req, res) => {
  const productId = req.params.id;

  try {

    const deletedProduct = await Products.findByIdAndDelete(productId);
    if (deletedProduct) {
      return res.send({ product: deletedProduct, message: 'Product deleted successfully' });
    }

    res.status(404).send({ error: 'Product not found' });
  } catch (error) {
    console.error('Error deleting product data:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/addProduct', upload.single('thumbnail'), async (req, res, next) => {
  const inputData = {
    title: req.body.title,
    brand: req.body.brand,
    description: req.body.description,
    category: req.body.category,
    discountPercentage: req.body.discountPercentage,
    price: req.body.price,
    stock: req.body.stock,
    images: [
      req.file ? req.file.buffer.toString('base64') : req.body.image1,
      req.file ? req.file.buffer.toString('base64') : req.body.image2,
      req.file ? req.file.buffer.toString('base64') : req.body.image3
    ],
    thumbnail: req.file ? req.file.buffer.toString('base64') : req.body.thumbnail,
  };

  try {
    const existingProduct = await Products.findOne({ title: inputData.title });
    if (existingProduct) {
      return res.json({ success: false, message: 'Product with the same title already exists' });
    }

    const newProduct = new Products(inputData);
    const savedProduct = await newProduct.save();

    if (savedProduct) {
      res.json({ success: true, message: 'Product added successfully' });
    } else {
      res.json({ success: false, message: 'Failed to add product' });
    }
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.post('/editImage/:productId/:index', async (req, res) => {
  const productId = req.params.productId;
  const index = req.params.index;
  const imageData = req.body.image; // Assuming you're sending the base64-encoded image data in the 'image' field

  // Example update logic (assuming you have a Product model)
  const product = await Products.findById(productId);
  
  if (product) {
    // Update the product.images array with the new base64-encoded image data
    product.images[index] = imageData;
    
    try {
      await product.save();
      res.json({ success: true, message: 'Image updated successfully' });
    } catch (error) {
      console.error('Error saving image:', error);
      res.json({ success: false, message: 'Failed to update image' });
    }
  } else {
    res.json({ success: false, message: 'Product not found' });
  }
});

router.post('/deleteImage/:productId/:index', async (req, res) => {
  const productId = req.params.productId;
  const index = req.params.index;

  try {
    const product = await Products.findById(productId);

    if (product) {
      product.images.splice(index, 1); // Remove the image at the specified index
      await product.save();
      res.json({ success: true, message: 'Image deleted successfully' });
    } else {
      res.json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    res.json({ success: false, message: 'Failed to delete image' });
  }
});

router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ _id: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Fetch user details from the database
    const user = await Users.findById(userId);

    if (user) {
      // Return user details
      res.status(200).json(user);
    } else {
      // User not found
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    // Handle errors
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update the product status within an order
router.put('/orders/:orderId/products/:productId', async (req, res) => {
  const { orderId, productId } = req.params;
  const { status } = req.body;

  try {
    // Find the order by ID
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Find the product within the order and update the status
    const product = order.products.id(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found within the order' });
    }

    product.status = status;

    // Save the updated order
    await order.save();

    // Send the updated order back
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/products/:productId', async (req, res) => {
  const productId = req.params.productId;

  try {
    const product = await Products.findById(productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
