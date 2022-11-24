require("dotenv").config()
const Contact = require("./models/contact")
const express = require("express")
const morgan = require("morgan")

const app = express()

morgan.token("data", function (req, res) {
	return JSON.stringify(req.body)
})

app.use(express.static("build"))
app.use(express.json())
app.use(
	morgan(":method :url :status :res[content-length] - :response-time ms :data")
)

let persons = [
	{
		id: 1,
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: 2,
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: 3,
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: 4,
		name: "Mary Poppendieck",
		number: "39-23-6423122",
	},
]

const validityChecks = (body) => {
	if (!body.name) {
		return [false, "content missing - no name included"]
	}

	if (!body.number) {
		return [false, "content missing - no number included"]
	}

	if (typeof body.name !== "string") {
		return [false, "invalid data - name must be a string"]
	}

	if (typeof body.number !== "string") {
		return [false, "invalid data - number must be a string"]
	}

	const newStrippedNumber = body.number.replace(/\D/g, "")
	if (newStrippedNumber.length === 0) {
		return [false, "invalid data - phonenumber must include numbers"]
	}

	// Removed duplicate checks since the frontend will ask if the user if they
	// would like to update the contact and then route the request to the correct
	// endpoint (either stop and don't add/update or update the contact)

	return [true, ""]
}

// GET - get homepage
app.get("/", (request, response) => {
	response.send("<h1>Phonebook</h1>")
})

// GET - get all contacts
app.get("/api/persons", (request, response) => {
	Contact.find({}).then((contacts) => {
		response.json(contacts)
	})
})

// GET - get info page
app.get("/info", (request, response) => {
	Contact.countDocuments({}, function (err, count) {
		const htmlResponse = `<p>Phonebook has info for ${count} people</p><p>${new Date()}`

		response.send(htmlResponse)
	})
})

// GET - get a person by :id
app.get("/api/persons/:id", (request, response) => {
	Contact.findById(request.params.id).then((contact) => {
		response.json(contact)
	})
})

// POST - create a new person contact
app.post("/api/persons", (request, response) => {
	const body = request.body

	// run validity checks
	const [valid, msg] = validityChecks(body)

	if (!valid) {
		return response.status(400).json({
			error: msg,
		})
	}

	const contact = new Contact({
		name: body.name,
		number: body.number,
	})

	contact.save().then((savedContact) => {
		response.json(savedContact)
	})
})

// PUT - update a person by :id
app.put("/api/persons/:id", (request, response) => {
	const body = request.body

	// run validity checks
	const [valid, msg] = validityChecks(body)

	if (!valid) {
		return response.status(400).json({
			error: msg,
		})
	}

	const contact = {
		name: body.name,
		number: body.number,
	}

	Contact.findByIdAndUpdate(request.params.id, contact, { new: true })
		.then((updatedContact) => {
			response.json(updatedContact)
		})
		.catch((error) => console.log(error))
})

// DELETE - delete a person by :id
app.delete("/api/persons/:id", (request, response) => {
	Contact.findByIdAndRemove(request.params.id)
		.then((result) => {
			response.status(204).end()
		})
		.catch((err) => console.log(err))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
