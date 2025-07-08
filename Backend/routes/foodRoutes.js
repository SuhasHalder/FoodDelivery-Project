const express = require("express");
const router = express.Router();
const foodController = require("../controllers/foodController");
const authController = require("../controllers/authController");

// router.post("/t foodController.createTour);
// router.get("/t foodController.getAllTours);

router
    .route("/")
    .post (foodController.createFood)
    .get (foodController.getAllFoods);

router
    .route("/:id")
    .get (foodController.getFoodById);

router
    .route("/:id")
    .get (foodController.getFoodById)
    .patch(authController.protect, authController.restrictTo("admin"), foodController.updateFood)
    .delete(foodController.deleteFood);
    
module.exports = router;