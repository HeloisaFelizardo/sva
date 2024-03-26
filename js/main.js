import { getLocation } from './geolocation.js';
import { getWeatherForecast } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  const map = L.map('map')
    .addLayer(
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        fullscreenControl: true,
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      })
    )
    .addControl(new L.Control.Fullscreen());

  getLocation(map)
    .then(location => {
      L.marker(location.latlng)
        .addTo(map)
        .bindPopup(
          `A sua distância a partir deste ponto é de ${Math.round(
            location.accuracy
          )} metros.`
        );
      L.circle(location.latlng, location.accuracy).addTo(map);
      return getWeatherForecast(location.latlng.lat, location.latlng.lng);
    })
    .then(data => {
      // Log os dados retornados no console
      console.log('Dados da previsão do tempo:', data);
      const table = document.createElement('table');
      document.querySelector('.table-responsive').appendChild(table);
      table.innerHTML = `
        <thead>
          <tr>
            <th>Data</th>
            <th>Local</th>
            <th>Hora</th>
            <th>Status</th>
            <th>Chuva prevista na próxima hora</th>
            <th>Chuva (3h)</th>
          </tr>
        </thead>
        <tbody>
          ${data.weather
            .map(
              item =>
                `
            <tr>
              <td>${new Date(data.dt * 1000).toLocaleDateString('pt-BR')}</td>
              <td>${data.name}</td>
              <td>${new Date(data.dt * 1000).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              })}</td>
              <td><img src="https://openweathermap.org/img/wn/${
                item.icon
              }@2x.png" alt="${data.weather[0].description}" title="${
                  data.weather[0].description
                }"></td>
              <td title = 'Chuva prevista na próxima hora.'>${
                data.rain && data.rain['1h'] ? data.rain['1h'] + 'mm' : '-'
              }</td>
              <td>${
                data.rain && data.rain['3h'] ? data.rain['3h'] + 'mm' : '-'
              }</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      `;
      document.querySelector('.clima').innerHTML = `
        <ul>
          <li title = "Local">${data.name}</li>
          <li title = "Temperatura atual">${Math.ceil(data.main.temp)}º C</li>
          <li>
            <img src="https://openweathermap.org/img/wn/${
              data.weather[0].icon
            }@2x.png" class="icon-weather" alt="${
        data.weather[0].description
      }" title="${data.weather[0].description}">
          </li>
          <li class="alert">
            <a href="#alert">
              <img src="images/icons/danger.gif" class="icon-alert" alt="Icone de atenção" title="Alerta de alagamentos">
            </a>
          </li>
        </ul>
      `;
      if (data.rain && data.rain['1h'] > 0.88) {
        console.log('Chuva prevista na próxima hora.');
        document
          .querySelectorAll('.alert')
          .forEach(alert => (alert.style.display = 'block'));
      }
    })
    .catch(console.error);

  const alertIcon = L.icon({
    iconUrl: 'images/icons/danger.gif',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    shadowAnchor: [4, 62],
    popupAnchor: [-1, -5],
  });

  [
    [-22.675293143113894, -42.003851511102056],
    [-22.675782022019927, -42.00718137860491],
    [-22.675285692285698, -42.00755823359581],
    [-22.66089393783962, -42.01120482145359],
    [-22.651438269225444, -42.012323008299965],
    [-22.669893116927966, -42.002593529195785],
    [-22.674835987730578, -42.007107264842624],
  ].forEach(coord => {
    L.marker(coord, { icon: alertIcon })
      .addTo(map)
      .bindPopup('Ponto de alagamento')
      .openPopup();
  });
});
