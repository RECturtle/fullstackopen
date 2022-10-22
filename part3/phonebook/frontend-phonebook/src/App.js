import { useEffect, useState } from "react"
import Filter from "./components/Filter"
import Notification from "./components/Notification"
import Persons from "./components/Persons"
import PersonForm from "./components/PersonForm"
import contactService from "./services/contacts"

const App = () => {
	const [persons, setPersons] = useState([])
	const [newName, setNewName] = useState("")
	const [newPhone, setNewPhone] = useState("")
	const [newSearch, setSearch] = useState("")
	const [filterResults, setNewResults] = useState([])
	const [message, setMessage] = useState(null)
	const [messageType, setMessageType] = useState("")

	useEffect(() => {
		contactService.getPersons().then((initialContacts) => {
			setPersons(initialContacts)
		})
	}, [])

	const addPerson = async (e) => {
		e.preventDefault()
		const newPerson = {
			name: newName,
			number: newPhone,
		}

		// Check if the name already exists
		const [matchedName] = persons.filter(
			(person) => person.name.toLowerCase() === newName.toLowerCase()
		)

		if (matchedName) {
			if (
				window.confirm(`Would you like to update ${newPerson.name}'s number?`)
			) {
				try {
					const contact = await contactService.updateContact(
						newPerson,
						matchedName.id
					)
					setPersons(
						persons.map((person) =>
							person.id !== contact.id ? person : contact
						)
					)
					banner(`Updated ${newPerson.name}'s number`, "success")
				} catch (e) {
					banner(`${newPerson.name} has already been removed from the server`, "error")
					console.log("error:", e)
					await refreshList()
				}
				clearFields()
				return
			}
			return
		}

		// Check if newPerson's number already exists.
		// If it does, ask if the user wants to update
		// If updated, return and display message
		if (await updatedPerson(newPerson)) {
			return
		}

		// If name and number isn't present, create a new person
		contactService.create(newPerson).then((returnedContact) => {
			setPersons(persons.concat(returnedContact))
			clearFields()
			banner(`Added ${newPerson.name}`, "success")
		})
	}

	const updatedPerson = async (newPerson) => {
		const newStrippedNumber = newPerson.number.replace(/\D/g, "")
		const [sameNumberPerson] = persons.filter((person) => {
			const strippedNumber = person.number.replace(/\D/g, "")
			return strippedNumber === newStrippedNumber
		})

		// no matching numbers
		if (!sameNumberPerson) {
			return false
		}

		if (
			window.confirm(
				`Update ${sameNumberPerson.name}'s name to ${newPerson.name}?`
			)
		) {
			try {
				const updatedContact = await contactService.updateContact(
					newPerson,
					sameNumberPerson.id
				)

				setPersons(
					persons.map((person) =>
						person.id !== updatedContact.id ? person : updatedContact
					)
				)
				banner(
					`Updated ${newPerson.number}'s contact name to ${newPerson.name}`, "success"
				)
			} catch (e) {
				banner(`${newPerson.name} has already been removed from the server`, "error")
				await refreshList()
			}
			// clear name and phone entries if they confirm they'd like to update
			clearFields()
		}
		return true
	}

	const deleteContact = async (id) => {
		if (await contactService.deleteContact(id)) {
			await refreshList()
		}
	}

	const updateFilter = (e) => {
		e.preventDefault()
		const results = persons.filter((person) =>
			person.name.toLowerCase().includes(newSearch.toLowerCase())
		)

		if (results.length === 0) {
			alert("No results found")
			return
		}
		setNewResults(results)
	}

	const banner = (msg, msgType) => {
		setMessageType(msgType)
		setMessage(msg)
		setTimeout(() => {
			setMessage(null)
			setMessageType("")
		}, 5000)
	}

	const clearFields = () => {
		setNewName("")
		setNewPhone("")
	}

	const clearFilter = () => {
		setNewResults([])
		setSearch("")
	}

	const refreshList = async () => {
		await contactService.getPersons().then((initialContacts) => {
			setPersons(initialContacts)
		})
	}

	const handleNameChange = (e) => {
		setNewName(e.target.value)
	}

	const handlePhoneChange = (e) => {
		setNewPhone(e.target.value)
	}

	const handleSearchChange = (e) => {
		setSearch(e.target.value)
	}

	return (
		<div>
			<h2>Phonebook</h2>
			<Notification message={message} messageType={messageType} />
			<Filter
				updateFilter={updateFilter}
				handleSearchChange={handleSearchChange}
				newSearch={newSearch}
				clearFilter={clearFilter}
			/>
			<h2>Add a new Number</h2>
			<PersonForm
				addPerson={addPerson}
				handleNameChange={handleNameChange}
				handlePhoneChange={handlePhoneChange}
				newName={newName}
				newPhone={newPhone}
			/>
			<h2>Numbers</h2>
			<Persons
				persons={persons}
				deleteContact={deleteContact}
				filterResults={filterResults}
			/>
		</div>
	)
}

export default App
