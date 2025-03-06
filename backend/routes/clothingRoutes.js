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
router.get("/:id", getClothingDetails);
router.get("/get-clothing", getAllClothingByUser);
router.put("/edit-clothing/:id", editClothing);
router.delete("/delete-clothing/:id", deleteClothing);

module.exports = router;
