const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
name : {
  type:String,
  required: true,
  unique:true,
},
price:{
  type:String,
},
description:{
  type:String,
  required:true,
},
image:{
  type:String,
},

})

module.exports = mongoose.model("Food",foodSchema);