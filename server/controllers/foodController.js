const Food= require("../models/Food");

exports.createFood = async (req , res) => {
  try{
    const newFood = await Food.create(req.body);
    res.status(200).json({
    status: "success",
    message: "Food  added Successfully",
    data: newFood,
  });
}
  catch(error){
    console.log(error);
    res.status(500).json(error);
  }
};

exports.getAllFoods = async(req ,res) =>{

  try{
    const foods = await Food.find();
    console.log(foods);
    res.status(200).json({
       status: "success",
    message: "Food fetched Successfully",
    data: foods,
    });
  }
  catch(error){
    console.log(error);
    res.status(500).json(error);
  }
};

exports.getFoodById = async (req, res) => {
  try{
    const food = await Food.findById(req.params.id);
    if(!food){
      return res.status(404).json({
        status:"error",
        message:"Food not found",
      });
      res.status(200).json({
        status: "success",
        message:"food  fetched Successfully",
        data: food,
      });
}
  }
catch(error){
      console.log(error);
      res.status(500).json(error);
    }
  };

  exports.updateFood= async (req,res) => {
    try {
        const food = await Food.findById(req.params.id, req.body);

        if(!food) {
            return res.status(404).json({
                status: "error",
                message: "food not found",
            });
        }

        res.status(200).json({
            status: "success",
            message: "food updated successfully",
            data: tour,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

exports.deleteFood= async (req,res) => {
    try {
        const food = await Food.findById(req.params.id);

        if(!food) {
            return res.status(404).json({
                status: "error",
                message: "Foor not found",
            });
        }

        res.status(200).json({
            status: "success",
            message: "Food  deleted successfully",
            data: food,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};