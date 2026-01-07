const Referendum = require("../models/Referendum");
const User = require("../models/User");


exports.createReferendum = async (req, res) => {
  try {
    const { title, description, options } = req.body;

    if (!title || !description || !options || options.length < 2) {
      return res
        .status(400)
        .json({ message: "Title, description and at least 2 options required" });
    }

    const formattedOptions = options.map(option => ({
      optionText: option,
      votes: 0
    }));

    const referendum = new Referendum({
      title,
      description,
      options: formattedOptions,
      status: "closed"
    });

    await referendum.save();
    res.status(201).json({ message: "Referendum created successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateReferendum = async (req, res) => {
  try {
    const referendum = await Referendum.findById(req.params.id);

    if (!referendum) {
      return res.status(404).json({ message: "Referendum not found" });
    }

    if (referendum.status === "open") {
      return res
        .status(400)
        .json({ message: "Cannot edit an open referendum" });
    }

    const { title, description, options } = req.body;

    if (title) referendum.title = title;
    if (description) referendum.description = description;
    if (options && options.length >= 2) {
      referendum.options = options.map(option => ({
        optionText: option,
        votes: 0
      }));
    }

    await referendum.save();
    res.json({ message: "Referendum updated successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.openReferendum = async (req, res) => {
  try {
    const referendum = await Referendum.findById(req.params.id);

    if (!referendum) {
      return res.status(404).json({ message: "Referendum not found" });
    }

    referendum.status = "open";
    await referendum.save();

    res.json({ message: "Referendum opened successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.closeReferendum = async (req, res) => {
  try {
    const referendum = await Referendum.findById(req.params.id);

    if (!referendum) {
      return res.status(404).json({ message: "Referendum not found" });
    }

    referendum.status = "closed";
    await referendum.save();

    res.json({ message: "Referendum closed successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllReferendums = async (req, res) => {
  try {
    const referendums = await Referendum.find().sort({ createdAt: -1 });
    res.json(referendums);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
