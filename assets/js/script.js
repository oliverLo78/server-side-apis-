// DOM element references
var submitFormEl = document.querySelector('#submit');
var cityButtonsEl = document.querySelector('#city-buttons');
var nameInputEl = document.getElementById('city-name');
var cityContainerEl = document.getElementById('city-container');
var cityForecastEl = document.getElementById('city-forecast');

// Global variables
let lat, lon, search, city;

// search history as an empty array
var searchHistoryArray = JSON.parse(localStorage.getItem('cities')) || [];

// Show the date and time
document.getElementById('currentDay').textContent = moment().format('MMMM Do YYYY, h:mm:ss a');

// Weather API root URL and API key
const rootUrl = "https://api.openweathermap.org";
const apikey = "c8b076f9b5907107d146b0c7b6c59d90";

// Function to render search history
function renderSearchHistory() {
  // TODO: Retrieve the city and forecast and render it to the page
  var nameInput = localStorage.getItem("city-name");
  var cityButtons = localStorage.getItem("city-buttons");
  if (!nameInput || !cityButtons) {
    return;
  } 
  // get the city and forecast from local storage and render it to the page
  nameInputEl.textContent = nameInput;

}

// Fetch coordinates
function fetchCoords(search) {
  if (!search) return;
  fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=1&appid=${apikey}`)
    .then(response => response.json())
    .then(data => {
      if (data.length) {
        lat = data[0].lat;
        lon = data[0].lon;
        fetchWeather(lat, lon);
        if (!searchHistoryArray.includes(search)) {
          searchHistoryArray.push(search);
          localStorage.setItem('cities', JSON.stringify(searchHistoryArray));
          renderSearchHistory();
        }
      }
    }).catch(error => console.error('Fetching coordinates failed:', error));
}

// Fetch weather data
function fetchWeather(lat, lon) {
  fetch(`${rootUrl}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=imperial`)
    .then(response => response.json())
    .then(data => {
      console.log(data); // Log data for debugging
      renderCurrentWeather(data);
    }).catch(error => console.error('Fetching weather data failed:', error));
}

// Function to display current weather
function renderCurrentWeather(weather) {
  const temp = weather.main.temp;
  const wind = weather.wind.speed;
  const humidity = weather.main.humidity;
  const city = weather.name;
  const clouds = weather.weather[0].description;

  const cityInfo = `City: ${city} - Temp: ${temp}°F, Wind: ${wind} MPH, Humidity: ${humidity}%, Conditions: ${clouds}`;
  cityContainerEl.textContent = cityInfo;
}

// Initial function to load search history from localStorage
function initSearchHistory() {
  renderSearchHistory();
}

// Event listener for city input form submission
submitFormEl.addEventListener("click", function(event) {
  event.preventDefault();

  var city = document.querySelector("#city-name").value;

  if (cityButtonsEl.textContent === "") {
    cityButtonsEl.textContent = cityButtons;
    localStorage.setItem("city-name", city);
    var cityButtons = localStorage.getItem("city-buttons");
  }
});

// Event listener for form submission
submitFormEl.addEventListener('submit', function(event) {
  event.preventDefault();
  var city = nameInputEl.value.trim();
  if (city) {
    fetchCoords(city);
    nameInputEl.value = '';
  }
});

document.addEventListener('DOMContentLoaded', initSearchHistory);
