const s3Client = require("../config/s3");
const Media = require("../models/Media");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();
const uploadMedia = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });
    const key = `user-${req.user}/${Date.now()}_${file.originalname}`;
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    await s3Client.send(new PutObjectCommand(uploadParams));
    const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    const media = new Media({
      user: req.user,
      url: url,
      type: file.mimetype.startsWith("image") ? "image" : "video",
    });
    await media.save();
    res.status(201).json(media);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getMedia = async (req, res) => {
  try {
    const { type, page = 1, limit = 10 } = req.query;
    console.log('User ID from token:', req.user);
    console.log('Query params:', { type, page, limit });
    const query = { user: req.user };
    if (type) query.type = type;
    const media = await Media.find(query)
      .skip((page - 1) * limit)
      .limit(limit);
    console.log('Found media:', media);
    res.json(media);
  } catch (err) {
    console.error('Get media error:', err);
    res.status(500).json({ error: err.message });
  }
};
const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    const key = media.url.split("/").slice(3).join("/");
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
      })
    );
    res.json({ msg: "Media deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  uploadMedia,
  getMedia,
  deleteMedia,
};
