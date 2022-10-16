const express = require("express")
const app = express()
app.use(express.json())

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

// Generate a new id
const generateId = () => {
	const ids = persons.map((person) => person.id)
	let id = 0

	// ensure we don't return an existing id
	while (id === 0 || ids.includes(id)) {
		id = Math.floor(Math.random() * 1_000_000_000)
	}

	return id
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

	if (
		persons.some(
			(person) => person.name.toLowerCase() === body.name.toLowerCase()
		)
	) {
		return [
			false,
			"duplicate found - a person with that name is already present",
		]
	}

	const numberPresent = persons.some((person) => {
		const existingStrippedNumber = person.number.replace(/\D/g, "")
		return existingStrippedNumber === newStrippedNumber
	})

	if (numberPresent) {
		return [
			false,
			"duplicate found - a person with that number is already present",
		]
	}

	return [true, ""]
}

// GET - get homepage
app.get("/", (request, response) => {
	response.send("<h1>Phonebook</h1>")
})

// GET - get all contacts
app.get("/api/persons", (request, response) => {
	response.json(persons)
})

// GET - get info page
app.get("/info", (request, response) => {
	const htmlResponse = `<p>Phonebook has info for ${
		persons.length
	} people</p><p>${new Date()}`
	response.send(htmlResponse)
})

// GET - get a person by :id
app.get("/api/persons/:id", (request, response) => {
	const id = Number(request.params.id)
	const person = persons.find((person) => person.id === id)

	// person found
	if (person) {
		response.json(person)
	}

	response.status(404).send("No person found with that id")
})

// POST - create a new person contact
app.post("/api/persons", (request, response) => {
	const body = request.body

	// run present and valid checks
	const [valid, msg] = validityChecks(body)

	if (!valid) {
		return response.status(400).json({
			error: msg,
		})
	}

	const person = {
		id: generateId(),
		name: body.name,
		number: body.number,
	}

	persons = persons.concat(person)
	response.json(person)
})

// DELETE - delete a person by :id
app.delete("/api/persons/:id", (request, response) => {
	const id = Number(request.params.id)
	persons = persons.filter((person) => person.id !== id)

	response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
	console.log(`Server running on ${PORT}`)
})
