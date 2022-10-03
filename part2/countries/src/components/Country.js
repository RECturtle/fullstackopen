import Weather from "./Weather"

const Country = ({ country }) => {
	return (
		<div>
			<h1>{country.name.common}</h1>
			<p>Capital: {country.capital}</p>
			<p>Area: {country.area}</p>

			<h2>Languages</h2>
			<ul>
				{Object.entries(country.languages).map(([_, value]) => (
					<li key={value}>{value}</li>
				))}
			</ul>
			<img src={country.flags.png} alt={`${country.name.common} flag`} />
            <Weather city={country.capital} />
		</div>
	)
}

export default Country
