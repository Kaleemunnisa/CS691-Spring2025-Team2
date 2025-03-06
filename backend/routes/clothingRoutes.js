const express = require("express");
const {
    classifyClothingItem,
    getClothingDetails,
    getAllClothingByUser,
    editClothing,
    deleteClothing
} = require("../controllers/clothingController");

const router = express.Router();

router.post("/classify", classifyClothingItem);
router.get("/get-clothing", getAllClothingByUser);
router.get("/:id", getClothingDetails);
router.put("/edit-clothing/:id", editClothing);
router.delete("/delete-clothing/:id", deleteClothing);

module.exports = router;
