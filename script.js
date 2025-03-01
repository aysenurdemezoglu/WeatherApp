const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherInfo = document.getElementById('weather-info');
const apiKey = '6dc0a38f8a75d34ad1b9dcacb176e108'; 

searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        getWeatherData(city);
    } else {
        alert('Please enter a city name.');
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

async function getWeatherData(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();

        if (data.cod === 200) {
            displayWeather(data);
        } else {
            weatherInfo.innerHTML = `<p>City not found. Please try again.</p>`;
        }
    } catch (error) {
        weatherInfo.innerHTML = `<p>Error fetching weather data. Please check your connection.</p>`;
        console.error('Error retrieving weather information:', error);

    }
}

function displayWeather(data) {
    const { name, main, weather, dt, timezone } = data;
    const background = document.querySelector('.weather-background');
    
    const currentTime = new Date((dt + timezone) * 1000).getHours();
    const isDayTime = currentTime > 6 && currentTime < 20;

    const imagePaths = {
        
        Clear: isDayTime ? 'images/sunny-day.jpg' : 'images/clear-night.jpg',
        Clouds: isDayTime ? 'images/cloudy-day.jpg' : 'images/cloudy-night.jpg',
        Rain: 'images/rain.jpg',
        Snow: 'images/snow.jpg',
        Thunderstorm: 'images/storm.jpg',
        Mist: 'images/fog.jpg',
        Smoke: 'images/fog.jpg',
        Haze: 'images/fog.jpg',
        Drizzle: 'images/drizzle.jpg'
    };
    const weatherMain = weather[0].main;


    background.style.opacity = '0';
    setTimeout(() => {
        background.style.backgroundImage = `url(${
            imagePaths[weatherMain] || 'images/default.jpg'
        })`;
        background.style.opacity = '0.9'; 
    }, 300);

    const capitalizeEachWord = (str) => str.replace(/\b\w/g, char => char.toUpperCase());
    
    weatherInfo.innerHTML = `
        <h2>${name}</h2>
        <p>Temperature: ${main.temp.toFixed(1)}°C</p>
        <p>Feels like: ${main.feels_like.toFixed(1)}°C</p>
        <p>Condition: ${capitalizeEachWord(weather[0].description)}</p>
        <p>Humidity: ${main.humidity}%</p>
    `;
}