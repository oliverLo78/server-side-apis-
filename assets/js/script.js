// Global variables
let lat;
let lon;
let search;

// search history as an empty array
var searchHistoryArray = [];

// show the date and time
var today = moment().format('MMMM Do YYYY, h:mm:ss a');
$('#currentDay').text(today);

// weather api root url
var rootUrl = "https://api.openweathermap.org";

// api key
var apikey = "c8b076f9b5907107d146b0c7b6c59d90";

// DOM element references
var cityNameEl = $('#city-name');
var searchBtnEl = $('#search-btn');
var cityBoxEl = document.getElementById('city-box');
var buttonContainer = document.getElementById('button-container');
var fetchButton = document.getElementById('fetch-button');

// Function to add a button below the search button and create a search history cities list of buttons.
function renderSearchHistory() {
  var apiURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + search + '&appid=' + apikey;
    
  fetch(apiURL).then(function(response) {
    if (response.ok) {
      response.json().then(function(data) {
        displayWeatherCitiesBtn(data, search);
      });
    }
  });
}

var displayWeatherCitiesBtn = function(data, search) {
  // create a button for the city
  var cityBtn = document.createElement('button');
  cityBtn.textContent = search;
  cityBtn.classList.add('btn', 'btn-secondary', 'btn-lg', 'btn-block', 'city-btn');
  cityBtn.setAttribute('type', 'button');
  cityBtn.setAttribute('data-city', search);
  buttonContainer.append(cityBtn);
};
  // empty the search history container
    $('#city-name').empty();
    // get the search history array from local storage
    searchHistoryArray = JSON.parse(localStorage.getItem('cities'));
    // if the search history array is null, set it to an empty array
    if (searchHistoryArray === null) {
      searchHistoryArray = [];
    }
    // loop through the history array creating a button for each item
    for (var i = 0; i < searchHistoryArray.length; i++) {  
      var cityBtn = document.createElement('button');
      city.textContent = searchHistoryArray[i].city;
      buttonContainer.append(cityBtn);      
    }
  

// Function to update history in local storage then updates displayed history.
// function appendToHistory(search) {
    // push search term into search history array
    // for (let i = 0; i < searchHistoryArray.length; i++) {
    //   const history = searchHistory[i];
    //   if (history == search) {
    //     return;
    //   }
    // }
    // push search term into search history array
  //   searchHistoryArray.push(search);
  //   // set search history array to local storage
  //   // searchHistoryArray = localStorage.getItem()
  //   localStorage.setItem('cities', JSON.stringify(searchHistoryArray));
    
  //   renderSearchHistory();
  // }


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
    var wind = weather.wind;
    var humidity = weather.humidity;
    var clouds = weather.clouds;

    //convert time to date
    var date = new Date(weather.sunrise*1000);
    date = date.toLocaleDateString('en-US');

    // ☀️🌤️⛅☁️
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
    var cityDateEl = $('<h3></h3>').text('City: '+city+' ('+date+') '+clouds);
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
    var wind = forecast.wind;
    var humidity = forecast.humidity;
    var clouds = forecast.clouds;

    // Create elements for a card
    var dateEl = $('<h4></h4').text(date);
    var cloudsEl = $('<div></div>').textContent(clouds);
    var tempEl = $('<div></div>').text('Temp: '+temp+ '°F');
    var windEl = $('<div></div').text('Wind: '+wind+ 'MPH');
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
    
    var cardEl = $("<div class='card'</div>")

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
    // fetch, using the api url, .then that returns the response as json, .then that calls renderItems(city, data)
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=imperial`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      // appendToHistory(city);
      var name = document.createElement('h2')
      name.textContent = 'City: ' + data.name
      
      var temp = document.createElement('h2')
      temp.textContent = 'Temperature: ' + data.main.temp 

      var wind = document.createElement('h2')
      wind.textContent = 'Wind: ' + data.wind.speed

      var humidity = document.createElement('h2')
      humidity.textContent = 'Humidity: ' + data.main.humidity

      document.querySelector('#city-box').append(name, temp, wind, humidity)
    });
  }
  
  function fetchCoords(search) {
    if (!search) {
      return;
    }

    // variable for you api url
    var geoUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=';

    // fetch with your url, .then that returns the response in json, .then that does 2 things - calls appendToHistory(search), calls fetchWeather(the data)
    // fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=5&appid=${apikey}`)
    fetch(`${geoUrl}${search}&limit=5&appid=${apikey}`)
    .then(function (response) {
      return response.json();
    })
    .then(function(data) {
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        var cityName = document.createElement('h3');
        cityName = textContent = data[i].name.state;
        cityBoxEl.append(cityName);
      }
      lat = data[0].lat;
      lon = data[0].lon;
      fetchWeather(lat, lon);
  });
}

  // function hideContent() {
  //   $('.cardRow').empty();
  //   $('.city-box').empty();
  // }
  
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

 