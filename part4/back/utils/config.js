require("dotenv").config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.DB_CONNECTION_STRING

module.exports = {
	MONGODB_URI,
	PORT,
}
