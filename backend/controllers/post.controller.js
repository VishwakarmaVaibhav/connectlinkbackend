import cloudinary from "../lib/cloudinary.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";
import { sendCommentNotificationEmail } from "../emails/emailHandlers.js";
import User from "../models/user.model.js";


// Get posts for feed
export const getFeedPosts = async (req, res) => {
	try {
		// If guest, just return random posts
		if (!req.user) {
			const posts = await Post.aggregate([{ $sample: { size: 10 } }]);
			const populatedPosts = await Post.populate(posts, [
				{ path: "author", select: "name username profilePicture headline" },
				{ path: "comments.user", select: "name profilePicture" }
			]);
			return res.status(200).json(populatedPosts);
		}

		const connections = req.user.connections || [];

		// Get feed posts from connections + self
		const feedPosts = await Post.find({ author: { $in: [...connections, req.user._id] } })
			.populate("author", "name username profilePicture headline")
			.populate("comments.user", "name profilePicture")
			.sort({ createdAt: -1 });

		// If feed has fewer posts, fetch some random posts
		let additionalPosts = [];

		if (feedPosts.length < 10) {
			const excludeIds = [...feedPosts.map(p => p._id), req.user._id];
			additionalPosts = await Post.aggregate([
				{ $match: { author: { $nin: connections.concat([req.user._id]) } } },
				{ $sample: { size: 10 - feedPosts.length } }
			]);

			// Populate fields manually for aggregate posts
			additionalPosts = await Post.populate(additionalPosts, [
				{ path: "author", select: "name username profilePicture headline" },
				{ path: "comments.user", select: "name profilePicture" }
			]);
		}

		// Combine and return
		const allPosts = [...feedPosts, ...additionalPosts];

		// Optional: Sort combined posts by creation time again
		allPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

		res.status(200).json(allPosts);
	} catch (error) {
		console.error("Error in getFeedPosts controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};


// Create a post
export const createPost = async (req, res) => {
	try {
		const { content, images, projectLink } = req.body;
		let imageUrls = [];

		if (images && images.length > 0) {
			for (let image of images) {
				const uploadedImage = await cloudinary.uploader.upload(image, {
					resource_type: "auto",
				});
				imageUrls.push(uploadedImage.secure_url);
			}
		}

		const newPost = new Post({
			author: req.user._id,
			content,
			image: imageUrls, // Store array of images
			projectLink: projectLink || null,
		});

		await newPost.save();

		res.status(201).json(newPost);
	} catch (error) {
		console.error("Error in createPost controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// Delete a post
export const deletePost = async (req, res) => {
	try {
		const postId = req.params.id;
		const userId = req.user._id;

		const post = await Post.findById(postId);
		if (!post) return res.status(404).json({ message: "Post not found" });

		if (post.author.toString() !== userId.toString()) {
			return res.status(403).json({ message: "You are not authorized to delete this post" });
		}

		if (Array.isArray(post.image)) {
			for (let imgUrl of post.image) {
				const publicId = imgUrl.split("/").pop().split(".")[0];
				await cloudinary.uploader.destroy(publicId);
			}
		}


		await Post.findByIdAndDelete(postId);

		res.status(200).json({ message: "Post deleted successfully" });
	} catch (error) {
		console.error("Error in deletePost controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// Get post by ID
export const getPostById = async (req, res) => {
	try {
		const userId = req.user ? req.user._id : null; // Add this line

		const postId = req.params.id;
		const post = await Post.findById(postId)
			.populate("author", "name username profilePicture headline")
			.populate("comments.user", "name profilePicture username headline");

		if (!post) return res.status(404).json({ message: "Post not found" });

		// You can use userId below if needed for conditional logic
		// Example: const isOwner = post.author._id.toString() === userId?.toString();

		res.status(200).json(post);
	} catch (error) {
		console.error("Error in getPostById controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};


export const getPostsByUsername = async (req, res) => {
	try {
		const { username } = req.params;

		// Step 1: Find the user by username
		const user = await User.findOne({ username });
		if (!user) return res.status(404).json({ message: "User not found" });

		// Step 2: Fetch all posts by user
		const posts = await Post.find({ author: user._id })
			.populate("author", "name username profilePicture headline")
			.populate("comments.user", "name profilePicture username")
			.sort({ createdAt: -1 });

		res.status(200).json(posts);
	} catch (error) {
		console.error("Error in getPostsByUsername:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// Create a comment
export const createComment = async (req, res) => {
	try {
		const postId = req.params.id;
		const { content } = req.body;

		const post = await Post.findByIdAndUpdate(
			postId,
			{
				$push: { comments: { user: req.user._id, content } },
			},
			{ new: true }
		).populate("author", "name email username profilePicture headline");

		if (!post) return res.status(404).json({ message: "Post not found" });

		// Send notification
		if (post.author._id.toString() !== req.user._id.toString()) {
			const newNotification = new Notification({
				recipient: post.author,
				type: "comment",
				relatedUser: req.user._id,
				relatedPost: postId,
			});

			await newNotification.save();

			try {
				const postUrl = `${process.env.CLIENT_URL}/post/${postId}`;
				await sendCommentNotificationEmail(
					post.author.email,
					post.author.name,
					req.user.name,
					postUrl,
					content
				);
			} catch (emailErr) {
				console.error("Email sending failed:", emailErr);
			}
		}

		res.status(200).json(post);
	} catch (error) {
		console.error("Error in createComment controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// Like or Unlike a post
export const likePost = async (req, res) => {
	try {
		const postId = req.params.id;
		const userId = req.user._id;

		const post = await Post.findById(postId);
		if (!post) return res.status(404).json({ message: "Post not found" });

		if (post.likes.includes(userId)) {
			// Unlike
			post.likes = post.likes.filter(id => id.toString() !== userId.toString());
		} else {
			// Like
			post.likes.push(userId);

			if (post.author.toString() !== userId.toString()) {
				const newNotification = new Notification({
					recipient: post.author,
					type: "like",
					relatedUser: userId,
					relatedPost: postId,
				});
				await newNotification.save();
			}
		}

		await post.save();
		res.status(200).json(post);
	} catch (error) {
		console.error("Error in likePost controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// Share a post
export const sharePost = async (req, res) => {
	try {
		const postId = req.params.id;
		const userId = req.user._id;

		const post = await Post.findByIdAndUpdate(
			postId,
			{ $push: { shares: { user: userId } } },
			{ new: true }
		);

		if (!post) return res.status(404).json({ message: "Post not found" });

		res.status(200).json(post);
	} catch (error) {
		console.error("Error in sharePost controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};
