require("dotenv").config()
const Contact = require("./models/contact")
const express = require("express")
const morgan = require("morgan")

const app = express()

morgan.token("data", function (req) {
	return JSON.stringify(req.body)
})

app.use(express.static("build"))
app.use(express.json())
app.use(
	morgan(":method :url :status :res[content-length] - :response-time ms :data")
)

const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" })
	} else if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message })
	}

	next(error)
}

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" })
}

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
app.get("/api/persons", (request, response, next) => {
	Contact.find({})
		.then((contacts) => {
			response.json(contacts)
		})
		.catch((error) => {
			next(error)
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
app.get("/api/persons/:id", (request, response, next) => {
	Contact.findById(request.params.id)
		.then((contact) => {
			response.json(contact)
		})
		.catch((error) => next(error))
})

// POST - create a new person contact
app.post("/api/persons", (request, response, next) => {
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

	contact
		.save()
		.then((savedContact) => {
			response.json(savedContact)
		})
		.catch((error) => next(error))
})

// PUT - update a person by :id
app.put("/api/persons/:id", (request, response, next) => {
	const body = request.body
	const { name, number } = request.body

	// run validity checks
	const [valid, msg] = validityChecks(body)

	if (!valid) {
		return response.status(400).json({
			error: msg,
		})
	}

	Contact.findByIdAndUpdate(
		request.params.id,
		{ name, number },
		{ new: true, runValidators: true, context: "query" }
	)
		.then((updatedContact) => {
			response.json(updatedContact)
		})
		.catch((error) => next(error))
})

// DELETE - delete a person by :id
app.delete("/api/persons/:id", (request, response) => {
	Contact.findByIdAndRemove(request.params.id)
		.then(() => {
			response.status(204).end()
		})
		.catch((err) => console.log(err))
})

app.use(unknownEndpoint)
// this has to be the last loaded middleware.
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})