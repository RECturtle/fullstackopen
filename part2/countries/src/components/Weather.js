import { useEffect, useState } from "react"

const Weather = ({ city }) => {
	const api_key = process.env.REACT_APP_API_KEY
	const [weather, setWeather] = useState([])

	useEffect(() => {
		async function fetchWeather() {
			const weather = await (
				await fetch(
					`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${api_key}`
				)
			).json()
			setWeather(weather)
		}
		fetchWeather()
	}, [api_key, city])

	return (
		<>
			{weather.main ? (
				<div>
					<h2>Weather in {city}</h2>
					<div>Temperature {weather.main.temp}°C</div>
					<img
						alt="weather icon"
						src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
					/>
					<div>Wind {weather.wind.speed} m/s</div>
				</div>
			) : null}
		</>
	)
}

export default Weather
