const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const Admin = require('../models/adminModel')


// register admin
const registerAdmin = asyncHandler(async (req, res) => {
  const { email,username, password } = req.body;
  if (!email || !password || !username) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  // if admin exists
  const adminExists = await Admin.findOne({ username });
  if (adminExists) {
    res.status(400);
    throw new Error('Admin already exists');
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create admin
  const admin = await Admin.create({
    username,
    email,
    password: hashedPassword,
  });

  if (admin) {
    
    // send response
    res.status(201).json({
      _id: admin.id,
      username: admin.username,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid admin data');
  }
});

// authenticate admin
const loginAdmin = asyncHandler(async (req, res) => {
	const { username, password } = req.body
  
	// Check for admin email
	const admin = await Admin.findOne({ username })
  
	if (admin && (await bcrypt.compare(password, admin.password))) {
	  res.json({
		_id: admin.id,
        username: admin.username,
        email: admin.email,
		token: generateToken(admin._id),
	  })
	} else {
	  res.status(400)
	  throw new Error('Invalid credentials')
	}
  })

// get current admin
const getMe =  asyncHandler(async (req, res) => {
	res.status(200).json(req.admin)
})

// generate jwt

const generateToken = (adminid) => {
	return jwt.sign({ adminid }, process.env.JWT_SEC, {
	  expiresIn: '5d',
	})
  }


module.exports = {
	registerAdmin,
	loginAdmin,
	getMe
}