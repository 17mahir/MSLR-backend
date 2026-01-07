const Referendum = require("../models/Referendum");
const User = require("../models/User");



exports.getReferendums = async (req, res) => {
  try {
    const referendums = await Referendum.find().sort({ createdAt: -1 });
    res.json(referendums);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.vote = async (req, res) => {




  try {
    const referendumId = req.params.id;
    const { optionIndex } = req.body;

    // 1️⃣ Get referendum
    const referendum = await Referendum.findById(referendumId);
    if (!referendum) {
      return res.status(404).json({ message: "Referendum not found" });
    }

    // 2️⃣ Check referendum status
    if (referendum.status !== "open") {
      return res.status(400).json({ message: "Referendum is closed" });
    }

    // 3️⃣ Get voter
    const user = await User.findById(req.user.id);

    // 4️⃣ Ensure voter role
    if (user.role !== "voter") {
      return res.status(403).json({ message: "Only voters can vote" });
    }

    // 5️⃣ Check if already voted
    if (user.votedReferendums.includes(referendumId)) {
      return res.status(400).json({ message: "You have already voted" });
    }

    // 6️⃣ Validate option index
    if (
      optionIndex === undefined ||
      optionIndex < 0 ||
      optionIndex >= referendum.options.length
    ) {
      return res.status(400).json({ message: "Invalid option selected" });
    }

    // 7️⃣ Increment vote
    referendum.options[optionIndex].votes += 1;
    await referendum.save();

      // 🔒 Auto-close if 50% of voters choose one option
    const totalVoters = await User.countDocuments({ role: "voter" });
    const maxVotes = Math.max(...referendum.options.map(o => o.votes));

    if (maxVotes >= Math.ceil(totalVoters / 2)) {
        referendum.status = "closed";
        await referendum.save();
    }

    // 8️⃣ Save vote history
    user.votedReferendums.push(referendumId);
    await user.save();

    res.json({ message: "Vote cast successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
