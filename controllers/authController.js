const User = require("../models/User");
const SCC = require("../models/SCC");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const isAdult = (dob) => {
  const birthDate = new Date(dob);
  const ageDifMs = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970) >= 18;
};

exports.register = async (req, res) => {
  try {
    const { email, fullName, dob, password, scc } = req.body;

    // 1️⃣ Check required fields
    if (!email || !fullName || !dob || !password || !scc) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2️⃣ Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already linked to a registered voter" });
    }

    // 3️⃣ Validate SCC
    const sccRecord = await SCC.findOne({ code: scc });
    if (!sccRecord) {
      return res
        .status(400)
        .json({ message: "Invalid Shangri-La Citizen Code" });
    }

    // 4️⃣ Check SCC already used
    if (sccRecord.used) {
      return res
        .status(400)
        .json({ message: "SCC has already been used" });
    }

    // 5️⃣ Age validation (18+)
    if (!isAdult(dob)) {
      return res
        .status(400)
        .json({ message: "Voter must be at least 18 years old" });
    }

    // 6️⃣ Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 7️⃣ Create user
    const user = new User({
      email,
      fullName,
      dob,
      password: hashedPassword,
      scc,
      role: "voter",
    });

    await user.save();

    // 8️⃣ Mark SCC as used
    sccRecord.used = true;
    await sccRecord.save();

    res.status(201).json({ message: "Registration successful" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid email or password" });
    }

    // 2️⃣ Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Invalid email or password" });
    }

    // 3️⃣ Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
      email: user.email,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
