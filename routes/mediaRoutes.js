const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { uploadMedia, getMedia, deleteMedia } = require("../controllers/mediaController");
const upload = require("../middleware/upload");

router.post("/upload", auth, upload.single("file"), uploadMedia);
router.get("/", auth, getMedia);
router.delete("/:id", auth, deleteMedia);

module.exports = router;