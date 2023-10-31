apiKey = "1ebabe5e0798007005faf526f4d4fa9b";

$(document).ready(function() {
    //created search button feature to search cities
    $("#search-btn").on("click", function(){
        //get value in from search-text input
        var searchEngine = $("#search-text").val();
        //created an empty value input field
        $("#search-text").val("");
        forecastFunction(searchEngine);
        weatherFunction(searchEngine);
    })
})

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

        var titleEl = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")" );
        var imageEl = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");


        var card = $("<div>").addClass("card");
        var cardBody = $("<div>").addClass("card-body");
        var windEl = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
        var humidityEl = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + " %");
        var tempEl = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " K");

        var long = data.coord.lon;
        var lat = data.coord.lat;
        //console.log(data.coord);

        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + lat + "&lon=" + long,

        }).then(function (response) {
            console.log(response);
        })

        titleEl.append(imageEl);
        cardBody.append(titleEl, tempEl, humidityEl, windEl);
        card.append(cardBody);
        $("#currentDay").append(card);
        console.log(data);
    });

}

    function weatherFunction(searchEngine) {
        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + searchEngine + "&appid=" + apiKey + "&units=imperial",

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

