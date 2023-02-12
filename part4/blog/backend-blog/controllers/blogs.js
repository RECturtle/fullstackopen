const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogRouter.get("/", async (request, response) => {
	const blogs = await Blog.find({});
	return response.json(blogs);
});

blogRouter.post("/", async (request, response) => {
	const body = request.body;
	const user = await User.findById(body.userId);
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

	const savedBlog = await blog.save();
	user.blogs = user.blogs.concat(savedBlog._id);
	await user.save();

	return response.status(201).json(savedBlog);
});

blogRouter.delete("/:id", async (request, response) => {
	await Blog.findByIdAndRemove(request.params.id);
	response.status(204).end();
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
