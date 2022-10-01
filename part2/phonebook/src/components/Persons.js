import Person from "./Person"

const Persons = ({ persons, filterResults }) => {
	if (filterResults.length === 0) {
		return (
			<div>
				{persons.map((person) => (
					<Person key={person.name} name={person.name} phone={person.phone} />
				))}
			</div>
		)
	}
	return (
		<div>
			{filterResults.map((person) => (
				<Person key={person.name} name={person.name} phone={person.phone} />
			))}
		</div>
	)
}

export default Persons
