import Person from "./Person"

const Persons = ({ persons, deleteContact, filterResults }) => {
	if (filterResults.length === 0) {
		return (
			<div>
				{persons.map((person) => (
					<Person key={person.id} name={person.name} number={person.number} id={person.id} deleteContact={deleteContact} />
				))}
			</div>
		)
	}
	return (
		<div>
			{filterResults.map((person) => (
				<Person key={person.id} name={person.name} number={person.number} id={person.id} deleteContact={deleteContact} />
			))}
		</div>
	)
}

export default Persons
