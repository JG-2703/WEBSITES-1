const apiKey = "fcfe8d1d70dcb7432dc6b7a354d6f419";

    const main = document.getElementById('main');
    const form = document.getElementById('form');
    const search = document.getElementById('search');

    const currentWeatherUrl = (city) => `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = (city) => `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    async function getWeatherByLocation(city) {
      try {
        const resp = await fetch(currentWeatherUrl(city));
        const respData = await resp.json();
        console.log(respData);
        addWeatherToPage(respData);
        const forecastResp = await fetch(forecastUrl(city));
        const forecastData = await forecastResp.json();
        console.log(forecastData);
        addForecastToPage(forecastData);
      } catch (error) {
        console.error(error);
      }
    }

    function addWeatherToPage(data) {
        const temp = Ktoc(data.main.temp);
      
        const weather = document.createElement('div');
        weather.classList.add('weather');
      
        const weatherIcon = data.weather[0].icon;
        const weatherCondition = data.weather[0].main;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        const dateTime = new Date(data.dt * 1000).toLocaleString();
      
        weather.innerHTML = `
          <h2><img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" /> ${temp}°C <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" /></h2>
          <p class="weather-info">Condition: ${weatherCondition}</p>
          <p class="weather-info">Humidity: ${humidity}%</p>
          <p class="weather-info">Wind Speed: ${windSpeed} m/s</p>
          <p class="weather-info">Date and Time: ${dateTime}</p>
        `;
      
        main.innerHTML = "";
        main.appendChild(weather);
      }
      
    function addForecastToPage(data) {
        const forecastDates = [];
        const forecastTemps = [];
      
        for (let i = 0; i < data.list.length; i++) {
          const forecastItem = data.list[i];
          const forecastDate = new Date(forecastItem.dt * 1000).toLocaleDateString();
          const forecastTemp = Ktoc(forecastItem.main.temp);
      
          forecastDates.push(forecastDate);
          forecastTemps.push(forecastTemp);
        }
      
        const forecastChartContainer = document.createElement('div');
        forecastChartContainer.style.width = '500px';
        forecastChartContainer.style.height = '300px';
      
        const forecastChartCanvas = document.createElement('canvas');
        forecastChartCanvas.id = 'forecast-chart';
      
        forecastChartContainer.appendChild(forecastChartCanvas);
        main.appendChild(forecastChartContainer);
      
        new Chart(forecastChartCanvas, {
          type: 'line',
          data: {
            labels: forecastDates,
            datasets: [{
              label: 'Temperature',
              data: forecastTemps,
              backgroundColor: 'rgba(0, 123, 255, 0.4)',
              borderColor: 'rgba(0, 123, 255, 1)',
              borderWidth: 2
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Temperature (°C)'
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Date'
                }
              }
            }
          }
        });
      }
      
      

    function Ktoc(K) {
      return Math.floor(K - 273.15);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const city = search.value;
      if (city) {
        getWeatherByLocation(city);
      }
    });