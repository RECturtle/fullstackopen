import { useState } from "react"

const Summary = ({ maxVotes, anecdotes }) => {
	const [indexes, max] = maxVotes

	if (max === 0) {
		return (
			<div>
				<h1>Anecdotes with the most votes</h1>
				<p>No votes yet</p>
			</div>
		)
	}

	return (
		<div>
			<h1>Anecdotes with the most votes</h1>
			{indexes.map((index) => {
				return (
					<div key={index}>
						<p>{anecdotes[index]}</p>
						<p>Votes: {max}</p>
					</div>
				)
			})}
		</div>
	)
}

const App = () => {
	const anecdotes = [
		"If it hurts, do it more often.",
		"Adding manpower to a late software project makes it later!",
		"The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
		"Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
		"Premature optimization is the root of all evil.",
		"Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
		"Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
	]

	const [selected, setSelected] = useState(0)
	const [votes, setVote] = useState([0, 0, 0, 0, 0, 0, 0])

	const randomChoice = () => {
		let newNum = Math.floor(Math.random() * 7)

		// Remove the possibility of getting the same quote 2x in a row
		while (newNum === selected) {
			newNum = Math.floor(Math.random() * 7)
		}

		setSelected(newNum)
	}

	const upVote = () => {
		const votesCopy = [...votes]
		votesCopy[selected] += 1
		setVote(votesCopy)

		// Swap anecdote on quote so a user can't spam votes for one choice
		randomChoice()
	}

	const maxVotes = () => {
		const max = Math.max(...votes)

		const indexes = []

		for (let index = 0; index < votes.length; index++) {
			if (votes[index] === max) {
				indexes.push(index)
			}
		}

		return [indexes, max]
	}

	return (
		<div>
			<h1>Anecdote of the day</h1>
			<p>{anecdotes[selected]}</p>
			<p>UpVotes: {votes[selected]}</p>
			<div>
				<button onClick={() => upVote()}>UpVote!</button>
				<button onClick={() => randomChoice()}>Next Anecdote</button>
			</div>
			<Summary maxVotes={maxVotes()} anecdotes={anecdotes} />
		</div>
	)
}

export default App
