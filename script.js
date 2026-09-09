let cityInput = document.getElementById('cityInput');
let getWeatherBtn = document.getElementById('getWeatherBtn');
let weatherResult = document.getElementById('weatherResult');
let cityName = document.getElementById('cityName');
let temperature = document.getElementById('temperature');
let weatherCondition = document.getElementById('weatherCondition');
let humidity = document.getElementById('humidity');
let windSpeed = document.getElementById('windSpeed');

getWeatherBtn.addEventListener('click', async function() {
    try {
        let cityNameInput = cityInput.value;

        let url = "https://geocoding-api.open-meteo.com/v1/search?name=" + cityNameInput;

        let response = await fetch(url);
        let data = await response.json();

        console.log(data);

        if (!data.results || data.results.length === 0) {
            cityName.textContent = "City not found ❌";
            temperature.textContent = "";
            weatherCondition.textContent = "";
            humidity.textContent = "";
            windSpeed.textContent = "";
            return;
        }

        let latitude = data.results[0].latitude;
        let longitude = data.results[0].longitude;
        let cityNameData = data.results[0].name;

        let weatherUrl = "https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude + "&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m";

        let weatherResponse = await fetch(weatherUrl);
        let weatherData = await weatherResponse.json();

        let weatherCode = weatherData.current.weather_code;
        let condition = "";

        if (weatherCode === 0) {
            condition = "Sunny ☀️";
        } else if (weatherCode === 1 || weatherCode === 2 || weatherCode === 3) {
            condition = "Cloudy 🌤️";
        } else if (weatherCode >= 45 && weatherCode <= 48) {
            condition = "Foggy 🌫️";
        } else if (weatherCode >= 51 && weatherCode <= 67) {
            condition = "Rainy 🌧️";
        } else if (weatherCode >= 71 && weatherCode <= 77) {
            condition = "Snowy ❄️";
        } else if (weatherCode >= 95 && weatherCode <= 99) {
            condition = "Thunderstorm ⛈️";
        }

        cityName.textContent = cityNameData;
        temperature.textContent = "Temperature: " + weatherData.current.temperature_2m + "°C";
        weatherCondition.textContent = "Condition: " + condition;
        humidity.textContent = "Humidity: " + weatherData.current.relative_humidity_2m + "%";
        windSpeed.textContent = "Wind Speed: " + weatherData.current.wind_speed_10m + " km/h";

        console.log(weatherData.current);

    } catch (error) {
        console.log("Something went wrong:", error);
        cityName.textContent = "Something went wrong ❌";
    }
});