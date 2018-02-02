const express = require("express");
const http = require("http");
const path = require("path");
const bodyParser = require("body-parser");
const axios = require("axios");
const async = require("async");

const app = express();

app.set('port', (process.env.PORT || 5000))
app.listen(app.get('port'), () => {
  console.log("Node app is running at localhost:" + app.get('port'))
});

app.use(express.static("public"));
app.use(bodyParser.json());


const ids = {"Helsinki": "658226", "Los Angeles": "5368361", "Tokyo": "1850147", "Dubai": "292223", "Barcelona": "3128760"};


app.get("/", (req, resp) => {

	resp.sendFile(path.join(__dirname + "/public/index.html"));
});

app.get("/forecast/:id", (req, resp) => {
	//temperature: 15, maxTemperature: 18, minTemperature: 14, icon: "#"},
	
	const id = req.params.id;

	const data = {};
	const days = {};
	axios.get("https://api.openweathermap.org/data/2.5/forecast?id=" + ids[id] + "&appid=433d4e8a404bcfc906fd28bed3a75f60")
	.then(resp2 => {
		const forecastList = resp2.data.list;
		async.each(forecastList, (forecast, callback) => {

			const day = forecast.dt_txt.slice(0,10);
			const hour = forecast.dt_txt.slice(11,13);
			//console.log(day, hour);

			if (!days.hasOwnProperty(day)) {
				days[day] = {temps: [], forecast: {}};
			};

			//console.log(day, hour);
			const maxTemp = toCelsius(forecast.main.temp_max);
			const minTemp = toCelsius(forecast.main.temp_min);
			const temp = toCelsius(forecast.main.temp);

			days[day].forecast[hour] = {
					temperature: temp,
					maxTemperature: maxTemp,
					minTemperature: minTemp,
					weatherDescription: forecast.weather[0].description,
					weatherIconUrl: "https://openweathermap.org/img/w/" + forecast.weather[0].icon + ".png"
				}
			days[day].temps = days[day].temps.concat([temp, maxTemp, minTemp]);
			//console.log(days[day].forecast[hour]);

			callback(null);
		}, () => {

			async.each(Object.keys(days), (day, callback2) => {

				let middle = Math.floor((Object.keys(days[day].forecast).length) / 2);
				middle = Object.keys(days[day].forecast).sort((a,b) => parseInt(a) > parseInt(b))[middle];

				days[day].maxTemperature = Math.max.apply(null, days[day].temps);
				days[day].minTemperature = Math.min.apply(null, days[day].temps);
				days[day].temperature = days[day].forecast[middle].temperature;
				days[day].weatherDescription = days[day].forecast[middle].weatherDescription;
				days[day].weatherIconUrl = days[day].forecast[middle].weatherIconUrl;

				callback2(null);
			}, () => {

				const DATA = days;//{forecastByDayAndHour: data, forecastByDay: days};
				//console.log(DATA);
				resp.setHeader('Content-Type', 'application/json');
				resp.send(JSON.stringify(DATA));
			});

		});
	})
	.catch(error => {
		console.log(error);
		resp.sendStatus(400);
	})
});

function toCelsius(temp) {
	return Math.round((temp - 273.15)*2)/2;
};