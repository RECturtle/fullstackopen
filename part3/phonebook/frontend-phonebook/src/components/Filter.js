const Filter = ({ updateFilter, handleSearchChange, newSearch, clearFilter }) => {
	return (
		<div>
			<form onSubmit={updateFilter}>
				<input onChange={handleSearchChange} value={newSearch} />
			</form>
			<button onClick={clearFilter}>Reset Filter</button>
		</div>
	)
}

export default Filter