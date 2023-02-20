const express = require("express");
const router = express.Router();

router.use("/api/users", require("./UserRoutes"));
router.use("/api/photos", require("./PhotosRoutes"));

//test route
router.get("/", (req, res) => {
  res.send("API working...");
});

module.exports = router;
