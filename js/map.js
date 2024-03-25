// Make sure that the map is initialized and available
let map;

document.addEventListener('DOMContentLoaded', () => {
  map = L.map('map');

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // map.setZoom(18);

  // Add the geolocation functionality after the map is initialized
  map
    .locate({ setView: true, maxZoom: 19 })
    .on('locationfound', onLocationFound);

  // onLocationFound callback
  function onLocationFound(e) {
    let radius = e.accuracy;
    let marker = L.marker(e.latlng).addTo(map);
    marker.bindPopup(
      `You are within ${Math.round(radius)} meters from this point`
    );

    L.circle(e.latlng, radius).addTo(map);
  }

  function onLocationError(e) {
    alert(e.message);
  }

  map.on('locationerror', onLocationError);

  // Add custom markers and alerts
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
