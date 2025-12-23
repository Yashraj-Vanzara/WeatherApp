const Apikey = "108ef3d364db5f4e1ea670addb037a25";
// const ApiUrl="https://api.openweathermap.org/data/2.5/weather?q=Bangalore&appid="

const CityName = document.querySelector(".input input");
const SearchBtn = document.querySelector("button");
const temprature = document.querySelector(".Temperature");

SearchBtn.addEventListener("click", function (e) {
  const data = CityName.value.toLowerCase();
  if(data==''||null) return alert("Please Enter Correct City")
  CityName.value = "";
  WeatherData(data);
});

async function WeatherData(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&units=metric&appid=${Apikey}`
  );

  const data = await response.json();
//   if(data.temp==='undefined') return alert("no city found")
  temprature.textContent = data.main.temp + "°";

  gethumidity(data);
  getwindspeed(data);
  setWeatherIcon(data);
}

CityName.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const city = CityName.value.trim().toLowerCase();
    if (city === "") return;

    CityName.value = "";
    WeatherData(city);
  }
});

function setWeatherIcon(data) {
  const iconDiv = document.querySelector(".weathericon");

  const condition = data.weather[0].main;

  if (condition === "Rain") {
    iconDiv.innerHTML = `<i class="ri-rainy-line"></i>`;
  } else if (condition === "Clouds") {
    iconDiv.innerHTML = `<i class="ri-cloudy-line"></i>`;
  } else if (condition === "Clear") {
    iconDiv.innerHTML = `<i class="ri-sun-fill"></i>`;
  } else if (condition === "Snow") {
    iconDiv.innerHTML = `<i class="ri-snowflake-line"></i>`;
  } else {
    iconDiv.innerHTML = `<i class="ri-cloud-line"></i>`;
  }
}

function gethumidity(data) {
  const humidity = document.querySelector(".Humidity p");
  humidity.textContent = data.main.humidity + "%";
}

function getwindspeed(data) {
  const winddiv = document.querySelector(".brez");
  winddiv.textContent = data.wind.speed + "km/h";
}
