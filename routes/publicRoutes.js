const express = require("express");
const router = express.Router();

const {
  getReferendumsByStatus,
  getReferendumById
} = require("../controllers/publicController");

router.get("/referendums", getReferendumsByStatus);
router.get("/referendum/:id", getReferendumById);

module.exports = router;
