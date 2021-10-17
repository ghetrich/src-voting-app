const path = require("path");
const multer = require("multer");

var profileStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/images");
	},

	filename: function (req, file, cb) {
		let ext = path.extname(file.originalname);
		let originalname = path.parse(file.originalname).name;
		cb(null, Date.now() + "_" + originalname + ext);
	},
});
var uploadProfile = multer({
	storage: profileStorage,
	fileFilter: function (req, file, callback) {
		if (
			file.mimetype == "image/png" ||
			file.mimetype == "image/jpg" ||
			file.mimetype == "image/jpeg" ||
			file.mimetype == "image/webp"
		) {
			callback(null, true);
		} else {
			console.log("Image format not supported " + file.mimetype);
			callback(null, false);
		}
	},

	limits: {
		fileSize: 1024 * 1024 * 8,
	},
});

var bannersStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/banners");
	},

	filename: function (req, file, cb) {
		let ext = path.extname(file.originalname);
		let originalname = path.parse(file.originalname).name;
		cb(null, Date.now() + "_" + originalname + ext);
	},
});
var uploadBanner = multer({
	storage: bannersStorage,
	fileFilter: function (req, file, callback) {
		if (
			file.mimetype == "image/png" ||
			file.mimetype == "image/jpg" ||
			file.mimetype == "image/jpeg" ||
			file.mimetype == "image/webp"
		) {
			callback(null, true);
		} else {
			console.log("Image format not supported " + file.mimetype);
			callback(null, false);
		}
	},

	limits: {
		fileSize: 1024 * 1024 * 8,
	},
});

module.exports.uploadProfile = uploadProfile;
module.exports.uploadBanner = uploadBanner;