const express = require('express')
const router = express.Router()
const { 
	createVisual, 
	updateVisual, 
	deleteVisual, 
	getAllVisuals,
    getSingleVisual, 
} = require('../controllers/visualsController')

const {protect} = require('../middlewares/adminAuthMiddleware')


// routes
router.post('/create', protect, createVisual)
router.get('/all', getAllVisuals)
router.get('/:visualid', getSingleVisual);
router.put('/:id', protect, updateVisual)
router.delete('/:id', protect, deleteVisual)


  


module.exports = router