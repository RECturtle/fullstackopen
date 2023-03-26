const Blog = require("../models/blog");
const User = require("../models/user");

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
];

const initialUser = {
	username: "user",
	name: "user",
	password: "password",
};

const blogsInDb = async () => {
	const blogs = await Blog.find({});
	return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
	const users = await User.find({});
	return users.map((u) => u.toJSON());
};

module.exports = {
	initialBlogs,
	initialUser,
	blogsInDb,
	usersInDb,
};
