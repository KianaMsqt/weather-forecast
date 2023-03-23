$(document).ready(function() {
  
  var apiKey = "52a07063d5727308908d9b356e188a05";
  var $searchForm = $("#search-form");
  var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
  
  // Show search history on page load
  var $historyList = $("#history");

  // Clear the existing list items
  $historyList.empty();

  // Loop through the search history and add each item as a new list item
  for (var i = 0; i < searchHistory.length && i < 10; i++) {
    var $historyItem = $(`<li class="list-group-item">`).text(searchHistory[i]);
    $historyList.append($historyItem);
  }

  function updateSearchHistory(query) {
    // Remove the oldest search if the searchHistory array has more than 10 items
    if (searchHistory.length >= 10) {
      searchHistory.shift();
    }
  
    // Add the new search to the end of the searchHistory array
    searchHistory.push(query);
  
    // Update local storage with the updated searchHistory array
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  
    // Update the #history element with the updated searchHistory array
    var $historyList = $("#history ul");
    $historyList.empty(); // Clear the list before adding new items
  
    for (var i = 0; i < searchHistory.length; i++) {
      var $historyItem = $(`<li class="list-group-item">`).text(searchHistory[i]);
      $historyList.append($historyItem);
    }
  }

  var updateForecast = function(location) {

    var geoQueryURL =
      "https://api.openweathermap.org/geo/1.0/direct?q=" +
      location +
      "&limit=1&appid=" +
      apiKey;
  
    $.getJSON(geoQueryURL, function(geoData) {
      var lat = geoData[0].lat;
      var lon = geoData[0].lon;
      var forecastQueryURL =
        "https://api.openweathermap.org/data/2.5/forecast?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        apiKey;
  
      $.getJSON(forecastQueryURL, function(forecastData) {
        var $forecastContainer = $("#forecast");
        $forecastContainer.empty(); // Clear the container before adding new content
  
        $forecastContainer.append(`<h2 class="w-100 mb-3 mt-3 h3">5-Day Forecast:</h2>`);
  
        for (var i = 0; i < 5; i++) {
          
          // create a Date object in UTC time zone
          var date = new Date(forecastData.list[i].dt_txt + " UTC");
          // convert to local time zone
          date = date.toLocaleString("en-GB", { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
          // remove time from the formatted date
          date = date.split(',')[0];
  
          var iconUrl =
            "https://openweathermap.org/img/w/" +
            forecastData.list[i].weather[0].icon +
            ".png";
          var temperature = forecastData.list[i].main.temp;
          var humidity = forecastData.list[i].main.humidity;
          var windSpeed = forecastData.list[i].wind.speed;
  
          // Create a new HTML element for each day of the forecast
          var $forecastItem = $("<div>").addClass("forecast-item p-3 m-1 border rounded text-white bg-colored col-sm");
          var $date = $("<div>")
            .addClass("forecast-date")
            .text(date);
          var $icon = $("<img>")
            .addClass("forecast-icon")
            .attr("src", iconUrl);
          var $temperature = $("<div>")
            .addClass("forecast-temperature")
            .text("Temperature: " + temperature + " K");
          var $humidity = $("<div>")
            .addClass("forecast-humidity")
            .text("Humidity: " + humidity + "%");
          var $windSpeed = $("<div>")
            .addClass("forecast-wind-speed")
            .text("Wind speed: " + windSpeed + " m/s");
  
          // Add the new HTML elements to the container
          $forecastItem.append($date, $icon, $temperature, $humidity, $windSpeed);
          $forecastContainer.append($forecastItem);
  
          // Get the temperature for today's forecast (the first item in the response list)
          var todayTemp = forecastData.list[0].main.temp;
          var todayWind = forecastData.list[0].wind.speed;
          var todayHumidity = forecastData.list[0].main.humidity;
          var todayIcon = "https://openweathermap.org/img/w/" + forecastData.list[i].weather[0].icon + ".png";
  
          // Display today's temperature on the page
          var $city = $('<h2 style="text-transform: capitalize">' + location + "  " + date + '</h2>');
          var $todayTemp = $("<strong>Temp: </strong>" + todayTemp + " °C <br />");
          var $todayWind = $("<strong>Wind: </strong>" + todayWind + " KPH <br />");
          var $todayHumidity = $("<strong>Humidity: </strong>" + todayHumidity + "% <br />");
          var $todayIcon = $( `<img class="today-icon" src="` + todayIcon + `" alt="icon" />` );
  
          $('#today').removeClass( "empty" ).empty().append($city, $todayIcon, $todayTemp, $todayWind, $todayHumidity);                        
        }
      });
    });
  }

  $searchForm.on("submit", function(event) {
    event.preventDefault();
    var $searchInput = $("#search-input");
  
    if ($searchInput.val().trim() === "") {
      alert("Please enter a search term.");
      return;
    }
  
    var inputQuery = $searchInput.val().trim();
    updateForecast(inputQuery);
    updateSearchHistory(inputQuery);
  });

  // Update forecast on history items click event
  $("#history .list-group-item").on( "click", function() {
    var historyCity = $(this).text();
    updateForecast(historyCity);
    updateSearchHistory(historyCity);
  });

});
  