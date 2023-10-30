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
    $(".searchHistory").append(listItem);
}



apiKey = "1ebabe5e0798007005faf526f4d4fa9b";

function forecastFunction(searchEngine) {
    $.ajax({
        type:"GET",
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchEngine + "&appid=" + apiKey,

    }).then(function(data) {
    });

}