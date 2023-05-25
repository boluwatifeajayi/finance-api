const mongoose = require('mongoose');

const visualSchema = mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Admin'
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String,
  },
 
  
}, {
  timestamps: true
});

visualSchema.index({ createdAt: 1 });

module.exports = mongoose.model("Visual", visualSchema);
