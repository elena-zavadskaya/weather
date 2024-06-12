import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import './App.css';
import './App.scss';

const SearchResults = ({ searchResults, handleCityClick }) => {
  return (
    <div className="search-results">
      {searchResults.map((result) => (
        <div
          key={result.Key}
          className="search-result"
          onClick={() => handleCityClick(result.LocalizedName, result.Key)}
        >
          <div>{result.LocalizedName}, {result.Country.LocalizedName}</div>
          <div>Тип региона: {result.AdministrativeArea.LocalizedName}</div>
          <div>Область: {result.AdministrativeArea.LocalizedName}</div>
          <div>Страна: {result.Country.LocalizedName}</div>
        </div>
      ))}
    </div>
  );
};

const backgroundImages = {
  'sunny': 'sunny',
  'mostly sunny': 'sunny',
  'partly sunny': 'sunny',
  'intermittent clouds': 'cloudy',
  'hazy sunshine': 'hazy',
  'mostly cloudy': 'cloudy',
  'cloudy': 'cloudy',
  'dreary (overcast)': 'cloudy',
  'fog': 'fog',
  'showers': 'ai-water',
  'mostly cloudy w/ showers': 'cloudy',
  'partly sunny w/ showers': 'sunny',
  't-storms': 'stormy',
  'mostly cloudy w/ t-storms': 'stormy',
  'partly sunny w/ t-storms': 'stormy',
  'rain': 'ai-water',
  'flurries': 'snowy',
  'mostly cloudy w/ flurries': 'snowy',
  'partly sunny w/ flurries': 'snowy',
  'snow': 'snowy',
  'mostly cloudy w/ snow': 'snowy',
  'ice': 'icy',
  'sleet': 'icy',
  'freezing rain': 'icy',
  'rain and snow': 'rainy-snowy',
  'hot': 'sunny',
  'cold': 'snowy',
  'windy': 'windy',
  'clear': 'sunny',
  'mostly clear': 'sunny',
  'partly cloudy': 'cloudy',
  'hazy moonlight': 'hazy',
  'partly cloudy w/ showers': 'ai-water',
  'partly cloudy w/ t-storms': 'stormy'
};

function App() {
  const [locationData, setLocationData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [fiveDayForecast, setFiveDayForecast] = useState(null);
  const [currentTemperature, setCurrentTemperature] = useState(null);
  const [iconPhrase, setIconPhrase] = useState(null);
  const [iconPhraseEn, setIconPhraseEn] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [hourlyForecast, setHourlyForecast] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (city = 'Москва') => {
    try {
      const apiKey = '1DGgHYxcAUpqAWQq6yGN1gIaW09itm7T';
      const locationResponse = await fetch(`http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${encodeURIComponent(city)}&language=ru-ru`);
      const locationData = await locationResponse.json();
      const locationKey = locationData[0].Key;

      const weatherResponse = await fetch(`http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}&language=ru-ru&details=true`);
      const weatherData = await weatherResponse.json();

      const weatherResponseEn = await fetch(`http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}&details=true`);
      const weatherDataEn = await weatherResponseEn.json();

      const fiveDayForecastResponse = await fetch(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}&language=ru-ru&details=true`);
      const fiveDayForecastData = await fiveDayForecastResponse.json();

      const hourlyForecastResponse = await fetch(`http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${apiKey}&language=ru-ru&details=true`);
      const hourlyForecastData = await hourlyForecastResponse.json();

      setLocationData(locationData[0]);
      setWeatherData(weatherData[0]);
      setFiveDayForecast(fiveDayForecastData);
      setHourlyForecast(hourlyForecastData);
      setCurrentTemperature(Math.round(weatherData[0].Temperature.Metric.Value));
      setIconPhrase(weatherData[0].WeatherText);
      setIconPhraseEn(weatherDataEn[0].WeatherText);

      console.log('Weather Text (RU):', weatherData[0].WeatherText);
      console.log('Weather Text (EN):', weatherDataEn[0].WeatherText);
      console.log('Five Day Forecast:', fiveDayForecastData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCityClick = (cityName, locationKey) => {
    setSearchQuery(cityName);
    setSearchResults([]);
    fetchData(cityName);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const apiKey = '1DGgHYxcAUpqAWQq6yGN1gIaW09itm7T';
      const response = await fetch(`http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${encodeURIComponent(searchQuery)}&language=ru-ru`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        throw new Error('Не удалось выполнить поиск городов');
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!locationData || !weatherData || !fiveDayForecast || !hourlyForecast) {
    return <div>Loading...</div>;
  }

  const locationName = locationData.LocalizedName;
  const countryName = locationData.Country.LocalizedName;
  const latitude = locationData.GeoPosition.Latitude;
  const longitude = locationData.GeoPosition.Longitude;
  const headline = weatherData.Headline;
  const dailyForecast = fiveDayForecast.DailyForecasts && fiveDayForecast.DailyForecasts.length > 0
    ? fiveDayForecast.DailyForecasts[0]
    : null;
  const minTemperature = dailyForecast
    ? dailyForecast.Temperature.Minimum.Value
    : null;
  const maxTemperature = dailyForecast
    ? dailyForecast.Temperature.Maximum.Value
    : null;

const fahrenheitToCelsius = (fahrenheit) => {
  return ((fahrenheit - 32) * 5) / 9;
};

const minTemperatureCelsius = minTemperature !== null ? Math.round(fahrenheitToCelsius(minTemperature)) : null;
const maxTemperatureCelsius = maxTemperature !== null ? Math.round(fahrenheitToCelsius(maxTemperature)) : null;

const normalizePhrase = (phrase) => {
  if (!phrase) return '';
  return phrase.trim().toLowerCase().replace(/\s+/g, ' ');
};

const getBackgroundImage = () => {
  const normalizedPhrase = normalizePhrase(iconPhraseEn);
  const imageName = backgroundImages[normalizedPhrase] || 'ai-water';
  console.log('Selected background image:', imageName);
  return `${process.env.PUBLIC_URL}/images/${imageName}.jpg`;
};

return (
  <div
    className="app-container"
    style={{
      backgroundImage: `url(${getBackgroundImage()})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      height: '100vh',
      width: '100vw',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: -1
    }}
  >
    <Container className="my-5 container">
      <div className="text-center mt-3 mb-5">
        <h1 className="app-title">Погода по городам</h1>
      </div>
      <Row>
        <Col md={12}>
          <Form onSubmit={handleSearch} className="mb-4 d-flex justify-content-center">
            <Form.Group controlId="searchForm" className="search-input">
              <Form.Control
                type="text"
                placeholder="Введите город"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchResults.length > 0 && (
                <div className="search-results-container">
                  <SearchResults
                    searchResults={searchResults}
                    handleCityClick={handleCityClick}
                  />
                </div>
              )}
            </Form.Group>
            <div className="search-button">
              <Button variant="primary" type="submit">
                Поиск
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <div className="location-card">
            <div className="location-info">
              <h3 className="location-name">{locationName}, {countryName}</h3>
              <div className="location-details">
                Широта: {latitude}, Долгота: {longitude}
              </div>
              <div>{headline}</div>
              <div>Температура: {currentTemperature}°C, {iconPhrase}</div>
              <div>
                <span>Минимальная температура: {minTemperatureCelsius}°C</span>
                <br />
                <span>Максимальная температура: {maxTemperatureCelsius}°C</span>
              </div>
            </div>
            <div className="hourly-forecast-container">
              <h3 className="hourly-forecast-title">Почасовой прогноз</h3>
              <div className="hourly-forecast">
                {hourlyForecast.map((hourForecast, index) => (
                  <div key={index} className="forecast-hour">
                    <div className="hour-time">{new Date(hourForecast.DateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    <div className="hour-temp">{Math.round(fahrenheitToCelsius(hourForecast.Temperature.Value))}°C</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="text-center mt-5 mb-3">
            <h2 className="forecast-title">Прогноз на 5 дней</h2>
          </div>
          <div className="forecast-cards">
            {fiveDayForecast.DailyForecasts.map((forecast, index) => (
              <Card key={index} className="forecast-card">
                <Card.Body>
                  <Card.Title>{new Date(forecast.Date).toLocaleDateString()}</Card.Title>
                  <Card.Text>
                    <span>{Math.round(fahrenheitToCelsius(forecast.Temperature.Minimum.Value))}°C</span>
                    {' - '}
                    <span>{Math.round(fahrenheitToCelsius(forecast.Temperature.Maximum.Value))}°C</span>
                  </Card.Text>
                  <Card.Text>{forecast.Day.IconPhrase}</Card.Text>
                </Card.Body>
              </Card>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  </div>
);
}

export default App;
