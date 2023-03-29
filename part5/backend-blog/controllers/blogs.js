const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const decodeJWTToken = (request) => {
	const decodedToken = jwt.verify(request.token, process.env.SECRET);
	if (!decodedToken.id) {
		return false;
	}
	return decodedToken;
};

blogRouter.get("/", async (request, response) => {
	const blogs = await Blog.find({}).populate("user", {
		username: 1,
		name: 1,
	});
	return response.json(blogs);
});

blogRouter.post("/", async (request, response) => {
	const body = request.body;
	const decodedToken = decodeJWTToken(request);
	if (!decodedToken) {
		return response.status(401).json({ error: "token invalid" });
	}

	const user = await User.findById(decodedToken.id);
	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes,
		user: user.id,
	});

	if (blog.likes === undefined) {
		blog.likes = 0;
	}

	if (blog.title === undefined || blog.url === undefined) {
		return response.status(400).end();
	}

	if (blog.title.length < 5 || blog.author.length < 3 || blog.url.length < 3) {
		return response.status(400).end();
	}

	const savedBlog = await blog.save();
	user.blogs = user.blogs.concat(savedBlog._id);
	await user.save();

	return response.status(201).json(savedBlog);
});

blogRouter.delete("/:id", async (request, response) => {
	const decodedToken = decodeJWTToken(request);
	if (!decodedToken) {
		return response.status(401).json({ error: "token invalid" });
	}

	const user = await User.findById(decodedToken.id);
	const blog = await Blog.findById(request.params.id);

	if (blog.user.toString() === user.id.toString()) {
		await Blog.findByIdAndRemove(request.params.id);
		return response.status(204).end();
	} else {
		return response
			.status(401)
			.json({ error: "Cannot delete another user's post" });
	}
});

blogRouter.put("/:id", async (request, response) => {
	try {
		const body = request.body;
		const blog = {
			title: body.title,
			author: body.author,
			url: body.url,
			likes: body.likes,
		};

		const updatedBlog = await Blog.findByIdAndUpdate(
			request.params.id,
			blog,
			{ new: true }
		);
		response.json(updatedBlog);
	} catch (exception) {
		return exception;
	}
});

module.exports = blogRouter;
