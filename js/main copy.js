import { getLocation } from './geolocation.js';
import { getWeatherForecast } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  const map = L.map('map').addLayer(
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    })
  );

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

      // Verifique se o array de weather tem mais de um objeto
      const dados =
        data.weather.length > 1
          ? // Se tiver, itere sobre o array weather e crie um novo objeto dado
            // para cada item com uma data, local, hora e status correspondentes
            data.weather.map(item => ({
              data: new Date(data.dt * 1000).toLocaleDateString('pt-BR'),
              local: data.name,
              hora: new Date(data.dt * 1000).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              }),
              status: [item.description].join(', '),
              icon: [item.icon].join(', '),
              rain_1h: item.rain_1h,
              rain_3h: item.rain_3h,
            }))
          : // Se tiver um objeto, retorne um único objeto dado
            [
              {
                data: new Date(data.dt * 1000).toLocaleDateString('pt-BR'),
                local: data.name,
                hora: new Date(data.dt * 1000).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
                status: data.weather[0].description,
                icon: data.weather[0].icon,
                rain_1h: data.rain?.['1h'],
                rain_3h: data.rain?.['3h'],
              },
            ];

      // Selecionar o elemento com a classe 'table-responsive'
      const tableResponsive = document.querySelector('.table-responsive');

      // Criar um novo elemento de tabela
      const table = document.createElement('table');

      // Anexar a tabela ao elemento 'table-responsive'
      tableResponsive.appendChild(table);

      // Criar o cabeçalho da tabela
      const thead = document.createElement('thead');

      // Definir o innerHTML do cabeçalho da tabela
      thead.innerHTML = `
        <tr>
          <th>Data</th>
          <th>Local</th>
          <th>Hora</th>
          <th>Status</th>
          <th>Chuva (1h)</th>
          <th>Chuva (3h)</th>
        </tr>
      `;

      // Anexar o cabeçalho da tabela à tabela
      table.appendChild(thead);

      // Criar o corpo da tabela
      const tbody = document.createElement('tbody');

      // Anexar o corpo da tabela à tabela
      table.appendChild(tbody);

      // Loop através do array dados e criar linhas de tabela para cada dado
      dados.forEach(dado => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
        <td title="${dado.data}">${dado.data}</td>
        <td title="${dado.local}">${dado.local}</td>
        <td title="${dado.hora}">${dado.hora}</td>
        <td title="${dado.status}">
            <img src="https://openweathermap.org/img/wn/${
              dado.icon
            }@2x.png" alt="">           
        </td>
        <td title=" Volume de chuva na última 1 hora">
            ${dado.rain_1h ? dado.rain_1h + 'mm' : '-'}
        </td>
        <td title=" Volume de chuva nas últimas 3 horas">
            ${dado.rain_3h ? dado.rain_3h + 'mm' : '-'}
        </td>
        `;
        // Anexar as linhas da tabela ao corpo da tabela
        tbody.appendChild(tr);
      });

      // Selecionar o elemento com a classe 'clima'
      const clima = document.querySelector('.clima');

      const ul = document.createElement('ul');
      clima.appendChild(ul);
      // Definir o innerHTML do clima
      ul.innerHTML = `
        <li>${data.name}</li>
        <li>${Math.ceil(data.main.temp)}º C</li>
        <li>
            <img src="https://openweathermap.org/img/wn/${
              data.weather[0].icon
            }@2x.png" class="icon-weather"
                alt="${data.weather[0].description}" title="
                ${data.weather[0].description}">
        </li>
        <li class="alert">       
          <a href="#alert">
            <img src="images/icons/danger.gif" class="icon-alert" alt="Icone de atenção" title="Alerta de alagamentos">    
          </a>
        </li>
      `;

      // Verifique se a propriedade rain está disponível nos dados
      if (data.hasOwnProperty('rain')) {
        // Se estiver, anexe os valores '1h' e '3h' aos objetos dado
        data.weather = data.weather.map(item => ({
          ...item,
          rain_1h: data.rain['1h'],
          rain_3h: data.rain['3h'],
        }));

        // Verificar se a quantidade de chuva em 1 hora é maior que 0.1
        if (data.weather.some(item => item.rain_1h > 0.88)) {
          // Selecionar todos os elementos com a classe 'alert'
          const alerts = document.querySelectorAll('.alert');
          // Iterar sobre cada elemento e exibir o alerta
          alerts.forEach(alert => {
            console.log(alert);
            alert.style.display = 'block';
          });
        }
      }
    })
    .catch(error => {
      console.error(
        'Erro ao obter a localização ou a previsão do tempo:',
        error
      );
    });

  const alertIcon = L.icon({
    iconUrl: 'images/icons/danger.gif',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    shadowAnchor: [4, 62],
    popupAnchor: [-1, -5],
  });

  const alerts = [
    [-22.675293143113894, -42.003851511102056],
    [-22.675782022019927, -42.00718137860491],
    [-22.675285692285698, -42.00755823359581],
    [-22.66089393783962, -42.01120482145359],
    [-22.651438269225444, -42.012323008299965],
    [-22.669893116927966, -42.002593529195785],
    [-22.674835987730578, -42.007107264842624],
  ];

  alerts.forEach(coord => {
    L.marker(coord, { icon: alertIcon })
      .addTo(map)
      .bindPopup('Ponto de alagamento')
      .openPopup();
  });
});
