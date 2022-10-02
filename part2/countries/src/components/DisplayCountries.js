const DisplayCountries = ({ countries }) => {
	if (countries.length > 10) {
		return <p>Too many matches, specify another filter</p>
	}

	if (countries.length === 0) {
		return <p>No results</p>
	}

    if (countries.length === 1) {
        const country = countries[0]
        return (
            <div>
                <h1>{country.name.common}</h1>
                <p>Capital: {country.capital}</p>
                <p>Area: {country.area}</p>

                <h2>Languages</h2>
                <ul>
                    {Object.entries(country.languages).map(([_, value]) => <li key={value}>{value}</li>)}
                </ul>
                <img src={country.flags.png} alt={`${country.name.common} flag`} />
            </div>
        )
    }

	return (
		<div>
			{countries.map((country) => {
			  return <p key={country.cca2} >{country.name.common}</p>
			})}
		</div>
	)
}

export default DisplayCountries