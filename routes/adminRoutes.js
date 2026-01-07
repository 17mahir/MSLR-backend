const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  createReferendum,
  updateReferendum,
  openReferendum,
  closeReferendum,
  getAllReferendums
} = require("../controllers/adminController");

// All admin routes require admin login
router.use(authMiddleware, adminMiddleware);

router.post("/referendums", createReferendum);
router.put("/referendums/:id", updateReferendum);
router.put("/referendums/:id/open", openReferendum);
router.put("/referendums/:id/close", closeReferendum);
router.get("/referendums", getAllReferendums);

module.exports = router;
