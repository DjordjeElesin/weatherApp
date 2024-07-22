const searchInput = document.getElementById("search"),
      searchBtn = document.getElementById("searchBtn");

const weatherIcon = document.getElementById("weatherIcon"),
      tempeture  = document.querySelector(".temp"),
      description = document.querySelector(".description"),
      location = document.querySelector(".location"),
      humidity = document.querySelector(".humidity"),
      wind = document.querySelector(".wind"),
      maxTemp = document.querySelector(".maxTemp"),
      minTemp = document.querySelector(".minTemp");

const bottomRightContr = document.querySelector('.bottomRightContr');

const notFound = document.querySelector(".notFound"),
      imgContr = document.querySelector(".imgContr"),
      contentContr = document.querySelector(".contentContr"),
      weatherInfoContr = document.querySelector(".weatherInfoContr"),
      instructions = document.querySelector(".instructions");
      


const APIKey = '0ff687f587586bc163f0743e1f2661fa';
const APIKey2 = '81bcd41356e943638ec133151242007';

searchBtn.addEventListener("click", ()=>{
  let weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput.value.toLowerCase()}&units=metric&appid=${APIKey}`;
  
  getData(weatherURL)
  .then(updateWeather)
  .catch((error)=> console.error(error));
});

searchInput.addEventListener("keydown", (e) => {
  if(e.key === "Enter"){
    let weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput.value.toLowerCase()}&units=metric&appid=${APIKey}`;
  
    getData(weatherURL)
      .then((data) => {
        if(data){
          updateWeather(data);
        }
      })
      .catch((error)=> console.error(error));
  }
})


const getData= (url)=>{
  return axios
  .get(url)
  .then((response) => {
    return response.data;
  })
  .catch((error) => {
    if(error.response.status === 404){
      notFound.style.visibility = "visible";
      instructions.style.visibility = "hidden";
      contentContr.style.visibility = "hidden";
      imgContr.style.visibility = "hidden";
      weatherInfoContr.style.visibility = "hidden";
      bottomRightContr.innerHTML = ""

      
      throw new Error("Location was not found")
    }
    console.error(error)
  });
}

const updateWeather = (data) =>{
  instructions.style.visibility = "hidden";
  notFound.style.visibility = "hidden";
  contentContr.style.visibility = 'visible';
  weatherInfoContr.style.visibility = 'visible';
  imgContr.style.visibility = 'visible';

  console.log(data.weather[0].main);
  weatherIcon.src = `images/${data.weather[0].main}.png`; 
  tempeture.innerHTML = `${Math.round(data.main.temp)}<span>C&deg;</span>`;
  description.textContent = data.weather[0].main;
  location.textContent = `${data.name}, ${data.sys.country}`;
  humidity.textContent = `${data.main.humidity}%`;
  wind.textContent = `${data.wind.speed} km/h`;
  

  let forecastURL = `http://api.weatherapi.com/v1/forecast.json?key=${APIKey2}&q=${data.coord.lat},${data.coord.lon}`;
  getData(forecastURL)
  .then(updateForecast)
  .catch((error) => console.error(error));

}

const updateForecast = (data) => {
  let hourTempArr = data.forecast.forecastday[0].hour; 
  maxTemp.innerHTML = `${Math.round(data.forecast.forecastday[0].day.maxtemp_c)} C&deg;`
  minTemp.innerHTML = `${Math.round(data.forecast.forecastday[0].day.mintemp_c)} C&deg;`

  bottomRightContr.innerHTML = '';

  hourTempArr.forEach((element) => {
    let icon = document.createElement('img');
    icon.src = element.condition.icon;

    let time = document.createElement('p');
    time.className = "hour";
    time.textContent = `${formatTime(element.time_epoch)}:00`;

    let hourTemp = document.createElement('p');
    hourTemp.className = "hourTemp";
    hourTemp.innerHTML = `${Math.round(element.temp_c)}&deg;`

    let hourWeather = document.createElement('div');
    hourWeather.className = "hourWeather";
    hourWeather.appendChild(icon)
    hourWeather.appendChild(time)
    hourWeather.appendChild(hourTemp);

    bottomRightContr.appendChild(hourWeather)
  });

}

function formatTime(timestamp){
  const date = new Date(timestamp * 1000);
  const hour = date.getHours().toString().padStart(2, '0');

  return hour;
}
