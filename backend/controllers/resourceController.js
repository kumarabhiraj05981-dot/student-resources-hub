const Resource = require("../models/Resource");

// Upload Resource
exports.uploadResource = async (req, res) => {
  try {
    const { title, subject, semester, category } = req.body;

    const resource = await Resource.create({
      title,
      subject,
      semester,
      category,
      fileUrl: req.file.filename,
    });

    res.status(201).json({
      success: true,
      message: "Resource Uploaded Successfully",
      resource,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get All Resources
exports.getResources = async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });

    res.json(resources);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};