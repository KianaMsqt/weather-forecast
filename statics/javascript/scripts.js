$(document).ready(function() {
    var apiKey = "52a07063d5727308908d9b356e188a05";
    var $searchForm = $("#search-form");
  
    $searchForm.on("submit", function(event) {
      event.preventDefault();
      var $searchInput = $("#search-input");
  
      if ($searchInput.val().trim() === "") {
        alert("Please enter a search term.");
        return;
      }
  
      var inputQuery = $searchInput.val().trim();
      var geoQueryURL =
        "https://api.openweathermap.org/geo/1.0/direct?q=" +
        inputQuery +
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
  
          for (var i = 0; i < 5; i++) {
            var date = forecastData.list[i].dt_txt;
            var iconUrl =
              "https://openweathermap.org/img/w/" +
              forecastData.list[i].weather[0].icon +
              ".png";
            var temperature = forecastData.list[i].main.temp;
            var humidity = forecastData.list[i].main.humidity;
            var windSpeed = forecastData.list[i].wind.speed;
  
            // Create a new HTML element for each day of the forecast
            var $forecastItem = $("<div>").addClass("forecast-item");
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

            // Display the temperature on the page
            $('#today').text("Today's temperature is " + todayTemp + " degrees Celsius.");

          }
        });
      });
    });
  });
  