import React, { useState } from "react";
import weather1 from ".//api/climate";
import moment from "moment";
import "moment-timezone";
import FetchForecast from "./api/fetchForecast";
import "./styles.css";
const App = () => {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({});
  const [weather2, setWeather2] = useState([]);
  const search = async (e) => {
    if (e.key === "Enter") {
      const data = await weather1(query);
      setWeather(data);
      checkTime(data);
      forecast();
      setQuery("");
    }
  };

  function changeDatetimeByTimezone(datetime, timezone) {
    const parsedDateAsUtc = moment
      .utc()
      .startOf("day")
      .add(datetime.substring(0, 2), "hours")
      .add(datetime.substring(3, 5), "minutes");
    return parsedDateAsUtc.clone().tz(timezone).format("hh:mm");
  }

  function checkTime(weather) {
    let time = weather;
    let timezoneOffset = time.timezone / 60; // Convert seconds to minutes

    let currentLocalTime = new Date(
      new Date().getTime() + timezoneOffset * 60 * 1000,
    );

    setWeather((prev) => ({ ...prev, currentLocalTime }));

    let sunrise = time.sys.sunrise * 1000; // Convert to milliseconds
    let sunset = time.sys.sunset * 1000; // Convert to milliseconds

    let sunriseLocal = new Date(sunrise + timezoneOffset * 60 * 1000);
    let sunsetLocal = new Date(sunset + timezoneOffset * 60 * 1000);

    const sunriseLocalFormatted = changeDatetimeByTimezone(
      sunriseLocal.toISOString().substring(11, 16),
      moment.tz.guess(),
    );

    const sunsetLocalFormatted = changeDatetimeByTimezone(
      sunsetLocal.toISOString().substring(11, 16),
      moment.tz.guess(),
    );

    const currentLocalTimeFormatted = changeDatetimeByTimezone(
      currentLocalTime.toISOString().substring(11, 16),
      moment.tz.guess(),
    );

    if (currentLocalTime >= sunriseLocal && currentLocalTime <= sunsetLocal) {
      document.querySelector(".main-container").classList.remove("sunset");
      document.querySelector(".main-container").classList.add("sunrise");
    } else {
      document.querySelector(".main-container").classList.remove("sunrise");
      document.querySelector(".main-container").classList.add("sunset");
    }
  }

  const forecast = async (e) => {
    const data = await FetchForecast(query);
    const forecastData = [];

    for (let i = 0; i < data.list.length; i += 8) {
      let temp = [];
      let dt = new Date(data.list[i + 5].dt_txt);
      temp.push(dt.getDate() + "/" + dt.getFullYear());
      temp.push(data.list[i].weather[0].main);
      temp.push(data.list[i + 3].weather[0].description);
      temp.push(
        `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png`,
      );
      temp.push(data.list[i].main.temp);
      forecastData.push(temp);
    }
    setWeather2(forecastData);
  };
  console.log(weather2);
  const Foredata = weather2.map((item, i) => {
    return (
      <div className="forecast">
        <div key={i} className="date">
          {item[0]}
        </div>
        <div key={i}>{item[1]}</div>
        <div key={i}>
          {item[4]} <sup>&deg;C</sup>
        </div>
        <div key={i}>
          <img className="forecast-img" src={item[3]} />
        </div>
      </div>
    );
  });

  return (
    <div className="main-container">
      <h1>Weather App</h1>
      <input
        placeholder="Enter City"
        type="text"
        className="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={search}
      />
      {weather.main && (
        <div className="city">
          <h2 className="city-name">
            <span>{weather.name}</span>
            <sup>{weather.sys.country}</sup>
            <p>{moment().format("LT")}</p>
          </h2>
          <div className="city-temp">
            {Math.round(weather.main.temp)}
            <sup>&deg;C</sup>
          </div>
          <div className="info">
            <img
              className="city-icon"
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />
            <p>{weather.weather[0].description}</p>
          </div>
        </div>
      )}
      {weather2.length > 0 ? <div className="container">{Foredata}</div> : null}
    </div>
  );
};

export default App;
