import React, { useState, useEffect } from 'react';
import axios from 'axios';

const apiKey = 'kfkM9cDLkP56kDiDePhTKc6tpN0HCNqJ';

const Weather = ({ data }) => {
  const { city, list } = data;

  return (
    <div className="weather">
      <h2>Weather in {city.name}, {city.country}</h2>
      <div className="weather-container">
        {list.slice(0, 5).map((forecast, index) => (
          <div key={index} className="weather-item">
            <h3>{new Date(forecast.dt_txt).toLocaleDateString()}</h3>
            <p>Temp: {forecast.main.temp}°C</p>
            <p>Weather: {forecast.weather[0].description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const LocationInput = ({ onLocationChange }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() !== '') {
      onLocationChange(input);
    } else {
      alert('Please enter a valid location');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="location-form">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter location"
        className="location-input"
      />
      <button type="submit" className="location-button">Get Weather</button>
    </form>
  );
};

const App = () => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);

  const fetchWeather = async (loc) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${loc}&appid=${apiKey}&units=metric`;
      const response = await axios.get(url);
      setWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      alert('Error fetching weather data. Please try again later.');
    }
  };

  const handleLocationChange = (loc) => {
    setLocation(loc);
    fetchWeather(loc);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      axios.get(url)
        .then(response => {
          setWeatherData(response.data);
          setLocation(`${response.data.city.name}, ${response.data.city.country}`);
        })
        .catch(error => console.error('Error fetching location-based weather data:', error));
    });
  }, []);

  return (
    <div className="App">
      <h1>Weather Forecast</h1>
      <LocationInput onLocationChange={handleLocationChange} />
      {weatherData && <Weather data={weatherData} />}
    </div>
  );
};

export default App;

// Add the CSS directly into the JS file using template literals and a style tag
const styles = 
  body {
    font-family: Arial, sans-serif;
    background-color: #e0f7fa;
    margin: 0;
    padding: 0;
  }

  .App {
    text-align: center;
    padding: 20px;
  }

  .location-form {
    margin-bottom: 20px;
  }

  .location-input {
    padding: 10px;
    font-size: 16px;
    border: 2px solid #00796b;
    border