const mongoose = require("mongoose")

const url = process.env.DB_CONNECTION_STRING

console.log("connecting to", url)

mongoose
	.connect(url)
	.then(() => {
		console.log("connected to MongoDB")
	})
	.catch((error) => {
		console.log("error connecting to MongoDB:", error.message)
	})

const contactSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 3,
		required: true,
		unique: true
	},
	number: {
		type: String,
		minLength: 12,
		validate: {
			validator: function (v) {
				return /\d{3}-\d{3}-\d{4}/.test(v)
			},
			message: (props) => `${props.value} is not a valid phone number!`,
		},
		required: [true, "User phone number required"],
	},
})

contactSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	},
})

module.exports = mongoose.model("Contact", contactSchema)
