const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/html.html");
});

app.post("/", function (req, res) {
    const query = req.body.cityName;
    const openWeatherApiKey = '72b99b48de4f5799a577aad51829d75e';
    const weatherApiKey = 'beeea5742a74412aae1182602232210';

    // OpenWeatherMap API Request
    const openWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${openWeatherApiKey}&units=metric`;

    https.get(openWeatherUrl, function (openWeatherResponse) {
        let openWeatherData = '';

        openWeatherResponse.on("data", function (chunk) {
            openWeatherData += chunk;
        });

        openWeatherResponse.on("end", function () {
            const openWeatherDataParsed = JSON.parse(openWeatherData);

            // WeatherAPI Request
            const weatherApiUrl = `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${query}&aqi=yes`;

            https.get(weatherApiUrl, function (weatherApiResponse) {
                let weatherApiData = '';

                weatherApiResponse.on("data", function (chunk) {
                    weatherApiData += chunk;
                });

                weatherApiResponse.on("end", function () {
                    const weatherApiDataParsed = JSON.parse(weatherApiData);

                    // Extract relevant data from the OpenWeatherMap response
                    const tempC = openWeatherDataParsed.main.temp;
                    const description = openWeatherDataParsed.weather[0].description;
                    const feelsLikeC = openWeatherDataParsed.main.feels_like;
                    const humidity = openWeatherDataParsed.main.humidity;
                    const pressureMb = openWeatherDataParsed.main.pressure;
                    const windSpeed = openWeatherDataParsed.wind.speed;
                    const country = openWeatherDataParsed.sys.country;

                    // Extract relevant data from the WeatherAPI response
                    const tempCWeatherAPI = weatherApiDataParsed.current.temp_c;
                    const tempFWeatherAPI = weatherApiDataParsed.current.temp_f;
                    const isDay = weatherApiDataParsed.current.is_day;
                    const text = weatherApiDataParsed.current.condition.text;
                    const icon = weatherApiDataParsed.current.condition.icon;
                    const code = weatherApiDataParsed.current.condition.code;
                    const windKph = weatherApiDataParsed.current.wind_kph;
                    const windDegree = weatherApiDataParsed.current.wind_degree;
                    const windDir = weatherApiDataParsed.current.wind_dir;
                    const precipMm = weatherApiDataParsed.current.precip_mm;
                    const precipIn = weatherApiDataParsed.current.precip_in;
                    const cloud = weatherApiDataParsed.current.cloud;
                    const uv = weatherApiDataParsed.current.uv;

                    // Render the response with data from both APIs
                    res.write("<h1> Current Weather in " + query + "</h1>");
                    res.write("<p> Temperature (OpenWeatherMap): " + tempC + "°C</p>");
                    res.write("<p> Weather Description (OpenWeatherMap): " + description + "</p>");
                    res.write("<p> Feels Like Temperature (OpenWeatherMap): " + feelsLikeC + "°C</p>");
                    res.write("<p> Humidity (OpenWeatherMap): " + humidity + "%</p>");
                    res.write("<p> Pressure (OpenWeatherMap): " + pressureMb + " mb</p>");
                    res.write("<p> Wind Speed (OpenWeatherMap): " + windSpeed + " m/s</p>");
                    res.write("<p> Country Code (OpenWeatherMap): " + country + "</p>");

                    res.write("<p> Temperature (WeatherAPI): " + tempCWeatherAPI + "°C</p>");
                    res.write("<p> Is it Day (WeatherAPI): " + isDay + "</p>");
                    res.write("<p> Weather Condition (WeatherAPI): " + text + "</p>");
                    res.write("<p> Weather Icon (WeatherAPI): <img src='" + icon + "' alt='Weather Icon'></p>");
                    res.write("<p> Condition Code (WeatherAPI): " + code + "</p>");
                    res.write("<p> Wind Speed (WeatherAPI): " + windKph + " kph</p>");
                    res.write("<p> Wind Direction (WeatherAPI): " + windDir + " (" + windDegree + "°)</p>");
                    res.write("<p> Precipitation (WeatherAPI): " + precipMm + " mm / " + precipIn + " in</p>");
                    res.write("<p> Cloud Cover (WeatherAPI): " + cloud + "%</p>");
                    res.write("<p> UV Index (WeatherAPI): " + uv + "</p>");

                    res.send();
                });
            });
        });
    });
});

app.listen(3000, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log("Server OK");
});
