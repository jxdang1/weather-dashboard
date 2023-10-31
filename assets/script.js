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
                response.json().then (function (data){
                    var long = data.coord.lon;
                    var lat = data.coord.lat;
                    //console.log(data.coord);
                        
                        var uvResponse = response.value;
                        var uvIndex = $("<p>").addClass("card-text").text("UV Index: ");
                        var btn = $("<span>").addClass("btn btn-sm").text(uvResponse);
            
            
                    if (uvResponse < 3) {
                      btn.addClass("btn-success");
                    } else if (uvResponse < 7) {
                      btn.addClass("btn-warning");
                    } else {
                      btn.addClass("btn-danger");
                    }
            
                    cardBody.append(uvIndex);
                    $("#currentDay .card-body").append(uvIndex.append(btn));
            
                  });
            
            
                    titleEl.append(imageEl);
                    cardBody.append(titleEl, tempEl, humidityEl, windEl);
                    card.append(cardBody);
                    $("#currentDay").append(card);
                    console.log(data);
                });
            
            }
    }
        //created an empty value input field
    
    $("#search-btn").keypress(function(event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode === 13) {
            forecastFunction(searchEngine);
            weatherFunction(searchEngine);

        }
    });


//be able to pull previous searches from local storage
 var searchHistory = JSON.parse(localStorage.getItem("history")) || [];

if (searchHistory.length > 0) {
    forecastFunction(searchHistory[searchHistory.length - 1]);
}

//for loop that creates a row for each element is in the history array when searching places (searchHistory)
for (var i = 0; i < searchHistory.length; i++) {
    newRow(searchHistory[i]);
}

// created a function that puts cities underneath each other the previous searched city
function newRow(text) {
    var listItem = $("<li>").addClass("list-group-item").text(text);
    $(".search-history").append(listItem);
}

    $(".search-history").on("click", "li", function() {
        forecastFunction($(this).text());
        weatherFunction($(this).text());
    });




function forecastFunction(searchEngine) {
    $.ajax({
        type:"GET",
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchEngine + "&appid=" + apiKey,

    }).then(function(data) {
        if (searchHistory.indexOf(searchEngine) === -1) {

            searchHistory.push(searchEngine);

            localStorage.setItem("history", JSON.stringify(searchHistory));
            newRow(searchEngine);
        }

        $("#currentDay").empty();



    function weatherFunction(searchEngine) {
        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + long + "&units=imperial&appid=" + apiKey,

        }).then(function (data) {
            console.log(data);
            $("#weather-forecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");

            for (var i = 0; i < data.list.length; i++) {
                if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {

                    var cardTitleEl = $("<h3>").addClass("card-title").text(new Date(data.list[i].dt_text).toLocaleDateString());
                    var cardImgEl = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
                    var colFiveEl = $("<div>").addClass("col-md-2.5");
                    var cardFiveEl = $("<div>").addClass("card bg-blue text-white");
                    var cardBodyFiveEl = $("<div>").addClass("card-body p-2");
                    var humidityFiveEl = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");
                    var tempFiveEl = $("<p>").addClass("card-text").text("Temperature: " + data.list[i].main.temp + " °F");


                    colFiveEl.append(cardFiveEl.append(cardBodyFiveEl.append(cardTitleEl, cardImgEl, tempFiveEl, humidityFiveEl)));

                    $("#weather-forecast .row").append(colFiveEl);

                }

            }
        })
    }

