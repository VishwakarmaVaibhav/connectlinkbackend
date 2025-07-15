import User from "../models/user.model.js";

export const searchUsers = async (req, res) => {
	try {
		const { query = "", domain, project } = req.query;

		let filter = {};

		if (query) {
			filter.$or = [
				{ name: { $regex: query, $options: "i" } },
				{ username: { $regex: query, $options: "i" } },
				{ headline: { $regex: query, $options: "i" } },
				
			];
		}

		if (domain) {
			filter.domain = { $regex: domain, $options: "i" };
		}

		if (project) {
			filter["miniProjects.title"] = { $regex: project, $options: "i" };
		}

		const users = await User.find(filter)
			.select("name username profilePicture headline domain miniProjects")
			.limit(20);

		res.status(200).json({ success: true, users });
	} catch (error) {
		console.error("Search error:", error);
		res.status(500).json({ success: false, message: "Search failed" });
	}
};
