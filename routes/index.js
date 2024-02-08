var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt')
const  {Users,Grocery,Mobiles,Fashions, Electronics, HomeFurniture, Appliances, BeautyToys, TwoWheelers} = require('../config/config');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json('hi');
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

router.post('/signup', async function(req, res, next) {
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
        res.json({ success: true, redirectUrl: '/' });
      } else {
        res.json({ success: false, message: 'Registration failed' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
});

router.get('/groceries', async (req, res) => {
  try {
    const groceries = await Grocery.find();
    res.json(groceries);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/smartphones', async (req, res) => {
  try {
    const groceries = await Mobiles.find();
    res.json(groceries);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/fashions', async (req, res) => {
  try {
    const groceries = await Fashions.find();
    res.json(groceries);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/electronics', async (req, res) => {
  try {
    const groceries = await Electronics.find();
    res.json(groceries);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/furniture', async (req, res) => {
  try {
    const groceries = await HomeFurniture.find();
    res.json(groceries);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/appliances', async (req, res) => {
  try {
    const groceries = await Appliances.find();
    res.json(groceries);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/beautyToys', async (req, res) => {
  try {
    const groceries = await BeautyToys.find();
    res.json(groceries);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/two-wheelers', async (req, res) => {
  try {
    const groceries = await TwoWheelers.find();
    res.json(groceries);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
