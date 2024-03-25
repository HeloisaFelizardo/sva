let map = L.map('map').setView([-22.674835987730578, -42.007107264842624], 19);
//let map = L.map('map');
//map.setZoom(18);
//map.locate({ setView: true, maxZoom: 16 });

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

function onLocationFound(e) {
  var radius = e.accuracy;

  L.marker(e.latlng)
    .addTo(map)
    .bindPopup('You are within ' + radius + ' meters from this point')
    .openPopup();

  L.circle(e.latlng, radius).addTo(map);
}

map.on('locationfound', onLocationFound);

let alertIcon = L.icon({
  iconUrl: 'images/icons/danger.gif',

  iconSize: [40, 40], // size of the icon
  iconAnchor: [20, 20], // point of the icon which will correspond to marker's location
  shadowAnchor: [4, 62], // the same for the shadow
  popupAnchor: [-1, -5], // point from which the popup should open relative to the iconAnchor
});

L.marker([-22.675293143113894, -42.003851511102056], { icon: alertIcon })
  .addTo(map)
  .bindPopup('Ponto de alagamento')
  .openPopup();

L.marker([-22.675782022019927, -42.00718137860491], { icon: alertIcon })
  .addTo(map)
  .bindPopup('Ponto de alagamento')
  .openPopup();

L.marker([-22.675285692285698, -42.00755823359581], { icon: alertIcon })
  .addTo(map)
  .bindPopup('Ponto de alagamento')
  .openPopup();

L.marker([-22.66089393783962, -42.01120482145359], { icon: alertIcon })
  .addTo(map)
  .bindPopup('Ponto de alagamento')
  .openPopup();

L.marker([-22.651438269225444, -42.012323008299965], { icon: alertIcon })
  .addTo(map)
  .bindPopup('Ponto de alagamento')
  .openPopup();

L.marker([-22.669893116927966, -42.002593529195785], { icon: alertIcon })
  .addTo(map)
  .bindPopup('Ponto de alagamento')
  .openPopup();

L.marker([-22.674835987730578, -42.007107264842624])
  .addTo(map)
  .bindPopup('Você está aqui')
  .openPopup();
