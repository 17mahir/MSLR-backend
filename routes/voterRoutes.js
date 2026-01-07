const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  getReferendums,
  vote
} = require("../controllers/voterController");

// All voter routes require login
router.get("/referendums", authMiddleware, getReferendums);
router.post("/vote/:id", authMiddleware, vote);

module.exports = router;
