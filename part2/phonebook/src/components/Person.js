const Person = ({ name, number, id, deleteContact }) => {
	return (
		<p>
			{name} {number} <button onClick={() => deleteContact(id)}>Delete</button>
		</p>
	)
}

export default Person