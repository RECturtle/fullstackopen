const SearchForm = ({ updateSearch }) => {
	return (
		<form>
			Find countries <input onChange={updateSearch} />
		</form>
	)
}

export default SearchForm