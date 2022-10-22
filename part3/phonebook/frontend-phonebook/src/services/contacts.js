import axios from "axios"
const baseUrl = "/api/persons"

const getPersons = async () => {
	const response = await axios.get(baseUrl)
	return response.data
}

const create = async (newContact) => {
	const response = await axios.post(baseUrl, newContact)
	return response.data
}

const deleteContact = async (id) => {
	if (window.confirm("Are you sure you'd like to delete the user?")) {
		const response = await axios.delete(`${baseUrl}/${id}`)

		if (!response.status === 200) {
			alert("Failed to delete, please refresh and try again")
		}
		return true
	}
	return false
}

const updateContact = async (person, id) => {
	const response = await axios.put(`${baseUrl}/${id}`, person)

	return response.data
}

export default {
	getPersons,
	create,
	deleteContact,
	updateContact,
}
