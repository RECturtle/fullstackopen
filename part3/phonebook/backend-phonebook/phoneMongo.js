const mongoose = require("mongoose")
require("dotenv").config()

if (process.argv.length < 3) {
	console.log(
		"Please provide the password as an argument: node mongo.js <password> <'contact-name'> <phonenumber>"
	)
	process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]
const extraArgCheck = process.argv[5] ? true : false

// extra arg checks - guide a user with most likely scenario why this occurred
if (extraArgCheck) {
	console.log(
		"Too many arguments provided, you should add quotes around a contact's name"
	)
	process.exit(1)
}

// needed args check
if (name && !number) {
	console.log(
		"Please provide a name and phonenumber to add a contact or no arguments to retrieve all contacts"
	)
	process.exit(1)
}

// build connection string
const front_url = process.env.DB_CONNECTION_STRING.slice(0, 26)
const back_url = process.env.DB_CONNECTION_STRING.slice(26)
const url = front_url + password + back_url

const contactSchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Contact = mongoose.model("Contact", contactSchema)

function retrieveContacts() {
	mongoose
		.connect(url)
		.then(() => {
			console.log("connected")

			console.log("Phonebook:")
			Contact.find({}).then((result) => {
				result.forEach((contact) => {
					console.log(`${contact.name} ${contact.number}`)
				})
				mongoose.connection.close()
			})
		})
		.catch((error) => console.log(error))
}

function createContact() {
	mongoose
		.connect(url)
		.then(() => {
			console.log("connected")

			const contact = new Contact({
				name: name,
				number,
			})

			return contact.save()
		})
		.then(() => {
			console.log("===========================================")
			console.log("contact saved!")
			console.log(`added ${name} ${number} to phonebook`)
			console.log("===========================================")
			return mongoose.connection.close()
		})
		.catch((error) => console.log(error))
}

// only password provided - retrieve users and exit
if (process.argv.length === 3) {
	retrieveContacts()
}

// create password if all args provided
if (process.argv.length === 5) {
	createContact()
}
