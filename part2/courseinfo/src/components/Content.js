import Part from "./Part"
import Total from "./Total"

const Content = ({ parts }) => {
	return (
		<>
			{parts.map((part) => {
				return <Part title={part.name} exercise={part.exercises} key={part.id} />
			})}
			<Total parts={parts} />
		</>
	)
}

export default Content