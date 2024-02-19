var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const { Admin,Lights,Fragrances,Sunglasses,Automotives,WomensJewellery,WomensClothes,WomensWatches,WomensFootwear,Bags,MensClothes,MensFootwear,MensWatches,Grocery,Mobiles,Fashions,Electronics,HomeFurniture,Appliances,BeautyToys,TwoWheelers, Users } = require('../config/config');

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
    const users = await Users.find();
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
    phone: req.body.phone,
    email: req.body.emailData,
    password: req.body.passwordData
  };
  const existingUser = await Users.findOne({ email: inputData.email });
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
    const allProducts = {
      lights: await Lights.find(),
      fragrances: await Fragrances.find(),
      sunglasses: await Sunglasses.find(),
      automotives: await Automotives.find(),
      jewellery: await WomensJewellery.find(),
      womensWatches: await WomensWatches.find(),
      womensFootwear: await WomensFootwear.find(),
      womensClothes: await WomensClothes.find(),
      bags: await Bags.find(),
      mensWatches: await MensWatches.find(),
      mensFootwear: await MensFootwear.find(),
      mensClothes: await MensClothes.find(),
      groceries: await Grocery.find(),
      mobiles: await Mobiles.find(),
      fashions: await Fashions.find(),
      electronics: await Electronics.find(),
      homeFurniture: await HomeFurniture.find(),
      appliances: await Appliances.find(),
      beautyToys: await BeautyToys.find(),
      twoWheelers: await TwoWheelers.find(),
    };
    
    res.json(allProducts);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/editProduct/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    let productData;

    // Fetch data from Lights collection
    productData = await Lights.findById(productId);
    if (productData && productData._id.toString() === productId) {
      return res.send({ lights: productData });
    }

    // Fetch data from Fragrances collection
    productData = await Fragrances.findById(productId);
    if (productData && productData._id.toString() === productId) {
      return res.send({ fragrances: productData });
    }

    productData = await Sunglasses.findById(productId);
    if (productData && productData._id.toString() === productId) {
      return res.send({ fragrances: productData });
    }

    productData = await Automotives.findById(productId);
    if (productData && productData._id.toString() === productId) {
      return res.send({ fragrances: productData });
    }

    productData = await WomensJewellery.findById(productId);
    if (productData && productData._id.toString() === productId) {
      return res.send({ fragrances: productData });
    }

    productData = await WomensWatches.findById(productId);
    if (productData && productData._id.toString() === productId) {
      return res.send({ fragrances: productData });
    }

    productData = await WomensFootwear.findById(productId);
    if (productData && productData._id.toString() === productId) {
      return res.send({ fragrances: productData });
    }

    productData = await WomensClothes.findById(productId);
    if (productData && productData._id.toString() === productId) {
      return res.send({ fragrances: productData });
    }

    productData = await Bags.findById(productId);
    if (productData && productData._id.toString() === productId) {
      return res.send({ fragrances: productData });
    }

    productData = await MensWatches.findById(productId);
    if (productData && productData._id.toString() === productId) {
      return res.send({ fragrances: productData });
    }

    productData = await MensFootwear.findById(productId);
    if (productData && productData._id.toString() === productId) {
      return res.send({ fragrances: productData });
    }

    productData = await MensClothes.findById(productId);
    if (productData && productData._id.toString() === productId) {
      return res.send({ fragrances: productData });
    }

    productData = await Grocery.findById(productId);
    if (productData && productData._id.toString() === productId) {
      return res.send({ fragrances: productData });
    }

    productData = await Mobiles.findById(productId);
    if (productData && productData._id.toString() === productId) {
      return res.send({ fragrances: productData });
    }

    productData = await Fashions.findById(productId);
    if (productData && productData._id.toString() === productId) {
      return res.send({ fragrances: productData });
    }

    productData = await Electronics.findById(productId);
    if (productData && productData._id.toString() === productId) {
      return res.send({ fragrances: productData });
    }

    productData = await HomeFurniture.findById(productId);
    if (productData && productData._id.toString() === productId) {
      return res.send({ fragrances: productData });
    }

    productData = await Appliances.findById(productId);
    if (productData && productData._id.toString() === productId) {
      return res.send({ fragrances: productData });
    }

    productData = await BeautyToys.findById(productId);
    if (productData && productData._id.toString() === productId) {
      return res.send({ fragrances: productData });
    }

    productData = await TwoWheelers.findById(productId);
    if (productData && productData._id.toString() === productId) {
      return res.send({ fragrances: productData });
    }

    // Repeat the same pattern for other collections...

    // If no matching data found
    res.status(404).send({ error: 'Product not found' });
  } catch (error) {
    console.error('Error fetching product data:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

router.post('/editProduct/:id', async (req, res) => {
  const productId = req.params.id;
  const updatedData = req.body; // Assuming the updated data is sent in the request body

  try {
    let product;

    // Find and update data in Lights collection
    product = await Lights.findByIdAndUpdate(productId, updatedData, { new: true });
    if (product) {
      return res.send({ lights: product });
    }

    // Find and update data in Fragrances collection
    product = await Fragrances.findByIdAndUpdate(productId, updatedData, { new: true });
    if (product) {
      return res.send({ fragrances: product });
    }

    // Find and update data in Sunglasses collection
    product = await Sunglasses.findByIdAndUpdate(productId, updatedData, { new: true });
    if (product) {
      return res.send({ fragrances: product });
    }

    product = await Automotives.findByIdAndUpdate(productId, updatedData, { new: true });
    if (product) {
      return res.send({ automotives: product });
    }

    product = await WomensJewellery.findByIdAndUpdate(productId, updatedData, { new: true });
    if (product) {
      return res.send({ jewellery: product });
    }

    product = await WomensWatches.findByIdAndUpdate(productId, updatedData, { new: true });
    if (product) {
      return res.send({ Womenwatches: product });
    }

    product = await WomensFootwear.findByIdAndUpdate(productId, updatedData, { new: true });
    if (product) {
      return res.send({ Womenfootwear: product });
    }

    product = await WomensClothes.findByIdAndUpdate(productId, updatedData, { new: true });
    if (product) {
      return res.send({ Womenclothes: product });
    }

    product = await Bags.findByIdAndUpdate(productId, updatedData, { new: true });
    if (product) {
      return res.send({ bags: product });
    }

    product = await MensClothes.findByIdAndUpdate(productId, updatedData, { new: true });
    if (product) {
      return res.send({ Menclothes: product });
    }

    product = await MensWatches.findByIdAndUpdate(productId, updatedData, { new: true });
    if (product) {
      return res.send({ Menwatches: product });
    }

    product = await MensFootwear.findByIdAndUpdate(productId, updatedData, { new: true });
    if (product) {
      return res.send({ Mensfootwear: product });
    }

    product = await Grocery.findByIdAndUpdate(productId, updatedData, { new: true });
    if (product) {
      return res.send({ grocery: product });
    }

    product = await Mobiles.findByIdAndUpdate(productId, updatedData, { new: true });
    if (product) {
      return res.send({ mobiles: product });
    }

    product = await Fashions.findByIdAndUpdate(productId, updatedData, { new: true });
    if (product) {
      return res.send({ fashions: product });
    }

    product = await Electronics.findByIdAndUpdate(productId, updatedData, { new: true });
    if (product) {
      return res.send({ electronics: product });
    }

    product = await HomeFurniture.findByIdAndUpdate(productId, updatedData, { new: true });
    if (product) {
      return res.send({ homefurniture: product });
    }

    product = await Appliances.findByIdAndUpdate(productId, updatedData, { new: true });
    if (product) {
      return res.send({ appliances: product });
    }

    product = await  BeautyToys.findByIdAndUpdate(productId, updatedData, { new: true });
    if (product) {
      return res.send({ beautytoys: product });
    }

    product = await TwoWheelers.findByIdAndUpdate(productId, updatedData, { new: true });
    if (product) {
      return res.send({ twoWheelers: product });
    }

    // Repeat the same pattern for other collections...

    // If no matching data found
    res.status(404).send({ error: 'Product not found' });
  } catch (error) {
    console.error('Error updating product data:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

router.delete('/deleteProduct/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    let deletedProduct;

    // Delete data from Lights collection
    deletedProduct = await Lights.findByIdAndDelete(productId);
    if (deletedProduct) {
      return res.send({ lights: deletedProduct, message: 'Product deleted successfully' });
    }

    // Delete data from Fragrances collection
    deletedProduct = await Fragrances.findByIdAndDelete(productId);
    if (deletedProduct) {
      return res.send({ fragrances: deletedProduct, message: 'Product deleted successfully' });
    }

    // Delete data from Sunglasses collection
    deletedProduct = await Sunglasses.findByIdAndDelete(productId);
    if (deletedProduct) {
      return res.send({ sunglasses: deletedProduct, message: 'Product deleted successfully' });
    }

    deletedProduct = await Automotives.findByIdAndDelete(productId);
    if (deletedProduct) {
      return res.send({ sunglasses: deletedProduct, message: 'Product deleted successfully' });
    }

    deletedProduct = await WomensJewellery.findByIdAndDelete(productId);
    if (deletedProduct) {
      return res.send({ sunglasses: deletedProduct, message: 'Product deleted successfully' });
    }

    deletedProduct = await WomensWatches.findByIdAndDelete(productId);
    if (deletedProduct) {
      return res.send({ sunglasses: deletedProduct, message: 'Product deleted successfully' });
    }

    deletedProduct = await WomensFootwear.findByIdAndDelete(productId);
    if (deletedProduct) {
      return res.send({ sunglasses: deletedProduct, message: 'Product deleted successfully' });
    }

    deletedProduct = await WomensClothes.findByIdAndDelete(productId);
    if (deletedProduct) {
      return res.send({ sunglasses: deletedProduct, message: 'Product deleted successfully' });
    }

    deletedProduct = await Bags.findByIdAndDelete(productId);
    if (deletedProduct) {
      return res.send({ sunglasses: deletedProduct, message: 'Product deleted successfully' });
    }

    deletedProduct = await MensClothes.findByIdAndDelete(productId);
    if (deletedProduct) {
      return res.send({ sunglasses: deletedProduct, message: 'Product deleted successfully' });
    }

    deletedProduct = await MensWatches.findByIdAndDelete(productId);
    if (deletedProduct) {
      return res.send({ sunglasses: deletedProduct, message: 'Product deleted successfully' });
    }

    deletedProduct = await MensFootwear.findByIdAndDelete(productId);
    if (deletedProduct) {
      return res.send({ sunglasses: deletedProduct, message: 'Product deleted successfully' });
    }

    deletedProduct = await Grocery.findByIdAndDelete(productId);
    if (deletedProduct) {
      return res.send({ sunglasses: deletedProduct, message: 'Product deleted successfully' });
    }

    deletedProduct = await Mobiles.findByIdAndDelete(productId);
    if (deletedProduct) {
      return res.send({ sunglasses: deletedProduct, message: 'Product deleted successfully' });
    }

    deletedProduct = await Fashions.findByIdAndDelete(productId);
    if (deletedProduct) {
      return res.send({ sunglasses: deletedProduct, message: 'Product deleted successfully' });
    }

    deletedProduct = await Electronics.findByIdAndDelete(productId);
    if (deletedProduct) {
      return res.send({ sunglasses: deletedProduct, message: 'Product deleted successfully' });
    }

    deletedProduct = await HomeFurniture.findByIdAndDelete(productId);
    if (deletedProduct) {
      return res.send({ sunglasses: deletedProduct, message: 'Product deleted successfully' });
    }

    deletedProduct = await Appliances.findByIdAndDelete(productId);
    if (deletedProduct) {
      return res.send({ sunglasses: deletedProduct, message: 'Product deleted successfully' });
    }

    deletedProduct = await BeautyToys.findByIdAndDelete(productId);
    if (deletedProduct) {
      return res.send({ sunglasses: deletedProduct, message: 'Product deleted successfully' });
    }

    deletedProduct = await TwoWheelers.findByIdAndDelete(productId);
    if (deletedProduct) {
      return res.send({ sunglasses: deletedProduct, message: 'Product deleted successfully' });
    }

    // Repeat the same pattern for other collections...

    // If no matching data found
    res.status(404).send({ error: 'Product not found' });
  } catch (error) {
    console.error('Error deleting product data:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});


const multer = require('multer');
const upload = multer();

// Define the route for adding a product to the wishlist based on user input
router.post('/addProduct', upload.none(), async (req, res) => {
  try {
    const { category, title, brand, description, price, discountPercentage, stock } = req.body;

    // Validate user input
    if (!category || !title || !price || !stock) {
      return res.status(400).json({ error: 'Category, title, price, and stock are required' });
    }

    // Use a generic model based on the category
    const model = getModelByCategory(category);

    if (!model) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    // Construct product data without thumbnail
    const productData = {
      title,
      brand,
      description,
      category,
      price,
      discountPercentage: discountPercentage || 0,
      stock,
    };

    // Insert data into the specified collection
    const insertedData = await model.create(productData);

    res.json({ message: 'Product added successfully', insertedData });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// Implement a function to get the model based on category
function getModelByCategory(category) {
  // Add logic to map categories to the corresponding models
  // Replace 'YourModelForCategory' with the actual model for each category
  switch (category) {
    case 'Grocery':
      return Grocery; // Replace with your actual model
    case 'Mobiles':
      return Mobiles; // Replace with your actual model
    // Add more cases for other categories
    default:
      return null;
  }
}


module.exports = router;
