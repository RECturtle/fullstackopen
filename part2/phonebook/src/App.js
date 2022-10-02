import { useEffect, useState } from "react"
import Filter from "./components/Filter"
import Persons from "./components/Persons"
import PersonForm from "./components/PersonForm"
import axios from "axios"

const App = () => {
	const [persons, setPersons] = useState([])
	const [newName, setNewName] = useState("")
	const [newPhone, setNewPhone] = useState("")
	const [newSearch, setSearch] = useState("")
	const [filterResults, setNewResults] = useState([])

	useEffect(() => {
		axios.get("http://localhost:3001/persons").then((response) => {
			setPersons(response.data)
		})
	}, [])

	const addPerson = (e) => {
		e.preventDefault()
		const newPerson = {
			name: newName,
			number: newPhone,
			id: persons[persons.length - 1].id + 1,
		}
		const newNamePresent = persons.some(
			(person) => person.name.toLowerCase() === newName.toLowerCase()
		)
		console.log(newPerson)

		if (newNamePresent) {
			alert(`${newName} is already in the phonebook`)
			return
		}

		setPersons(persons.concat(newPerson))
		setNewName("")
		setNewPhone("")
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

	const clearFilter = () => {
		setNewResults([])
		setSearch("")
	}

	return (
		<div>
			<h2>Phonebook</h2>
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
			<Persons persons={persons} filterResults={filterResults} />
		</div>
	)
}

export default App
