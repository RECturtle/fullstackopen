/* eslint-disable no-unused-vars */
if (process.env.NODE_ENV !== "production") {
	require("dotenv").config()
}

const cors = require("cors")
const express = require("express")
const Note = require("./models/note")

const app = express()

app.use(cors())
app.use(express.static("build"))
app.use(express.json())

const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" })
	} else if (error.name === "ValidationError") {
		return response.status(400).send({ error: error.message })
	}

	next(error)
}

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" })
}

// GET - get homepage
app.get("/", (request, response) => {
	response.send("<h1>Hello, World!</h1>")
})

// GET - get all notes
app.get("/api/notes", (request, response, next) => {
	Note.find({})
		.then((notes) => {
			response.json(notes)
		})
		.catch((error) => next(error))
})

// GET - get a note by :id
app.get("/api/notes/:id", (request, response, next) => {
	Note.findById(request.params.id)
		.then((note) => {
			if (note) {
				response.json(note)
			} else {
				response.status(404).end()
			}
		})
		.catch((error) => next(error))
})

// POST - add a note
app.post("/api/notes", (request, response, next) => {
	const body = request.body

	const note = new Note({
		content: body.content,
		important: body.important || false,
		date: new Date(),
	})

	note
		.save()
		.then((savedNote) => {
			response.json(savedNote)
		})
		.catch((error) => next(error))
})

app.put("/api/notes/:id", (request, response, next) => {
	const { content, important } = request.body

	Note.findByIdAndUpdate(
		request.params.id,
		{ content, important },
		{ new: true, runValidators: true, context: "query" }
	)
		.then((updatedNote) => {
			response.json(updatedNote)
		})
		.catch((error) => next(error))
})

// DELETE - delete a note by :id
app.delete("/api/notes/:id", (request, response, next) => {
	Note.findByIdAndRemove(request.params.id)
		.then((result) => {
			response.status(204).end()
		})
		.catch((error) => next(error))
})

app.use(unknownEndpoint)
// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
