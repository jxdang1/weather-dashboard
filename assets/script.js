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
                            }
            }    
   