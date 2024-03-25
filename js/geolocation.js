export function getLocation(map) {
  return new Promise((resolve, reject) => {
    map
      .locate({ setView: true, maxZoom: 16 })
      .on('locationfound', e => {
        resolve(e);
      })
      .on('locationerror', e => {
        reject(e.message);
      });
  });
}
