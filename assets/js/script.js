// Global variables
let lat;
let lon;
let search;

// search history as an empty array
var searchHistoryArray = [];

// weather api root url
var rootUrl = "https://api.openweathermap.org";

// api key
var apikey = "ddb2db296ec9741f3edaa08b1a8a7ef1";

// DOM element references
var cityInput = $('#city-name');
var weather = $('.city-box');
var forecast = $('.fday-header');

// search form
// search input
// container/section for today's weather
// container/section for the forecast 
// search history container

// Function to display the search history list.
function renderSearchHistory() {
    // empty the search history container
    $('.strdButton').remove();
    // loop through the history array creating a button for each item
    for (var i = 0; i < searchHistoryArray.length; i++) {
        const element = searchHistoryArray[i];
        
        var srchBtnEl = $('<button class="srchButton strdButton"></button>').text(element); 
        // append to the search history container
        $('.search').append(srchBtnEl);

    }
      
  }
  
// Function to update history in local storage then updates displayed history.
function appendToHistory(search) {
    // push search term into search history array
    for (let i = 0; i < searchHistoryArray.length; i++) {
      const history = searchHistory[i];
      if (history == search) {
        return;
      }
    }
    // push search term into search history array
    searchHistoryArray.push(search);
    // set search history array to local storage
    // searchHistoryArray = localStorage.getItem()
    localStorage.setItem('cities', JSON.stringify(searchHistoryArray));
    
    renderSearchHistory();
  }


// Function to get search history from local storage
function initSearchHistory() {
    // get search history item from local storage
    // if (localStorage.getItem('cities') !== null) {
      // searchHistoryArray = JSON.parse(localStorage.getItem(cities));
      //    }
      //    else {
      //       localStorage.setItem('cities', JSON.stringify(searchHistoryArray));
      //    }

    // set search history array equal to what you got from local storage
renderSearchHistory();
}

  // Function to display the CURRENT weather data fetched from OpenWeather api.
  function renderCurrentWeather(city, weather) {
    // Store response data from our fetch request in variables
    // temperature, wind speed, etc.
    var temp = weather.temp;
    var wind = weather.windSpeed;
    var humidity = weather.humidity;
    var clouds = weather.clouds;

    //convert time to date
    var date = new Date(weather.sunrise*1000);
    date = date.toLocaleDateString('en-US');
    //☀️🌤️⛅☁️
    if (clouds>50) {
        clouds="☁️";
        } else if(clouds>30) {
        clouds="⛅";
        } else if(clouds>10) {
        clouds="🌤️";
        } else {
        clouds="☀️";
        }
  
    // document.create the elements you'll want to put this information in  
    var cityDateEl = $('<h3></h3>').text(city+' ('+date+') '+clouds);
    var tempEl = $('<div></div>').text('Temp: '+temp+'°F');
    var windEl = $('<div></div>').text('Wind: '+wind+' MPH');
    var humidityEl = $('<div></div>').text('Humidity: '+humidity+'%');
    
    // append those elements somewhere
    $('.city-box').append(cityDateEl, tempEl, windEl, humidityEl);    
    // give them their appropriate content
  
  }
  
  // Function to display a FORECAST card given an object (from our renderForecast function) from open weather api
  // daily forecast.
  function renderForecastCard(forecast) {
    // variables for data from api
    // temp, windspeed, etc.
    var temp = forecast.temp.day;
    var wind = forecast.windSpeed;
    var humidity = forecast.humidity;
    var clouds = forecast.clouds;

    // Create elements for a card
    var dateEl = $('<h4></h4').text(date);
    var cloudsEl = $('<div></div>').text(clouds);
    var tempEl = $('<div></div>').text('Temp: '+wind+ '°F');
    var windEl = $('<div></div').text('Wind: '+wind+'MPH');
    var humidityEl = $('<div></div>').text('Humidity: '+humidity+'%');

    // Add content to elements
    var date = new Date(forecast.sunrise*1000)
    date = date.toLocaleDateString('en-US');
    
    //☀️🌤️⛅☁️
    if(clouds > 50) {
      clouds = '☁️';
    } else if (clouds > 30) {
      clouds = '⛅';
    } else if (clouds > 10) {
      clouds = '🌤️';
    } else {
      clouds = '☀️';
    }
    
    var cardEl = $("<div class=' card'</div>")

    // append
    $('.cardRow').append(cardEl);
    // append to forecast section
    $(cardEl).append(dateEl, cloudsEl, tempEl, windEl, humidityEl);
  }
  
  // Function to display 5 day forecast.
  function renderForecast(dailyForecast) {
  // set up elements for this section

  // append
  
  // loop over dailyForecast
  
    for (var i = 1; i < dailyForecast.length; i++) {
  
      // send the data to our renderForecast function as an argument
          renderForecastCard(dailyForecast[i]);
    }
  }
  
  function renderItems(city, data) {
    renderCurrentWeather(city, data.list[0]);
    renderForecast(data.list);
  }
  
  // Fetches weather data for given location from the Weather Geolocation
  // endpoint; then, calls functions to display current and forecast weather data.
  function fetchWeather(lat,lon) {
    // variables of longitude, latitude, city name - coming from location
    // let latitude = location[0].lat;
    // let longitude = location[0].lon;
    // let cityNameEl = location[0].name;
    // api url
    
    // fetch, using the api url, .then that returns the response as json, .then that calls renderItems(city, data)
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=imperial`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      // renderItems(city,data);
      // appendToHistory(city);
      var temp = document.createElement('h2')
      temp.textContent = 'temp: ' + data.main.temp   
      var humidity = document.createElement('h2')
      humidity.textContent = 'humidity: ' + data.main.humidity


      document.querySelector('.city-box').append(temp, humidity)
    });
  }
  
  function fetchCoords(search) {
    if (!search) {
      console.error('Search query is empty');
      return;
    }

    // variable for you api url
    let geoUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=';

    // fetch with your url, .then that returns the response in json, .then that does 2 things - calls appendToHistory(search), calls fetchWeather(the data)
    // fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=5&appid=${apikey}`)
    fetch(`${geoUrl}${search}&limit=5&appid=${apikey}`)
    .then(function (response) {
      return response.json();
    })
    .then(function(data) {
      console.log(data);
      lat = data[0].lat;
      lon = data[0].lon;
      fetchWeather(lat, lon);
  });
}

  function hideContent() {
    $('.cardRow').empty();
    $('.city-box').empty();
  }
  
  function handleSearchFormSubmit(e) {
    var searchInput = document.querySelector('#city-name');
    // Don't continue if there is nothing in the search form
    console.log('You clicked button.');
    if (!searchInput.value) {
      return;
    }
  
    e.preventDefault();
    var search = searchInput.value.trim();
    fetchCoords(search);
    searchInput.value = '';
  }
  
  function handleSearchHistoryClick(e) {
    // grab whatever city is is they clicked
    e.preventDefault();
    var searchInput = document.querySelector('#city-name');
    var search = searchInput.value.trim();
    fetchCoords(search);
}
  
  initSearchHistory();
  // click event to run the handleFormSubmit 
  $('#srchBtn').on('click', handleSearchFormSubmit);

  // click event to run the handleSearchHistoryClick
  $(document).on('click', handleSearchHistoryClick);
