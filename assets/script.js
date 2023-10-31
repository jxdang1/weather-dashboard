$(document).ready(function() {
    //created search button feature to search cities
    $("#search-btn").on("click", function(){
        //get value in from search-text input
        var searchEngine = $("#search-text").val();
        //created an empty value input field
        $("#search-text").val("");
        forecastFunction(searchEngine);
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
 var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

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



apiKey = "1ebabe5e0798007005faf526f4d4fa9b";

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
        var imageEl = $("<img>").attr("src", "https://openweathermap.org/img/w/" + dataweather[0].icon + ".png");


        var card = $("<div>").addClass("card");
        var cardBody = $("<div>").addClass("card-body");


        var windEl = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
        var humidityEl = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + " %");
        var tempEl = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " K");

        var longEl = data.coord.longEl;
        var latEl = data.coord.latEl;

        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + latEl + "&lon=" + longEl,

        }).then(function (reponse) {
            console.log(response);
        })

        titleEl.append(img);
        cardBody.appent(titleEl, tempEl, humidityEl, windEl);
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
            $("#weather-forecast").html("h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");

        })
    }

