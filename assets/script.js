apiKey = "1ebabe5e0798007005faf526f4d4fa9b";

var currentDayContainer = document.getElementById("current-day");
var fiveForecastContainer = document.getElementById("five-forecast");
var searchHistory = document.getElementById("search-history");
var currentHeader = document.getElementById("current-header");
var currentTempEl = document.getElementById("temp");
var currentWindEl = document.getElementById("wind");
var currentHumidEl = document.getElementById("humid");
var currentIconEl = document.getElementById("icon");


function clearElements() {
    while (fiveForecastContainer.lastChild) {
        fiveForecastContainer.removeChild(fiveForecastContainer.lastChild);
    }
}

function searchEngine() {
    //created search button feature to search cities
    var citySelection = document.getElementById("search-text").value;
        //get value in from search-text input
    if (citySelection) {
        fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + citySelection + "&limit=1&appid=" + apiKey)
        .then(function (response) {
            if (response.ok) {
                response.json().then (function (data) {
                    var lat = data[0].lat;
                    var long = data[0].lon;
                    
                    var cityName = citySelection.charAt(0).toUpperCase() + citySelection.toLowerCase().slice(1);

                    if (!localStorage.getItem(cityName)) {
                        localStorage.setItem(cityName, lat + "," + long);
                        var itemSearch = document.createElement("button");
                        itemSearch.textContent = city;
                        itemSearch.classList.add("btn");
                        itemSearch.classList.add("btn-outline-primary");

                        itemHistory.append(itemSearch);

                        var linebreak = document.createElement("br");
                        itemHistory.append(linebreak);
                    }

                        searchItem.addEventListener("click", getCoordinates);
                    })
                }
            })
        }
    }
    
        function getCoordinates() {
                    //getting the lat and lon values from localStorage then passing them to weatherFromLatLon
                var city = this.textContent;
                var split = localStorage.getItem(city).split(",");
                var lat = split[0];
                var long = split[1];
                weatherFromLatLon(city, lat, long);

        }


        function weatherFromLatLon (city, lat, long) {
            clearElements();
                 fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + long + "&units=imperial&appid=" + apiKey)
                .then(function (response) {
                        if (response.ok) {
                            response.json().then (function (data) {
                                var upcomingForecast = [];
                                 var currentWeather;
                                     for (let i = 0; i < data.list.length; i++) {
                                            if (i === 0) {
                                            currentWeather = data.list[i];
                                         } else if ((i + 1) % 8 === 0) {
                                        upcomingForecast.push(data.list[i]);
                                }
                            }

                        //changes text content for the current weather container elements
                        var currentWeatherIcon = currentWeather.weather[0].icon;
                        var currentWeatherIconURL = "http://openweathermap.org/img/w/"+ currentWeatherIcon + ".png";
                        currentIconEl.src = currentWeatherIconURL;
                        currentIconEl.setAttribute = ("alt", "Weather Icon");
                        currentHeader.textContent = city + " " + currentWeather.dt_txt.slice(0, 10);
                        currentTempEl.textContent = "Temperature: " + currentWeather.main.temp + "°F";
                        currentWindEl.textContent = "Wind: " + currentWeather.wind.gust + " mph";
                        currentHumidEl.textContent = "Humidity: " + currentWeather.main.humidity;
          
                        //creates header for five day forecast
                        var forecastHeader = document.createElement("h2");
                        forecastHeader.textContent = "Five Day Forecast for " + city;
                        fiveForecastContainer.append(forecastHeader);

                        //loops through each day and creates an element listing forecast for each
                        for (i = 0; i < forecast5Days.length; i++) {
                            //creates a div for each day's forecast
                            var div = document.createElement("div");
                            fiveForecastContainer.append(div);
                            //weather icon url from API
                            var weatherIcon = forecast5Days[i].weather[0].icon;
                            //adding my css
                            div.classList.add("forecast");
                            //adding bootstrap classes
                            div.classList.add("col-2");
                            div.classList.add("m-1");
                            div.classList.add("rounded");
                            var icon = document.createElement("img");
                            //adding img url
                            icon.src = ("http://openweathermap.org/img/w/" + weatherIcon + ".png");
                            icon.setAttribute = ("alt", "weather icon");
                            //created variables to hold each value for readbility
                            var date = forecast5Days[i].dt_txt.slice(0, 10);
                            var temp = forecast5Days[i].main.temp + "°F";
                            var wind = forecast5Days[i].wind.gust + "mph";
                            var humidity = forecast5Days[i].main.humidity;
                            div.innerHTML = date + "<br>" + "Temp: " + temp + "<br>" + "Wind: " + wind + "<br>" + "Humidity: " + humidity + "<br>";
                            div.append(icon);
                        }
                    })
                }
            })
}

            function getStorage () {
                for (var i = 0; i < localStorage.length; i++) {
                    //creates element for each storage item
                    var searchItem = document.createElement("button");
                    var cityName = localStorage.key(i);
                    var split = localStorage.getItem(cityName).split(",");
                    var lat = split[0];
                    var long = split[1];

                    //adds city's name to button
                    searchItem.textContent = cityName;
                    //button bootstrap classes
                    searchItem.classList.add("btn");
                    searchItem.classList.add("btn-outline-primary");
                    searchHistory.append(searchItem);
                    //linebreak so they don't all appear on one line
                    var linebreak = document.createElement("br");
                    searchHistory.append(linebreak);

                    //adds an event listener to each one
                    searchItem.addEventListener("click", getLatLon);
                }
            }

            function clearStorage() {
                //clears localStorage and removes the elements
                localStorage.clear();
                while (searchHistory.lastChild) {
                    searchHistory.removeChild(searchHistory.lastChild);
                }
            }

            getStorage();

            document.getElementById("search-btn").addEventListener("click", getSearchValue);
            document.getElementById("clear-btn").addEventListener("click", clearStorage);