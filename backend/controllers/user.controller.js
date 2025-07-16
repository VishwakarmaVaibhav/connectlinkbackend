import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import Post from "../models/post.model.js";

export const getSuggestedConnections = async (req, res) => {
	try {
		const currentUser = await User.findById(req.user._id).select("connections");

		// find users who are not already connected, and also do not recommend our own profile!! right?
		const suggestedUser = await User.find({
			_id: {
				$ne: req.user._id,
				$nin: currentUser.connections,
			},
		})
			.select("name username profilePicture headline")
			.limit(3);

		res.json(suggestedUser);
	} catch (error) {
		console.error("Error in getSuggestedConnections controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};
export const deleteProfile = async (req, res) => {
	try {
	  const user = await User.findByIdAndDelete(req.user._id);
  
	  if (!user) {
		return res.status(404).json({ message: "User not found" });
	  }
  
	  res.json({ message: "User profile deleted successfully" });
	} catch (error) {
	  console.error("Error deleting user profile:", error);
	  res.status(500).json({ message: "Error deleting profile" });
	}
  };
  

export const getPublicProfile = async (req, res) => {
	try {
		const user = await User.findOne({ username: req.params.username }).select("-password");

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json(user);
	} catch (error) {
		console.error("Error in getPublicProfile controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};
export const updateProfile = async (req, res) => {
	try {
		const allowedFields = [
			"name",
			"username",
			"headline",
			"about",
			"location",
			"profilePicture",
			"bannerImg",
			"skills",
			"experience",
			"education",
			"socialLinks", // ✅ Make sure this is present
			"miniProjects",
			"domain",
		];

		const updatedData = {};

		// Only copy fields that are defined (not undefined/null)
		for (const field of allowedFields) {
			if (req.body[field] !== undefined) {
				updatedData[field] = req.body[field];
			}
		}

		// Upload profilePicture if it's a base64 string
		if (req.body.profilePicture?.startsWith("data:image/")) {
			const result = await cloudinary.uploader.upload(req.body.profilePicture);
			updatedData.profilePicture = result.secure_url;
		}

		// Upload bannerImg if it's a base64 string
		if (req.body.bannerImg?.startsWith("data:image/")) {
			const result = await cloudinary.uploader.upload(req.body.bannerImg);
			updatedData.bannerImg = result.secure_url;
		}

		// DEBUG LOG (optional - can remove in production)
		console.log("Updating user with:", updatedData);

		const user = await User.findByIdAndUpdate(
			req.user._id,
			{ $set: updatedData },
			{ new: true }
		).select("-password");

		res.json(user);
	} catch (error) {
		console.error("❌ Error in updateProfile controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};
