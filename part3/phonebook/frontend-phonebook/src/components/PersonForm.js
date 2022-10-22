const PersonForm = ({
	addPerson,
	handleNameChange,
	handlePhoneChange,
	newName,
	newPhone,
}) => {
	return (
		<form onSubmit={addPerson}>
			<div>
				name: <input onChange={handleNameChange} value={newName} />
			</div>
			<div>
				phone: <input onChange={handlePhoneChange} value={newPhone} />
			</div>
			<div>
				<button type="submit">add</button>
			</div>
		</form>
	)
}

export default PersonForm