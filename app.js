window.addEventListener("load", () => {
  input.value = "";
  searchbarinput.value = "";

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
const searchbarinput = document.querySelector(".Searchbar input");
const hotelcontainer = document.querySelector(".hotels");
const touristcontainer = document.querySelector(".tourist");
const tplaces=document.querySelector('.tplaces')
const cplaces=document.querySelector(".cplaces")
const h33=document.querySelector(".h33")
const forecastparent=document.querySelector(".forecastparent")
const forecasttitle=document.querySelector(".forecasttitle")



async function getforecast(cityname,Day){
  const response=await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityname},IN&appid=c7b7cca425a13b40a2b9163d75804c38&units=metric
`)
    const data=await response.json()
    console.log('data from forecast ',data)
    const days=data.list
     forecastparent.innerHTML = '';
    days.forEach(day=>{
      const Din=new Date(day.dt*1000)
      if(Day.toLocaleDateString('en-US', { weekday: 'long' }) === Din.toLocaleDateString('en-US', { weekday: 'long' })){
       const card = document.createElement('div');
      card.classList.add('forecastCard');
       card.innerHTML = `
        <h3>${cityname}</h3>
        <p>${Din.toLocaleDateString('en-US', { weekday: 'long' })}</p>
        <h3>${day.main.temp}°C</h3>
        <p>${Din.toLocaleTimeString()}</p>
      `;
          forecasttitle.textContent="Weather Forecast"
       forecastparent.appendChild(card);
      }
    })

}

async function getAccomodatons(placeid,cityname) {
  try {
    const response =
      await fetch(`https://api.geoapify.com/v2/places?categories=accommodation.hotel,tourism.attraction&filter=place:${placeid}&limit=20&apiKey=3c87111b37b54aa1bdff9fb64bcb3b77
`);
    const data = await response.json();
    console.log("Data from places", data);

    const places = data.features;
    const hotels = [];
    const touristplaces = [];

    places.forEach((place) => {
      const name = place.properties.name;
      const address = place.properties.formatted;
      const categories = place.properties.categories;
      const lat = place.properties.lat;
      const lon = place.properties.lon;

      if (categories.includes("accommodation.hotel")) {
        if (hotels.length < 4) {
          hotels.push({ name, address, lat, lon });
        }
      } else if (categories.includes("tourism.attraction")) {
        if (touristplaces.length < 4) {
          touristplaces.push({ name, address, lat, lon });
        }
      }
    });
    hotelcontainer.innerHTML = "";
    touristcontainer.innerHTML = "";
    hotels.forEach((hotel) => {
      const div = document.createElement("div");
      const h1 = document.createElement("h1");
      const p = document.createElement("p");

      div.classList.add("hotelcard");
      h1.classList.add("Cardcontent")
      h1.textContent = hotel.name;
      p.classList.add("Cardcontentpara")
      p.textContent = hotel.address;
      cplaces.textContent="Hotels"
      h33.textContent=`This are Some Accomodations and Tourist places for ${cityname}`

      div.appendChild(h1);
      div.appendChild(p);

      hotelcontainer.appendChild(div);
      div.addEventListener("click", function (e) {
        const searchQuery = encodeURIComponent(
          `${hotel.address} ${hotel.lat},${hotel.lon}`
        );
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
        window.open(mapsUrl, "_blank");
      });
    });

    touristplaces.forEach((tour) => {
      const div = document.createElement("div");
      const h1 = document.createElement("h1");
      const p = document.createElement("p");
      div.classList.add("touristcard");
       h1.classList.add("Cardcontent")
      h1.textContent = tour.name;
      p.classList.add("Cardcontentpara")
      p.textContent = tour.address;
      tplaces.textContent="Tourist Places"

      div.appendChild(h1);
      div.appendChild(p);

      touristcontainer.appendChild(div);
      

      div.addEventListener("click", function (e) {
        const searchQuery = encodeURIComponent(
          `${tour.address} ${tour.lat},${tour.lon}`
        );
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
        window.open(mapsUrl, "_blank");
      });
    });

    console.log("hotels", hotels);
    console.log("tourist", touristplaces);
  } catch (error) {
    console.log("Error");
    return null;
  }
}

async function getCitynamegeocode(city,cityname) {
  try {
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${city}&apiKey=3c87111b37b54aa1bdff9fb64bcb3b77`
    );
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const placeId = data.features[0].properties.place_id;
      console.log("placeid", placeId);
      getAccomodatons(placeId ,cityname);
      return placeId;
    } else {
      console.error("City not found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching geocode:", error);
    return null;
  }
}

searchbarinput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const value = searchbarinput.value;
    if (!value) return;
    console.log(value);

    localStorage.setItem("CityImagename", value);
    window.location.href = "cityImages.html";
  }
});

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
      getCitynamegeocode(input.value,input.value);
      getforecast(input.value)

      storedatainlocalstorage();
    });
    recentsearches.appendChild(span);
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

  localStorage.setItem("citydata", JSON.stringify(recentSearches));
  recentsearches.innerHTML = "";
  getRecentseacrchesFromlocalstorage();
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

  const data = await response.json();
  console.log("from location", data);
  temp.textContent = data.main.temp + "° ";
  console.log(data);
  updateWeatherIcon(data.weather[0].main);
  leftdetails.textContent = data.main.humidity + "%";
  rightdetails.textContent = data.wind.speed + "km/h";
  cityname.textContent = data.name;

  getCitynamegeocode(data.name,data.name);
  getforecast(data.name)
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
  console.log("weather data",data);
  updateWeatherIcon(data.weather[0].main);
  leftdetails.textContent = data.main.humidity + "%";
  rightdetails.textContent = data.wind.speed + "km/h";
  cityname.textContent = data.name;
  getforecast(city,new Date(data.dt * 1000))
}

input.addEventListener("keydown", function (E) {
  if (E.key === "Enter") {
    getweather(input);
    storedatainlocalstorage();
    getCitynamegeocode(input.value,input.value);
    
  }
});
btn.addEventListener("click", function (E) {
  getweather(input);
  storedatainlocalstorage();
  getCitynamegeocode(input.value,input.value);
});

function updateWeatherIcon(condition) {
  if (condition === "Clear") {
    icon.innerHTML = '<i class="ri-sun-line"></i>';
  } else if (condition === "Clouds") {
    icon.innerHTML = '<i class="ri-cloud-line"></i>';
  } else if (condition === "Rain") {
    icon.innerHTML = '<i class="ri-rainy-line"></i>';
  } else if (condition === "Drizzle") {
    icon.innerHTML = '<i class="ri-drizzle-line"></i>';
  } else if (condition === "Snow") {
    icon.innerHTML = '<i class="ri-snowflake-line"></i>';
  } else if (condition === "Thunderstorm") {
    icon.innerHTML = '<i class="ri-flashlight-line"></i>';
  } else if (condition === "Mist") {
    icon.innerHTML = '<i class="ri-mist-line"></i>';
  } else if (condition === "Haze") {
    icon.innerHTML = '<i class="ri-haze-line"></i>';
  } else if (condition === "Fog") {
    icon.innerHTML = '<i class="ri-foggy-line"></i>';
  } else if (condition === "Smoke") {
    icon.innerHTML = '<i class="ri-fire-line"></i>';
  } else if (condition === "Dust") {
    icon.innerHTML = '<i class="ri-windy-line"></i>';
  } else if (condition === "Sand") {
    icon.innerHTML = '<i class="ri-windy-fill"></i>';
  } else if (condition === "Ash") {
    icon.innerHTML = '<i class="ri-temp-hot-line"></i>';
  } else if (condition === "Squall") {
    icon.innerHTML = '<i class="ri-typhoon-line"></i>';
  } else if (condition === "Tornado") {
    icon.innerHTML = '<i class="ri-tornado-line"></i>';
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
