const Referendum = require("../models/Referendum");

exports.getReferendumsByStatus = async (req, res) => {
  try {
    const status = req.query.status;

    if (!status) {
      return res.status(400).json({ message: "Status query required" });
    }

    const referendums = await Referendum.find({ status });

    const response = {
      Referendums: referendums.map(ref => ({
        referendum_id: ref._id.toString(),
        status: ref.status,
        referendum_title: ref.title,
        referendum_desc: ref.description,
        referendum_options: {
          options: ref.options.map((opt, index) => ({
            [index + 1]: opt.optionText,
            votes: opt.votes.toString()
          }))
        }
      }))
    };

    res.json(response);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getReferendumById = async (req, res) => {
  try {
    const ref = await Referendum.findById(req.params.id);

    if (!ref) {
      return res.status(404).json({ message: "Referendum not found" });
    }

    const response = {
      referendum_id: ref._id.toString(),
      status: ref.status,
      referendum_title: ref.title,
      referendum_desc: ref.description,
      referendum_options: {
        options: ref.options.map((opt, index) => ({
          [index + 1]: opt.optionText,
          votes: opt.votes.toString()
        }))
      }
    };

    res.json(response);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
