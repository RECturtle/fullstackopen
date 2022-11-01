require("dotenv").config()

const cors = require("cors")
const express = require("express")
const Note = require("./models/note")

const app = express()

app.use(express.static("build"))
app.use(express.json())
app.use(cors())

// Base notes
let notes = [
	{
		id: 1,
		content: "HTML is easy",
		date: "2022-05-30T17:30:31.098Z",
		important: true,
	},
	{
		id: 2,
		content: "Browser can execute only Javascript",
		date: "2022-05-30T18:39:34.091Z",
		important: false,
	},
	{
		id: 3,
		content: "GET and POST are the most important methods of HTTP protocol",
		date: "2022-05-30T19:20:14.298Z",
		important: true,
	},
]

// Generate a new id
const generateId = () => {
	const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0
	return maxId + 1
}

// GET - get homepage
app.get("/", (request, response) => {
	response.send("<h1>Hello, World!</h1>")
})

// GET - get all notes
app.get("/api/notes", (request, response) => {
	Note.find({}).then((notes) => {
		response.json(notes)
	})
})

// GET - get a note by :id
app.get("/api/notes/:id", (request, response) => {
	Note.findById(request.params.id).then((note) => {
		response.json(note)
	})
})

// POST - add a note
app.post("/api/notes", (request, response) => {
	const body = request.body

	if (body.content === undefined) {
		return response.status(400).json({ error: "content missing" })
	}

	const note = new Note({
		content: body.content,
		important: body.important || false,
		date: new Date(),
	})

	note.save().then((savedNote) => {
		response.json(savedNote)
	})
})

app.put("/api/notes/:id", (request, response) => {
	const body = request.body

	const note = {
		content: body.content,
		important: body.important,
	}

	Note.findByIdAndUpdate(request.params.id, note, { new: true })
		.then((updatedNote) => {
			response.json(updatedNote)
		})
		.catch((error) => console.log(error))
})

// DELETE - delete a note by :id
app.delete("/api/notes/:id", (request, response) => {
	Note.findByIdAndRemove(request.params.id)
		.then((result) => {
			response.status(204).end()
		})
		.catch((err) => console.log(err))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
