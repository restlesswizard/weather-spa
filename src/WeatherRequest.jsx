import { useState, useEffect } from "react";

function Weather() {
  const [coords, setCoords] = useState(null);
  const [weather, setWeather] = useState(null);
  const cityName = "Курган";

    // Первый useEffect ищет координаты по имени города  
  useEffect(() => {
    const fetchCityCoords = async () => {
      try {
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=ru&format=json`
        );
        if (!response.ok) throw new Error("Ошибка запроса (Город)");
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          const { latitude, longitude } = data.results[0];
          setCoords({ latitude, longitude });
        }
      } catch (error) {
        console.error("Ошибка: ", error);
      }
    };

    fetchCityCoords();
  }, [cityName]); // Запрос координат при изменении города

    // Второй useEffect ищет данные о погоде на основе координат из первого useEffect,
    // который записывает изменения наверх в переменную coords
  useEffect(() => {
    if (!coords) return;

    

    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`
        );
        if (!response.ok) throw new Error("Ошибка запроса (Погода)");
        const data = await response.json();
        setWeather(data.current);
      } catch (error) {
        console.error("Ошибка:", error);
      }
    };

    fetchWeather();

    // Интервал для периодического обращения к API погоды
    // Раз в какой-то интервал времени будет вызывать fetchWeather
    // и обновлять данные
    const intervalId = setInterval(fetchWeather, 30000);
    // Говорят, нужно очищать интервал.
    return () => clearInterval(intervalId);
  }, [coords]); // Запрос погоды после загрузки координат

    // Возвращаем вёрстку с какими-то данными из weather   
  return (
    
    <div>
        
      <h2>Погода в {cityName}</h2>
      {weather ? (
        <p>Температура: {weather.temperature_2m}°C, Ветер: {weather.wind_speed_10m} м/с</p>
      ) : (
        <p>Ищу данные за погоду, обожди...</p>
      )}
      {  console.log(weather)}
    </div>
  );
}

export default Weather;
