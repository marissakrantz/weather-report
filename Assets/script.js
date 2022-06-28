var searchFieldEl = $('#city-input')
var displayWeather = $("#display-weather");
var searchButton = $("#search")
var apiKey = "3349e614f03a74196197f9c86db13c0c";

function generateIconUrl(iconCode){
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
}

function createCityList(citySearchList) {
  $("#city-list").empty();

  var keys = Object.keys(citySearchList);
  for (var i = 0; i < keys.length; i++) {
    var cityListEntry = $("<button>");
    cityListEntry.addClass("list-group-item list-group-item-action");

    var splitStr = keys[i].toLowerCase().split(" ");
    for (var j = 0; j < splitStr.length; j++) {
      splitStr[j] =
        splitStr[j].charAt(0).toUpperCase() + splitStr[j].substring(1);
    }
    var titleCasedCity = splitStr.join(" ");
    cityListEntry.text(titleCasedCity);

    $("#city-list").append(cityListEntry);
  }
}; 

function populateCityWeather(city, citySearchList) {
  createCityList(citySearchList);

  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?&units=metric&appid=" + apiKey + "&q=" +
    city;

  var queryURL2 =
    "https://api.openweathermap.org/data/2.5/forecast?&units=metric&appid=" + apiKey + "&q=" +
    city;

  var latitude;

  var longitude;

  $.ajax({
    url: queryURL,
    method: "GET"
  })
    // Store all of the retrieved data inside of an object called "weather"
    .then(function(weather) {
      // Log the queryURL
      console.log(queryURL);
     
      // Log the resulting object
      console.log(weather);

      var nowMoment = moment();

      console.log(weather.status);

      if (queryURL.status == 200) {
        alert("This is not a valid City");
        return;

      } else {

      var displayMoment = $("<h3>");
      $("#city-name").empty();
      $("#city-name").append(
        displayMoment.text("(" + nowMoment.format("D/M/YYYY") + ")")
      );

      var cityName = $("<h3>").text(weather.name);
      $("#city-name").prepend(cityName);

      var weatherIcon = $("<img>");
      weatherIcon.attr(
        "src",
        "https://openweathermap.org/img/w/" + weather.weather[0].icon + ".png"
      );
      $("#current-icon").empty();
      $("#current-icon").append(weatherIcon);

      $("#current-temp").text("Temperature: " + weather.main.temp + " °C");
      $("#current-humidity").text("Humidity: " + weather.main.humidity + "%");
      $("#current-wind").text("Wind Speed: " + weather.wind.speed + " km/h");

      latitude = weather.coord.lat;
      longitude = weather.coord.lon;

      var queryURL3 =
        "https://api.openweathermap.org/data/2.5/uvi/forecast?&units=metric&appid=" + apiKey + "&q=" +
        "&lat=" +
        latitude +
        "&lon=" +
        longitude;

      $.ajax({
        url: queryURL3,
        method: "GET"
        // Store all of the retrieved data inside of an object called "uvResponse"
      }).then(function(uvResponse) {
        console.log(uvResponse);
        var uvIndex = uvResponse[0].value;
        
        var uvIndexDisplay = $("<button>");
        
        var bgColor;
            if (uvIndex <= 3) {
                bgColor = "green";
            }
            else if (uvIndex > 3 && uvIndex <= 6) {
                bgColor = "yellow";
            }
            else if (uvIndex > 6 && uvIndex <= 9) {
                bgColor = "orange";
            }
            else {
                bgColor = "red";
            }
        
        uvIndexDisplay.addClass("btn btn-custom");
        uvIndexDisplay.attr("style", ("background-color:" + bgColor));
        $("#current-uv").text("UV Index: ");
        $("#current-uv").append(uvIndexDisplay.text(uvIndex));
        

        $.ajax({
          url: queryURL2,
          method: "GET"
          // Store all of the retrieved data inside of an object called "forecast"
        }).then(function(forecast) {
          console.log(queryURL2);

          console.log(forecast);
          // Loop through the forecast list array and display a single forecast entry/time (5th entry of each day which is close to the highest temp/time of the day) from each of the 5 days
          for (var i = 6; i < forecast.list.length; i += 8) {
            // 6, 14, 22, 30, 38
            var forecastDate = $("<h5>");

            var forecastPosition = (i + 2) / 8;

            console.log("#forecast-date" + forecastPosition);

            $("#forecast-date" + forecastPosition).empty();
            $("#forecast-date" + forecastPosition).append(
              forecastDate.text(nowMoment.add(1, "days").format("D/M/YYYY"))
            );

            var forecastIcon = $("<img>");
            forecastIcon.attr(
              "src",
              "https://openweathermap.org/img/w/" +
                forecast.list[i].weather[0].icon +
                ".png"
            );

            $("#forecast-icon" + forecastPosition).empty();
            $("#forecast-icon" + forecastPosition).append(forecastIcon);

            console.log(forecast.list[i].weather[0].icon);

            $("#forecast-temp" + forecastPosition).text(
              "Temp: " + forecast.list[i].main.temp + " °C"
            );
            $("#forecast-humidity" + forecastPosition).text(
              "Humidity: " + forecast.list[i].main.humidity + "%"
            );
            $("#forecast-windspeed" + forecastPosition).text(
              "Wind Speed: " + forecast.list[i].wind.speed + " km/h"
            );

            $(".forecast").attr(
              "style",
              "background-color:rgb(24, 170, 255); color:white"
            );
          }
        });
      });
    }});
}

