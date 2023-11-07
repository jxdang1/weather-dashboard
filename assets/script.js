apiKey = "1ebabe5e0798007005faf526f4d4fa9b";

var currentWeatherContainer = document.getElementById("current-weather");
var fiveDayContainer = document.getElementById("five-forecast");
var searchHistory = document.getElementById("search-history");
var currentHeader = document.getElementById("current-header");
var currentTemp = document.getElementById("temp");
var currentWind = document.getElementById("wind");
var currentHumid = document.getElementById("humid");
var currentIcon = document.getElementById("icon");


function clearElements() {
    while (fiveDayContainer.lastChild) {
        fiveDayContainer.removeChild(fiveDayContainer.lastChild);
    }
}

function getSearchEngine() {
    //getting the search box's value
    var searchCity = document.getElementById("search-city").value;

    //checking to be sure the box has a value
    if (searchCity) {

        //using openweather's API to get the latitude and longitude
        fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + searchCity + "&limit=1&appid=" + apiKey)
        .then(function (response) {
            if (response.ok) {
                response.json().then (function (data){
                    //storing lat and lon values
                    var cityLat = data[0].lat;
                    var cityLon = data[0].lon;
                     //ensures that the string of the city name has a capital letter to begin with then lowercase    
                    var city = searchCity.charAt(0).toUpperCase() + searchCity.toLowerCase().slice(1);

                    //checks localstorage to see if city is already present
                    if (!localStorage.getItem(city)) {
                        localStorage.setItem(city, cityLat + "," + cityLon);
                        var searchItem = document.createElement("button");
                        searchItem.textContent = city;
                        searchItem.classList.add("btn");
                        searchItem.classList.add("btn-outline-primary");
                        searchHistory.append(searchItem);
                        var linebreak = document.createElement("br");
                        searchHistory.append(linebreak);

                        //adds event listener to created element
                        searchItem.addEventListener("click", getCoordinates);
                    }
                    weatherCoordinates(city, cityLat, cityLon);
                })
            }
        })
    }
}

function getStorage () {
    for (var i = 0; i < localStorage.length; i++) {
        //creates element for each storage item
        var searchItem = document.createElement("button");
        var cityName = localStorage.key(i);
        var split = localStorage.getItem(cityName).split(",");
        var cityLat = split[0];
        var cityLon = split[1];

        //city name search button
        searchItem.textContent = cityName;
        searchItem.classList.add("btn");
        searchItem.classList.add("btn-outline-primary");
        searchHistory.append(searchItem);

        var linebreak = document.createElement("br");
        searchHistory.append(linebreak);


        searchItem.addEventListener("click", getCoordinates);
    }
}

function getCoordinates () {
    //getting the coordinate values (lat and long) from localStorage then passing them to weatherCoordinates
    var city = this.textContent;
    var split = localStorage.getItem(city).split(",");
    var cityLat = split[0];
    var cityLon = split[1];
    weatherCoordinates(city, cityLat, cityLon);
}

function weatherCoordinates (city, cityLat, cityLon) {
    //clears previous city's forecast if present
    clearElements();

    //fetch for openweather API for coordinates (lat and lon)
        fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + cityLat + "&lon=" +cityLon + "&units=imperial&appid=" + apiKey)
            .then(function (response) {
                    if (response.ok) {
                        response.json().then (function (data) {
                            var forecastweekly = [];
                            var currentWeather;
                                for (let i = 0; i < data.list.length; i++) {
                                    if (i === 0) {
                                        currentWeather = data.list[i];
                                    } else if ((i + 1) % 8 === 0) {
                                        forecastweekly.push(data.list[i]);
                                    }
                                }
                            
                            var currentWeatherIcon = currentWeather.weather[0].icon;
                            var currentWeatherIconURL = "http://openweathermap.org/img/w/"+ currentWeatherIcon + ".png";
                            currentIcon.src = currentWeatherIconURL;
                            currentIcon.setAttribute = ("alt", "Weather Icon");

                             // on html, these variables will create elements on html
                            currentHeader.textContent = city + " " + currentWeather.dt_txt.slice(0, 10);
                            currentTemp.textContent = "Temperature: " + currentWeather.main.temp + "°F";
                            currentWind.textContent = "Wind: " + currentWeather.wind.gust + " mph";
                            currentHumid.textContent = "Humidity: " + currentWeather.main.humidity;
                            
                            //header for weekly forecast
                            var forecastHeader = document.createElement("h2");
                            forecastHeader.textContent = "Five Day Forecast for " + city;
                            fiveDayContainer.append(forecastHeader);

                            //loops through each day and creates an element listing forecast for each
                            for (i = 0; i < forecastweekly.length; i++) {
                               
                                var div = document.createElement("div");
                                fiveDayContainer.append(div);

                                //API weather icon
                                var weatherIcon = forecastweekly[i].weather[0].icon;
                                div.classList.add("forecast");
                                div.classList.add("col-2");
                                div.classList.add("m-1");
                                div.classList.add("rounded");
                                var icon = document.createElement("img");
                                icon.src = ("http://openweathermap.org/img/w/" + weatherIcon + ".png");
                                icon.setAttribute = ("alt", "weather icon");

                                var date = forecastweekly[i].dt_txt.slice(0, 10);
                                var temp = forecastweekly[i].main.temp + "°F";
                                var wind = forecastweekly[i].wind.gust + "mph";
                                var humidity = forecastweekly[i].main.humidity;
                                div.innerHTML = date + "<br>" + "Temp: " + temp + "<br>" + "Wind: " + wind + "<br>" + "Humidity: " + humidity + "<br>";
                                div.append(icon);
                                }
                            })
                        }
                    })
}

function clearStorage() {
    //clears localStorage and removes the elements
    localStorage.clear();
    while (searchHistory.lastChild) {
        searchHistory.removeChild(searchHistory.lastChild);
    }
}

getStorage();

document.getElementById("search-btn").addEventListener("click", getSearchEngine);
document.getElementById("clear-btn").addEventListener("click", clearStorage);