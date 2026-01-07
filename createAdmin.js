const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");

    const email = "ec@referendum.gov.sr";
    const password = "Shangrilavote&2025@";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin
    const admin = new User({
      email,
      fullName: "Election Commission",
      password: hashedPassword,
      role: "admin"
    });

    await admin.save();
    console.log("Admin account created successfully");
    process.exit();

  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
