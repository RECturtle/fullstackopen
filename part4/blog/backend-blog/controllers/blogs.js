const blogRouter = require("express").Router()
const Blog = require("../models/blog")

blogRouter.get("/", async (request, response) => {
	const blogs = await Blog.find({})
	return response.json(blogs)
})

blogRouter.post("/", async (request, response) => {
	const blog = new Blog(request.body)
	if (blog.likes === undefined) {
		blog.likes = 0
	}

	if (blog.title === undefined || blog.url === undefined) {
		return response.status(400).end()
	}

	const savedBlog = await blog.save()
	return response.status(201).json(savedBlog)
})

module.exports = blogRouter
