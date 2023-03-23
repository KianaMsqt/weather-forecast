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
            var $city = $('<h2 style="text-transform: capitalize">' + inputQuery + "  " + date + '</h2>');
            var $todayTemp = $("<strong>Temp: </strong>" + todayTemp + " °C <br />");
            var $todayWind = $("<strong>Wind: </strong>" + todayWind + " KPH <br />");
            var $todayHumidity = $("<strong>Humidity: </strong>" + todayHumidity + "% <br />");
            var $todayIcon = $( `<img class="today-icon" src="` + todayIcon + `" alt="icon" />` );

            $('#today').removeClass( "empty" ).empty().append($city, $todayIcon, $todayTemp, $todayWind, $todayHumidity);            

          }
        });
      });
    });
  });
  