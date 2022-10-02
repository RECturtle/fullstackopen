import Person from "./Person"

const Persons = ({ persons, filterResults }) => {
	if (filterResults.length === 0) {
		return (
			<div>
				{persons.map((person) => (
					<Person key={person.id} name={person.name} number={person.number} />
				))}
			</div>
		)
	}
	return (
		<div>
			{filterResults.map((person) => (
				<Person key={person.id} name={person.name} number={person.number} />
			))}
		</div>
	)
}

export default Persons
