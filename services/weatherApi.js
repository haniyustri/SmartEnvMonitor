import axios from 'axios';

const API_KEY = 'ea4c744299e372df5fbdccb7075636ac';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getWeather = async (city = 'Surabaya') => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
        lang: 'id',
      },
    });

    const data = response.data;
    return {
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      description: data.weather[0].description,
      wind: Math.round(data.wind.speed * 3.6), // convert m/s ke km/h
      city: data.name,
    };
  } catch (error) {
    console.error('Weather API error:', error);
    return null;
  }
};