import { useEffect, useState } from "react"
import DisplayCountries from "./components/DisplayCountries"
import SearchForm from "./components/SearchForm"

const App = () => {
	const [allCountries, setAllCountries] = useState([])
	const [countries, setCountries] = useState([])
	const [searchTerm, setSearch] = useState("")
	const [filtered, setFilter] = useState("")

	const updateSearch = (e) => {
		setSearch(e.target.value)
	}

	useEffect(() => {
		const timerId = setTimeout(() => {
			setFilter(searchTerm)
		}, 1000)

		return () => {
			clearTimeout(timerId)
		}
	}, [searchTerm])

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await (
					await fetch("https://restcountries.com/v3.1/all")
				).json()

				setAllCountries(response)
			} catch (e) {
				console.log("Something went wrong", e)
			}
		}
		fetchData()
	}, [])

	useEffect(() => {
		const countryList = allCountries.filter((country) =>
			country.name.common.toLowerCase().includes(filtered.toLowerCase())
		)

		setCountries(countryList)
	}, [filtered, allCountries])

	return (
		<div>
			<SearchForm updateSearch={updateSearch} />
			<DisplayCountries countries={countries} />
		</div>
	)
}

export default App
