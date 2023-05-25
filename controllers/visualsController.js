const asyncHandler = require('express-async-handler')
const Visual = require('../models/visualsModel')
const Admin = require('../models/adminModel')

//@desc create visuals
const createVisual = asyncHandler(async (req, res) => {
	const { adminid } = res.locals.decoded;
	const {...docData } = req.body;
  
	const currentAdmin = await Admin.findById(adminid);
	const { _id: adminId, username } = currentAdmin;
  
	const newVisual = await Visual.create({
	  ...docData,
	  theAdmin: { adminId, username },
	  admin: req.admin.id,
	});
  
	res.status(201).json(newVisual);
  });
  
  
//@desc update objects

const  updateVisual = asyncHandler(async (req, res) => {

	const visual = await Visual.findById(req.params.id)

	if(!visual) {
		res.status(400)
		throw new Error('Object not found')
	}

	const admin = await Admin.findById(req.admin.id)

	if(!admin){
		res.status(401)
		throw new Error('admin not found')
	}

	// Make sure the logged in admin matches the journal admin
	if (visual.admin.toString() !== req.admin.id) {
		res.status(401)
		throw new Error('admin not authorized')
	  }

	const updatedVisual = await Visual.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
	}) 

	res.status(200).json(updatedVisual)
})

const getAllVisuals = async (req, res) => {
	try {
	  const allVisuals = await Visual.find().sort({ updatedAt: -1 });
	  res.status(200).json(allVisuals);
	} catch (error) {
	  res.status(404).json({ error: "no visuals available" });
	}
  };

const getSingleVisual = async (req, res) => {
	try { 
	  const { visualid } = req.params;
	  const currentVisual = await Visual.findById(visualid);
	  res.status(200).json(currentVisual);
	} catch (error) {
	  res.status(404).json({ error: error.message });
	}
  };

//@desc delete object

const  deleteVisual = asyncHandler(async (req, res) => {
	const visual = await Visual.findById(req.params.id)
	if(!visual){
		res.status(400)
		throw new Error('Journal not found')
	}

	const admin = await Admin.findById(req.admin.id)

	if(!admin){
		res.status(401)
		throw new Error('Admin not found')
	}

	// Make sure the logged in admin matches the journal admin
	if (visual.Admin.toString() !== req.admin.id) {
		res.status(401)
		throw new Error('Admin not authorized')
	  }

	await visual.remove()

	res.status(200).json({message: `deleted goals ${req.params.id}`})
})


  
  
  

module.exports = {
	createVisual,
	updateVisual,
	deleteVisual,
	getAllVisuals,
	getSingleVisual,
}