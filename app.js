window.addEventListener("load", () => {
  input.value=""
  getLocation();
  getRecentseacrchesFromlocalstorage();
});

const slides = document.querySelectorAll(".slide");
const leftbtn = document.querySelector(".leftbtn");
const rightbtn = document.querySelector(".rightbtn");
const input = document.querySelector(".input input");
const btn = document.querySelector(".search");
const icon = document.querySelector(".icon");
const temp = document.querySelector(".temp h3");
const cityname = document.querySelector(".cityname");
const leftdetails = document.querySelector(".sp");
const rightdetails = document.querySelector(".pp");
const closebtn = document.querySelector(".closebtn");
const menubtn = document.querySelector(".menubtn");
const nav = document.querySelector(".nav-right ul");
const navLinks = document.querySelectorAll(".nav-right ul li a");
const recentsearches = document.querySelector(".recentsearches");

const recentSearches = [];

function getRecentseacrchesFromlocalstorage() {
  const data = localStorage.getItem("citydata");
  if (data == null) return;
  const cities = JSON.parse(data);
  recentSearches.length = 0;
  recentSearches.push(...cities);

  cities.forEach((city) => {
    const span = document.createElement("span");
    span.textContent = city;
    

    span.addEventListener("click", function (e) {
      const city = e.target.textContent; 
      input.value = city; 
      getweather(input);
      storedatainlocalstorage()
    });
    recentsearches.appendChild(span)
  });
}

 function storedatainlocalstorage() {
  const value = input.value.trim();

  if (!value) return;
  const index = recentSearches.indexOf(value);
  if (index === -1) {
    recentSearches.unshift(value);
  } else {
    recentSearches.splice(index, 1);
    recentSearches.unshift(value);
  }
  if (recentSearches.length > 5) {
    recentSearches.pop();
  }
  
   localStorage.setItem("citydata",JSON.stringify(recentSearches) );
   recentsearches.innerHTML = ""; 
  getRecentseacrchesFromlocalstorage()
    
}

let userLat = null;
let userLon = null;

function getLocation() {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      userLat = position.coords.latitude;
      userLon = position.coords.longitude;
      getWeatherByLocation(userLat, userLon);
    },
    (error) => {
      console.log("Location access denied");
    }
  );
}

async function getWeatherByLocation(userLat, userLon) {
  const apiurl = `https://api.openweathermap.org/data/2.5/weather?lat=${userLat}&lon=${userLon}&units=metric&appid=c7b7cca425a13b40a2b9163d75804c38`;
  // https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

  const response = await fetch(apiurl);
  console.log(response);
  const data = await response.json();
  temp.textContent = data.main.temp + "° ";
  console.log(data);
  updateWeatherIcon(data.weather[0].main);
  leftdetails.textContent = data.main.humidity + "%";
  rightdetails.textContent = data.wind.speed + "km/h";
  cityname.textContent = data.name;
}

closebtn.addEventListener("click", function (e) {
  menubtn.classList.remove("active");
  nav.classList.remove("active");
  closebtn.classList.remove("active");
});
menubtn.addEventListener("click", function (e) {
  menubtn.classList.add("active");
  nav.classList.add("active");
  closebtn.classList.add("active");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("active");
    menubtn.classList.remove("active");
    closebtn.classList.remove("active");
  });
});

// const apikey = "c7b7cca425a13b40a2b9163d75804c38";

async function getweather(input) {
  const city = input.value;
  const apiurl = `https://api.openweathermap.org/data/2.5/weather?&units=metric&appid=c7b7cca425a13b40a2b9163d75804c38&q=${city}`;
  // https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

  const response = await fetch(apiurl);
  const data = await response.json();
  temp.textContent = data.main.temp + "° ";
  console.log(data);
  updateWeatherIcon(data.weather[0].main);
  leftdetails.textContent = data.main.humidity + "%";
  rightdetails.textContent = data.wind.speed + "km/h";
  cityname.textContent = data.name;
}

input.addEventListener("keydown", function (E) {
  if (E.key === "Enter") {
    getweather(input);
    storedatainlocalstorage();
  }
});
btn.addEventListener("click", function (E) {
  getweather(input);
  storedatainlocalstorage();
});

function updateWeatherIcon(condition) {
  if (condition === "Clear") {
    icon.innerHTML = '<i class="ri-moon-clear-line"></i>';
  } else if (condition === "Clouds") {
    icon.innerHTML = '<i class="ri-cloud-line"></i>';
  } else if (condition === "Rain") {
    icon.innerHTML = '<i class="ri-rainy-line"></i>';
  } else if (condition === "Snow") {
    icon.innerHTML = '<i class="ri-snowflake-line"></i>';
  } else if (condition === "Thunderstorm") {
    icon.innerHTML = '<i class="ri-flashlight-line"></i>';
  } else if (condition === "Mist" || condition === "Haze") {
    icon.innerHTML = '<i class="ri-mist-line"></i>';
  } else if (condition === "Smoke") {
    icon.innerHTML = '<i class="ri-foggy-line"></i>';
  } else {
    icon.innerHTML = '<i class="ri-question-line"></i>';
  }
}

// console.log(slides)
let counter = 0;
slides.forEach((slides, index) => {
  slides.style.left = `${index * 100}%`;
});

const slider = () => {
  slides.forEach(
    (slide) => (slide.style.transform = `translateX(-${counter * 100}%)`)
  );
};

leftbtn.addEventListener("click", function (e) {
  counter--;
  if (counter < 0) {
    counter = slides.length - 1;
  }
  slider();
});

rightbtn.addEventListener("click", function (e) {
  counter++;
  if (counter >= slides.length) {
    counter = 0;
  }
  slider();
});
