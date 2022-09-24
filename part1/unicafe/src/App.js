import { useState } from "react"

const Button = ({ incrementCount, text }) => {
	return <button onClick={incrementCount}>{text}</button>
}

const Statistics = ({ good, neutral, bad }) => {
	const total = good + neutral + bad
	if (total === 0) {
		return (
			<div>
				<h1>Statistics</h1>
				<p>No feedback given</p>
			</div>
		)
	}

	return (
		<div>
			<h1>Statistics</h1>
			<table>
				<StatisticsLine text="Good" value={good} />
				<StatisticsLine text="Neutral" value={neutral} />
				<StatisticsLine text="Bad" value={bad} />
				<StatisticsLine text="Total" value={total} />
				<StatisticsLine text="Average" value={total / 3.0} />
				<StatisticsLine
					text="Positive Reviews"
					value={`${(good / total) * 100}%`}
				/>
			</table>
		</div>
	)
}

const StatisticsLine = ({ text, value }) => {
	return (
		<tbody>
			<tr>
				<td>{text}</td>
				<td>{value}</td>
			</tr>
		</tbody>
	)
}

const App = () => {
	// save clicks of each button to its own state
	const [good, setGood] = useState(0)
	const [neutral, setNeutral] = useState(0)
	const [bad, setBad] = useState(0)

	const incrementCount = (voteType) => {
		if (voteType === "good") {
			setGood(good + 1)
			return
		}
		if (voteType === "neutral") {
			setNeutral(neutral + 1)
			return
		}
		if (voteType === "bad") {
			setBad(bad + 1)
			return
		}
		return
	}

	return (
		<div>
			<div>
				<h1>Give Feedback</h1>
				<Button incrementCount={() => incrementCount("good")} text="good" />
				<Button
					incrementCount={() => incrementCount("neutral")}
					text="neutral"
				/>
				<Button incrementCount={() => incrementCount("bad")} text="bad" />
			</div>
			<Statistics good={good} neutral={neutral} bad={bad} />
		</div>
	)
}

export default App
