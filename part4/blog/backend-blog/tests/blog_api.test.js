const mongoose = require("mongoose")
const supertest = require("supertest")
const { response } = require("../app")
const app = require("../app")
const api = supertest(app)
const Blog = require("../models/blog")

const initialBlogs = [
	{
		title: "HTML is easy",
		author: "John Internet",
		url: "test.com",
		likes: 50,
	},
	{
		title: "Moby Dick",
		author: "Mr. Moby Dick",
		url: "mobydick.com",
		likes: 40,
	},
]

beforeEach(async () => {
	await Blog.deleteMany({})
	let blogObject = new Blog(initialBlogs[0])
	await blogObject.save()
	blogObject = new Blog(initialBlogs[1])
	await blogObject.save()
})

test("blogs are returned as json", async () => {
	await api
		.get("/api/blogs")
		.expect(200)
		.expect("Content-Type", /application\/json/)
})

test("there are two blogs returned", async () => {
	const response = await api.get("/api/blogs")
	expect(response.body).toHaveLength(2)
})

test("there is an id field returned", async () => {
	const response = await api.get("/api/blogs")
	expect(response.body[0].id).toBeDefined()
})

test("a new blog gets added successfully", async () => {
	const newBlog = {
		title: "Holy Moly",
		author: "Guacamole",
		url: "google.com",
		likes: 10,
	}

	// receive a successful response
	const response = await api.post("/api/blogs").send(newBlog).expect(201)

	// response contains title
	expect(response.body.title).toBe("Holy Moly")

	// one more blog in db
	const responseCount = await api.get("/api/blogs")
	expect(responseCount.body).toHaveLength(3)

	// responses contain new blog
	const blogs = responseCount.body.map((b) => b.title)
	expect(blogs).toContain("Holy Moly")
})

test("a new blog excluding the likes field will return 0", async () => {
	const newBlog = {
		title: "Where are my likes?",
		author: "Who Knows",
		url: "nolikes.com",
	}

	const response = await api.post("/api/blogs").send(newBlog).expect(201)

	expect(response.body.likes).toBe(0)
})

test("a new blog requires a title and url", async () => {
	const noTitleBlog = {
		author: "tester mcGee",
		url: "google.com",
		likes: 10,
	}

	const noUrlBlog = {
		author: "tester mcGee",
		title: "Testing in Space",
		likes: 100,
	}

	await api.post("/api/blogs").send(noTitleBlog).expect(400)

	await api.post("/api/blogs").send(noUrlBlog).expect(400)
})

test("succeeds with status code 204 if id is valid", async () => {
	const response = await api.get("/api/blogs")
    const blogToDelete = response.body[0]

	await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

	const remainingBlogs = await api.get("/api/blogs")

	expect(remainingBlogs.body).toHaveLength(1)

	const blogTitles = remainingBlogs.body.map((b) => b.title)

	expect(blogTitles).not.toContain(blogToDelete.title)
})

test("successfully update notes", async () => {
    const response = await api.get("/api/blogs")
    const blogToUpdate = response.body[0]
    blogToUpdate.likes = 10000

    const updatedBlog = await api.put(`/api/blogs/${blogToUpdate.id}`).send(blogToUpdate)

    expect(updatedBlog.body.likes).toBe(10000)
})

afterAll(async () => {
	await mongoose.connection.close()
})
