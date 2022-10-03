import Country from './Country'

const DisplayCountries = ({ countries, setCountries }) => {
	if (countries.length > 10) {
		return <p>Too many matches, specify another filter</p>
	}

	if (countries.length === 0) {
		return <p>No results</p>
	}

	if (countries.length === 1) {
		return <Country country={countries[0]} />
	}

	return (
		<div>
			{countries.map((country) => {
				return (
					<div key={country.cca2}>
						<p>{country.name.common} <button onClick={() => setCountries([country])}>show</button></p>
					</div>
				)
			})}
		</div>
	)
}

export default DisplayCountries
