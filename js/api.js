export const getWeatherForecast = async (latitude, longitude) => {
  const options = { method: 'GET', headers: { accept: 'application/json' } };

  const API_KEY = '1c126dfb6132211311e453cb024abf45';
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&lang=pt_br&units=metric`;

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};

//getWeatherForecast(-23.495095191922058, -46.674226060935254);

//https://api.openweathermap.org/data/2.5/weather?lat=-22.675734060043954&lon=-42.007180532120984&appid=1c126dfb6132211311e453cb024abf45&lang=pt_br&units=metric

//https://api.openweathermap.org/data/2.5/weather?lat=-22.674835987730578&lon=-42.007107264842624&appid=1c126dfb6132211311e453cb024abf45&lang=pt_br&units=metric
