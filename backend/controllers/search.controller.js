import User from "../models/user.model.js";
import Post from "../models/post.model.js";

export const searchUsers = async (req, res) => {
	try {
		const { query = "", type = "all" } = req.query;

		let users = [];
		let posts = [];

		if (type === "people" || type === "all") {
			const userFilter = {
				$or: [
					{ name: { $regex: query, $options: "i" } },
					{ username: { $regex: query, $options: "i" } },
					{ headline: { $regex: query, $options: "i" } },
				]
			};
			users = await User.find(userFilter)
				.select("name username profilePicture headline domain miniProjects")
				.limit(10);
		}

		if (type === "posts" || type === "all") {
			const postFilter = {
				content: { $regex: query, $options: "i" }
			};
			posts = await Post.find(postFilter)
				.populate("author", "name username profilePicture headline")
				.limit(10)
				.sort({ createdAt: -1 });
		}

		if (type === "people") {
			res.status(200).json(users); // Return array to match existing structure if simpler, or wrap
		} else if (type === "posts") {
			res.status(200).json(posts);
		} else {
			// For "all", we might need a unified structure or just return both. 
			// Existing frontend expects array of results. 
			// Let's return mixed array or modify frontend.
			// Returning mixed array of objects with 'type' field is best.
			const mixed = [
				...users.map(u => ({ ...u.toObject(), type: "user" })),
				...posts.map(p => ({ ...p.toObject(), type: "post" }))
			];
			res.status(200).json(mixed);
		}
	} catch (error) {
		console.error("Search error:", error);
		res.status(500).json({ message: "Search failed" });
	}
};
