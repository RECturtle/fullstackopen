const mongoose = require("mongoose");
const supertest = require("supertest");
const { response } = require("../app");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");
const helper = require("./blog_test_utils");

beforeEach(async () => {
	await Blog.deleteMany({});
	await Blog.insertMany(helper.initialBlogs);
	await User.deleteMany({});
});

test("blogs are returned as json", async () => {
	await api
		.get("/api/blogs")
		.expect(200)
		.expect("Content-Type", /application\/json/);
});

test("there are two blogs returned", async () => {
	const response = await api.get("/api/blogs");
	expect(response.body).toHaveLength(2);
});

test("there is an id field returned", async () => {
	const response = await api.get("/api/blogs");
	expect(response.body[0].id).toBeDefined();
});

test("a new blog without a token fails", async () => {
	const newBlog = {
		title: "Holy Moly",
		author: "Guacamole",
		url: "google.com",
		likes: 10,
	};

	await api.post("/api/blogs").send(newBlog).expect(401);
});

test("a new blog gets added successfully", async () => {
	await api.post("/api/users").send(helper.initialUser);
	const user = {
		username: "user",
		password: "password",
	};

	const userLogin = await api.post("/api/login").send(user);

	const newBlog = {
		title: "Holy Moly",
		author: "Guacamole",
		url: "google.com",
		likes: 10,
	};

	// receive a successful response
	const response = await api
		.post("/api/blogs")
		.set("Authorization", `Bearer ${userLogin.body.token}`)
		.send(newBlog)
		.expect(201);

	// response contains title
	expect(response.body.title).toBe("Holy Moly");

	// one more blog in db
	const responseCount = await api.get("/api/blogs");
	expect(responseCount.body).toHaveLength(3);

	// responses contain new blog
	const blogs = responseCount.body.map((b) => b.title);
	expect(blogs).toContain("Holy Moly");
});

test("a new blog excluding the likes field will return 0", async () => {
	const newBlog = {
		title: "Where are my likes?",
		author: "Who Knows",
		url: "nolikes.com",
	};

	const response = await api.post("/api/blogs").send(newBlog).expect(201);

	expect(response.body.likes).toBe(0);
});

test("a new blog requires a title and url", async () => {
	const noTitleBlog = {
		author: "tester mcGee",
		url: "google.com",
		likes: 10,
	};

	const noUrlBlog = {
		author: "tester mcGee",
		title: "Testing in Space",
		likes: 100,
	};

	await api.post("/api/blogs").send(noTitleBlog).expect(400);

	await api.post("/api/blogs").send(noUrlBlog).expect(400);
});

test("succeeds with status code 204 if id is valid", async () => {
	const response = await api.get("/api/blogs");
	const blogToDelete = response.body[0];

	await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

	const remainingBlogs = await api.get("/api/blogs");

	expect(remainingBlogs.body).toHaveLength(1);

	const blogTitles = remainingBlogs.body.map((b) => b.title);

	expect(blogTitles).not.toContain(blogToDelete.title);
});

test("successfully update blogs", async () => {
	const response = await api.get("/api/blogs");
	const blogToUpdate = response.body[0];
	blogToUpdate.likes = 10000;

	const updatedBlog = await api
		.put(`/api/blogs/${blogToUpdate.id}`)
		.send(blogToUpdate);

	expect(updatedBlog.body.likes).toBe(10000);
});

describe("Testing the users", () => {
	test("username must be longer than 3", async () => {
		const usersAtStart = await helper.usersInDb();
		const newUser = {
			username: "fai",
			name: "Failure",
			password: "aTestFailure",
		};

		api.post("/api/user").send(newUser).expect(401);
		const usersAtEnd = await helper.usersInDb();
		expect(usersAtEnd).toHaveLength(usersAtStart.length);
	});

	test("Password must be longer than 3", async () => {
		const usersAtStart = await helper.usersInDb();
		const newUser = {
			username: "failure",
			name: "Failure",
			password: "fai",
		};

		api.post("/api/user").send(newUser).expect(401);
		const usersAtEnd = await helper.usersInDb();
		expect(usersAtEnd).toHaveLength(usersAtStart.length);
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});
