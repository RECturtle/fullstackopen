const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
	const users = await User.find({}).populate("blogs", {
		url: 1,
		title: 1,
		author: 1,
	});
	response.json(users);
});

usersRouter.post("/", async (request, response) => {
	try {
		const { username, name, password } = request.body;

		if (username.length < 3 || password.length < 3) {
			return response
				.status(401)
				.json({
					error: "Username and password must be longer than 3 characters",
				});
		}

		const userCheck = await User.findOne({ username });
		if (userCheck) {
			return response
				.status(401)
				.json({ error: "Username must be unique" });
		}

		const saltRounds = 10;
		const passwordHash = await bcrypt.hash(password, saltRounds);

		const user = new User({
			username,
			name,
			passwordHash,
		});

		const savedUser = await user.save();

		response.status(201).json(savedUser);
	} catch (error) {
		response.status(401).json(error.message);
	}
});

module.exports = usersRouter;
